const Joi = require("joi");
const {
    validateRequestQuery,
    validateRequestParams,
} = require("../middleware/authMiddleware");

const objectId = Joi.string().hex().length(24);

const listAdminInspectionsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100),

    status: Joi.string().valid(
        "Draft",
        "Images Uploaded",
        "Pending Analysis",
        "AI Processing",
        "AI Completed",
        "Validated",
        "Report Generated",
        "Completed"
    ),
    priority: Joi.string().valid("Low", "Medium", "High", "Critical"),
    inspectionType: Joi.string().valid(
        "Routine",
        "Emergency",
        "Maintenance",
        "Follow-up"
    ),

    project: objectId,
    team: objectId,
    inspector: objectId,

    from: Joi.date().iso(),
    to: Joi.date()
        .iso()
        .when("from", {
            is: Joi.exist(),
            then: Joi.date().min(Joi.ref("from")),
        }),

    sort: Joi.string().valid("newest", "oldest").default("newest"),
});

const listAdminAnalysesSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100),

    status: Joi.string().valid(
        "Queued",
        "Processing",
        "Completed",
        "Failed",
        "Cancelled"
    ),
    validationStatus: Joi.string().valid("Pending", "Approved", "Rejected"),
    severity: Joi.string().valid("Low", "Medium", "High", "Critical"),

    project: objectId,
    team: objectId,
    inspection: objectId,

    from: Joi.date().iso(),
    to: Joi.date()
        .iso()
        .when("from", {
            is: Joi.exist(),
            then: Joi.date().min(Joi.ref("from")),
        }),

    sort: Joi.string().valid("newest", "oldest").default("newest"),
});

const listAdminReportsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100),

    status: Joi.string().valid("Draft", "Final"),

    project: objectId,
    team: objectId,
    inspection: objectId,
    generatedBy: objectId,

    from: Joi.date().iso(),
    to: Joi.date()
        .iso()
        .when("from", {
            is: Joi.exist(),
            then: Joi.date().min(Joi.ref("from")),
        }),

    sort: Joi.string().valid("newest", "oldest").default("newest"),
});

const adminIdParamSchema = Joi.object({
    id: objectId.required().messages({
        "string.hex": "Invalid ID.",
        "string.length": "Invalid ID.",
    }),
});

module.exports = {
    listAdminInspectionsValidation: validateRequestQuery(
        listAdminInspectionsSchema
    ),
    listAdminAnalysesValidation: validateRequestQuery(listAdminAnalysesSchema),
    listAdminReportsValidation: validateRequestQuery(listAdminReportsSchema),
    adminIdParamValidation: validateRequestParams(adminIdParamSchema),
};