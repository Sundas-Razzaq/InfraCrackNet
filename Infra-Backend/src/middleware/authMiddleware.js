const mongoose = require("mongoose");
const User = require("../models/user");
const { verifyToken } = require("../services/authService");

const validateRequestBody = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body ?? {}, {
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

const validateRequestParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        next();
    };
};

const validateRequestQuery = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
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

    req.validatedQuery = value;
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

const protect = async (req, res, next) => {
    // 1) Verify the token itself
    let decoded;

    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        decoded = verifyToken(token);
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }

    // 2) Check the user against the database
    try {
        if (!mongoose.isValidObjectId(decoded.userId)) {
            return res.status(401).json({
                message: "Invalid or expired token",
            });
        }

        const user = await User.findById(decoded.userId)
            .select("role isActive")
            .lean();

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists",
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: "Account is deactivated",
            });
        }

        req.user = {
            id: user._id.toString(),
            role: user.role, // role comes from DB, not from the token
        };

        next();
    } catch (error) {
        next(error);
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
    validateRequestParams,
    validateRequestQuery,
    protect,
    authorizeRoles,
};