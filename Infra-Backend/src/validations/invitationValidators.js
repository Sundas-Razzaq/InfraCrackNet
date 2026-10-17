const Joi = require("joi");
const {
    validateRequestBody,
    validateRequestParams,
    validateRequestQuery,
} = require("../middleware/authMiddleware");

const objectId = Joi.string().hex().length(24);

const createInvitationSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        "string.email": "Please provide a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),

    role: Joi.string().valid("Inspector", "Engineer").required().messages({
        "any.only": "Role must be either Inspector or Engineer.",
        "any.required": "Role is required.",
    }),
});

const listInvitationsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid("Pending", "Accepted", "Rejected", "Expired"),
    role: Joi.string().valid("Inspector", "Engineer"),
    email: Joi.string().trim().max(100),
});

const invitationIdParamSchema = Joi.object({
    id: objectId.required(),
});

const invitationTokenParamSchema = Joi.object({
    token: Joi.string().hex().length(64).required(),
});

// Role is deliberately NOT accepted here: it always comes from the invitation.
const acceptInvitationSchema = Joi.object({
    name: Joi.string().trim().min(3).required().messages({
        "string.min": "Name must be at least 3 characters long.",
        "string.empty": "Name is required.",
        "any.required": "Name is required.",
    }),

    password: Joi.string().min(6).pattern(/\d/).required().messages({
        "string.min": "Password must be at least 6 characters long.",
        "string.pattern.base": "Password must contain at least one number.",
        "string.empty": "Password is required.",
        "any.required": "Password is required.",
    }),
});

module.exports = {
    createInvitationValidation: validateRequestBody(createInvitationSchema),
    listInvitationsValidation: validateRequestQuery(listInvitationsSchema),
    invitationIdParamValidation: validateRequestParams(invitationIdParamSchema),
    invitationTokenParamValidation: validateRequestParams(invitationTokenParamSchema),
    acceptInvitationValidation: validateRequestBody(acceptInvitationSchema),
};