const Joi = require("joi");
const { validateRequestQuery } = require("../middleware/authMiddleware");
const {
    ACTIVITY_ACTION_VALUES,
    ACTIVITY_TARGET_TYPES,
} = require("../utils/activityActions");

const objectId = Joi.string().hex().length(24);

const listActivityLogsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),

    action: Joi.string().valid(...ACTIVITY_ACTION_VALUES),
    actor: objectId,
    targetType: Joi.string().valid(...ACTIVITY_TARGET_TYPES),
    targetId: objectId,
    outcome: Joi.string().valid("success", "failure"),

    from: Joi.date().iso(),
    to: Joi.date()
        .iso()
        .when("from", {
            is: Joi.exist(),
            then: Joi.date().min(Joi.ref("from")),
        }),
});

const listActivityLogsValidation =
    validateRequestQuery(listActivityLogsSchema);

module.exports = {
    listActivityLogsSchema,
    listActivityLogsValidation,
};