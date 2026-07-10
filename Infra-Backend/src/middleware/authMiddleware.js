const { verifyToken } = require("../services/authService");

const validateRequestBody = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            })),
        });
    }

    req.body = value;
    return next();
};

const getTokenFromRequest = (req) => {
    if (req.cookies?.token) return req.cookies.token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return null;
};

const protect = (req, res, next) => {
    console.log("========== AUTH DEBUG ==========");
    console.log("Origin:", req.headers.origin);
    console.log("Cookies:", req.cookies);
    console.log("Authorization:", req.headers.authorization);

    try {
        const token = getTokenFromRequest(req);

        console.log("Extracted Token:", token);

        if (!token) {
            console.log("No token received");
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const decoded = verifyToken(token);

        console.log("Decoded:", decoded);

        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.log("JWT Error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        next();
    };
};

module.exports = {
    validateRequestBody,
    protect,
    authorizeRoles,
};