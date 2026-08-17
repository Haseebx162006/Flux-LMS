const prisma = require('../config/prisma');
const tokenGenerator = require('../utilities/token');
const bcrypt = require('bcrypt');
const OtpGenerator = require('../utilities/generateOtp');
const { sendOtpEmail, sendPasswordResetEmail } = require('./emailService');

// SignUp Method for registering a new user with universityMail
exports.signUp = async (data) => {
    const { name, email, password} = data;

    // Validate input fields
    if (!name || !email || !password ) {
        throw new Error("All fields are required");
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        throw new Error("Invalid data types");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }

    // Check if user already exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.isVerified) {
        throw new Error("User already exists");
    }

    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP and set expiry
    const otp = OtpGenerator();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    try {
        if (user) {
            // Update details of existing unverified user
            await prisma.user.update({
                where: { email },
                data: {
                    name,
                    password: hashedPassword,
                    otp,
                    otpExpiry
                }
            });
        } else {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    otp,
                    otpExpiry
                }
            });
        }
    } catch (error) {
        console.error("Error saving user in signUp:", error);
        throw new Error("Database error saving user");
    }

    try {
        await sendOtpEmail(email, otp);
    } catch (error) {
        console.error("Error sending OTP email during signUp:", error);
        throw new Error("Failed to send verification email");
    }

    return { message: "OTP sent successfully" };
};



exports.signIn = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error("Invalid data types");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.isVerified) {
        throw new Error("User is not verified");
    }
    if (user.isBlocked) {
        throw new Error("User is blocked");
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

exports.verifyOtp = async (data) => {
    const { email, otp } = data;

    if (!email || !otp) {
        throw new Error("Email and OTP are required");
    }

    if (typeof email !== 'string' || typeof otp !== 'string') {
        throw new Error("Invalid data types");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.otp || user.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    if (user.otpExpiry < new Date()) {
        throw new Error("OTP has expired");
    }

    try {
        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null
            }
        });
    } catch (error) {
        console.error("Error saving verified user:", error);
        throw new Error("Database error");
    }

    return { message: "User verified successfully" };
};

exports.forgotPassword = async (data) => {
    const { email } = data;

    if (!email) {
        throw new Error("Email is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.isBlocked) {
        throw new Error("User is blocked");
    }
    if (!user.isVerified) {
        throw new Error("User is not verified");
    }

    const otp = OtpGenerator();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    try {
        await prisma.user.update({
            where: { email },
            data: {
                passwordResetOtp: otp,
                passwordResetOtpExpiry: otpExpiry
            }
        });
    } catch (error) {
        console.error("Error saving password reset OTP:", error);
        throw new Error("Database error");
    }

    try {
        await sendPasswordResetEmail(email, otp);
    } catch (error) {
        console.error("Error sending password reset OTP email:", error);
        throw new Error("Failed to send OTP email");
    }

    return { message: "Verification code sent successfully" };
};

exports.verifyResetPassword = async (data) => {
    const { email, otp, newPassword } = data;

    if (!email || !otp || !newPassword) {
        throw new Error("Email, OTP, and new password are required");
    }

    if (typeof email !== 'string' || typeof otp !== 'string' || typeof newPassword !== 'string') {
        throw new Error("Invalid data types");
    }

    if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }

    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.passwordResetOtp || user.passwordResetOtp !== otp) {
        throw new Error("Invalid OTP");
    }

    if (user.passwordResetOtpExpiry < new Date()) {
        throw new Error("OTP has expired");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    try {
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                passwordResetOtp: null,
                passwordResetOtpExpiry: null
            }
        });
    } catch (error) {
        console.error("Error saving reset password:", error);
        throw new Error("Database error");
    }

    return { message: "Password reset successfully" };
};