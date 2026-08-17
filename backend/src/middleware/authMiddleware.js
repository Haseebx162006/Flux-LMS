
const jwt = require('jsonwebtoken');
const prisma = require("../config/prisma");


exports.authenticateUser = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization header missing or invalid" });
        }

        const token = header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }
        
       
        const secret = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';
        const decoded = jwt.verify(token, secret);

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "User is not verified" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error("Error in authenticateUser middleware:", error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ message: "Admin access denied" });
    }
};