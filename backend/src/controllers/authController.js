const authService = require("../services/authService");

const handleControllerError = (res, error, context) => {
    console.error(`Error in ${context}:`, error);
    
    const message = error?.message || "An error occurred";
    
    if (
        message.includes("required") ||
        message.includes("Invalid data types") ||
        message.includes("Invalid email format") ||
        message.includes("Invalid OTP") ||
        message.includes("expired") ||
        message.includes("least 6 characters")
    ) {
        return res.status(400).json({ message });
    }
    
    if (message.includes("not found")) {
        return res.status(404).json({ message });
    }
    
    if (message.includes("already exists")) {
        return res.status(409).json({ message });
    }

    if (message.includes("Database error saving user")) {
        return res.status(500).json({ message });
    }

    if (message.includes("Failed to send verification email")) {
        return res.status(503).json({ message });
    }
    
    if (message.includes("blocked") || message.includes("not verified")) {
        return res.status(403).json({ message });
    }
    
    if (message.includes("password")) {
        return res.status(401).json({ message });
    }
    
    return res.status(500).json({ message: "Internal server error" });
};

exports.signUp = async (req, res) => {
    try {
        const result = await authService.signUp(req.body);
        return res.status(201).json(result);
    } catch (error) {
        return handleControllerError(res, error, "signUp controller");
    }
};

exports.signIn = async (req, res) => {
    try {
        const result = await authService.signIn(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "signIn controller");
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const result = await authService.verifyOtp(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "verifyOtp controller");
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "forgotPassword controller");
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const result = await authService.verifyResetPassword(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "resetPassword controller");
    }
};