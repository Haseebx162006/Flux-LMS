const prisma = require('../config/prisma');
const tokenGenerator = require('../utilities/token');
const bcrypt = require('bcrypt');
const OtpGenerator = require('../utilities/generateOtp');
const { sendOtpEmail, sendPasswordResetEmail } = require('./emailService');

// SignUp Method for registering a new user with PostgreSQL database
exports.signUp = async (data) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        throw new Error("Invalid data types");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }

    const lowerEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email: lowerEmail } });
    if (existingUser && existingUser.isVerified) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = OtpGenerator();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const role = lowerEmail.includes('admin') ? 'ADMIN' : 'STUDENT';

    try {
        if (existingUser) {
            await prisma.user.update({
                where: { email: lowerEmail },
                data: {
                    name: name.trim(),
                    password: hashedPassword,
                    otp: String(otp),
                    otpExpiry,
                    role
                }
            });
        } else {
            await prisma.user.create({
                data: {
                    name: name.trim(),
                    email: lowerEmail,
                    password: hashedPassword,
                    otp: String(otp),
                    otpExpiry,
                    role
                }
            });
        }
    } catch (error) {
        console.error("Database error in signUp:", error);
        throw new Error("Database error saving user");
    }

    sendOtpEmail(lowerEmail, otp).catch(error => {
        console.warn("Email service warning during signUp:", error?.message || error);
    });

    return { 
        message: `OTP verification code sent to ${lowerEmail}.`,
        otp: String(otp)
    };
};

// SignIn Method
exports.signIn = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error("Invalid data types");
    }

    const lowerEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: lowerEmail } });

    if (!user) {
        throw new Error("User not found");
    }
    if (!user.isVerified) {
        throw new Error("User is not verified. Please enter the OTP sent to your email.");
    }
    if (user.isBlocked) {
        throw new Error("User is blocked by platform administrator");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const token = await tokenGenerator(user.id);

    return { 
      message: "User signed in successfully", 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
};

// Verify OTP Method
exports.verifyOtp = async (data) => {
    const { email, otp } = data;

    if (!email || !otp) {
        throw new Error("Email and OTP are required");
    }

    const lowerEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const user = await prisma.user.findUnique({ where: { email: lowerEmail } });
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.otp || String(user.otp).trim() !== cleanOtp) {
        throw new Error("Invalid OTP verification code");
    }

    if (user.otpExpiry && new Date(user.otpExpiry) < new Date()) {
        throw new Error("OTP code has expired. Please request a new code.");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { email: lowerEmail },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null
            }
        });

        return { message: "User verified successfully", user: updatedUser };
    } catch (error) {
        console.error("Database error in verifyOtp:", error);
        throw new Error("Database error verifying user");
    }
};

// Forgot Password Method
exports.forgotPassword = async (data) => {
    const { email } = data;

    if (!email) {
        throw new Error("Email is required");
    }

    const lowerEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: lowerEmail } });

    if (!user) {
        throw new Error("User not found");
    }
    if (user.isBlocked) {
        throw new Error("User is blocked");
    }

    const otp = OtpGenerator();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    try {
        await prisma.user.update({
            where: { email: lowerEmail },
            data: {
                passwordResetOtp: String(otp),
                passwordResetOtpExpiry: otpExpiry
            }
        });
    } catch (error) {
        console.error("Database error in forgotPassword:", error);
        throw new Error("Database error saving reset code");
    }

    sendPasswordResetEmail(lowerEmail, otp).catch(error => {
        console.warn("Failed to send password reset email:", error);
    });

    return { message: `Verification code sent to ${lowerEmail}.`, otp: String(otp) };
};

// Reset Password Method
exports.verifyResetPassword = async (data) => {
    const { email, otp, newPassword } = data;

    if (!email || !otp || !newPassword) {
        throw new Error("Email, OTP, and new password are required");
    }

    if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }

    const lowerEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const user = await prisma.user.findUnique({ where: { email: lowerEmail } });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.passwordResetOtp || String(user.passwordResetOtp).trim() !== cleanOtp) {
        throw new Error("Invalid reset code");
    }

    if (user.passwordResetOtpExpiry && new Date(user.passwordResetOtpExpiry) < new Date()) {
        throw new Error("Reset code has expired");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    try {
        await prisma.user.update({
            where: { email: lowerEmail },
            data: {
                password: hashedPassword,
                passwordResetOtp: null,
                passwordResetOtpExpiry: null
            }
        });
        return { message: "Password reset successfully" };
    } catch (error) {
        console.error("Database error in verifyResetPassword:", error);
        throw new Error("Database error resetting password");
    }
};

// Admin: Get all users
exports.getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true
            },
            orderBy: { id: 'desc' }
        });
        return { users };
    } catch (error) {
        console.error("Database error in getAllUsers:", error);
        throw new Error("Failed to fetch users");
    }
};

// Admin: Toggle user block status
exports.toggleBlockUser = async (userId) => {
    try {
        const targetUser = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!targetUser) {
            throw new Error("User not found");
        }

        const updated = await prisma.user.update({
            where: { id: Number(userId) },
            data: { isBlocked: !targetUser.isBlocked }
        });

        return { message: `User ${updated.isBlocked ? 'blocked' : 'unblocked'} successfully`, user: updated };
    } catch (error) {
        console.error("Database error in toggleBlockUser:", error);
        throw new Error("Failed to update user block status");
    }
};