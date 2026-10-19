const Joi = require("joi");
const {
    validateRequestBody,
    validateRequestParams,
    validateRequestQuery,
} = require("../middleware/authMiddleware");

const listUsersSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100),
    role: Joi.string().valid("Admin", "Engineer", "Inspector"),
    status: Joi.string().valid("active", "inactive"),
    verified: Joi.boolean(),
    sort: Joi.string().valid("newest", "oldest", "name").default("newest"),
});

const userIdParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const updateStatusSchema = Joi.object({
    isActive: Joi.boolean().required().messages({
        "any.required": "isActive is required (true or false).",
        "boolean.base": "isActive must be true or false.",
    }),
    reason: Joi.string().trim().max(300).allow(""),
});

const updateRoleSchema = Joi.object({
    role: Joi.string().valid("Inspector", "Engineer").required().messages({
        "any.only": "Role must be either Inspector or Engineer.",
        "any.required": "Role is required.",
    }),
});

module.exports = {
    listManagedUsersValidation: validateRequestQuery(listUsersSchema),
    userIdParamValidation: validateRequestParams(userIdParamSchema),
    updateUserStatusValidation: validateRequestBody(updateStatusSchema),
    updateUserRoleValidation: validateRequestBody(updateRoleSchema),
};