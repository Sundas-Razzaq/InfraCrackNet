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
    if (req.cookies?.token) {
        return req.cookies.token;
    }

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return null;
};

const protect = (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const decoded = verifyToken(token);
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = {
    validateRequestBody,
    protect,
};
