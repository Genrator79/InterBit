
const isAdminUser = (req, res, next) => {
    if (!req.userInfo || req.userInfo.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied! Admin rights required."
        });
    }
    next();
};

module.exports = isAdminUser;