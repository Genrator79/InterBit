const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied, no token provided. Please login again."
        });
    }

    try {
        const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodeTokenInfo;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.name === "TokenExpiredError"
                ? "Token expired. Please login again."
                : "Access denied, invalid token. Please login again."
        });
    }
};

module.exports = authMiddleware;
