const Joi = require("joi");
const { validateRequestBody } = require("../middleware/authMiddleware");

/* CREATE INSPECTION */

const createInspectionSchema = Joi.object({
    project: Joi.string()
        .trim()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": "Project ID must be a string.",
            "string.empty": "Project is required.",
            "string.hex": "Invalid Project ID.",
            "string.length": "Invalid Project ID.",
            "any.required": "Project is required.",
        }),

    inspectionType: Joi.string()
        .valid(
            "Routine",
            "Emergency",
            "Maintenance",
            "Follow-up"
        )
        .required()
        .messages({
            "any.only":
                "Inspection type must be Routine, Emergency, Maintenance, or Follow-up.",
            "any.required":
                "Inspection type is required.",
        }),

    structureArea: Joi.string()
        .trim()
        .max(150)
        .required()
        .messages({
            "string.base":
                "Structure area must be a string.",
            "string.empty":
                "Structure area is required.",
            "string.max":
                "Structure area cannot exceed 150 characters.",
            "any.required":
                "Structure area is required.",
        }),

    gpsLocation: Joi.string()
        .trim()
        .max(200)
        .required()
        .messages({
            "string.base":
                "GPS location must be a string.",
            "string.empty":
                "GPS location is required.",
            "string.max":
                "GPS location cannot exceed 200 characters.",
            "any.required":
                "GPS location is required.",
        }),

    weather: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "string.base":
                "Weather must be a string.",
            "string.empty":
                "Weather is required.",
            "string.max":
                "Weather cannot exceed 100 characters.",
            "any.required":
                "Weather is required.",
        }),

    priority: Joi.string()
        .valid("Low", "Medium", "High", "Critical")
        .required()
        .messages({
            "any.only":
                "Priority must be Low, Medium, High, or Critical.",
            "any.required":
                "Inspection priority is required.",
        }),

    scheduledDate: Joi.date()
        .optional()
        .messages({
            "date.base":
                "Scheduled date must be a valid date.",
        }),

    inspectionDate: Joi.date()
        .optional()
        .messages({
            "date.base":
                "Inspection date must be a valid date.",
        }),

    fieldNotes: Joi.string()
        .trim()
        .max(2000)
        .allow("")
        .optional()
        .messages({
            "string.base":
                "Field notes must be a string.",
            "string.max":
                "Field notes cannot exceed 2000 characters.",
        }),

    assignedEngineers: Joi.array()
        .items(
            Joi.string().hex().length(24).messages({
                "string.hex":
                    "Invalid Engineer ID.",
                "string.length":
                    "Invalid Engineer ID.",
            })
        )
        .optional(),

    assignedInspectors: Joi.array()
        .items(
            Joi.string().hex().length(24).messages({
                "string.hex":
                    "Invalid Inspector ID.",
                "string.length":
                    "Invalid Inspector ID.",
            })
        )
        .optional(),
});

/* UPDATE INSPECTION */

const updateInspectionSchema = Joi.object({
    project: Joi.string()
        .trim()
        .hex()
        .length(24)
        .messages({
            "string.base": "Project ID must be a string.",
            "string.hex": "Invalid Project ID.",
            "string.length": "Invalid Project ID.",
        }),

    inspectionType: Joi.string()
        .valid(
            "Routine",
            "Emergency",
            "Maintenance",
            "Follow-up"
        )
        .messages({
            "any.only":
                "Inspection type must be Routine, Emergency, Maintenance, or Follow-up.",
        }),

    structureArea: Joi.string()
        .trim()
        .max(150)
        .messages({
            "string.base":
                "Structure area must be a string.",
            "string.max":
                "Structure area cannot exceed 150 characters.",
        }),

    gpsLocation: Joi.string()
        .trim()
        .max(200)
        .messages({
            "string.base":
                "GPS location must be a string.",
            "string.max":
                "GPS location cannot exceed 200 characters.",
        }),

    weather: Joi.string()
        .trim()
        .max(100)
        .messages({
            "string.base":
                "Weather must be a string.",
            "string.max":
                "Weather cannot exceed 100 characters.",
        }),

    priority: Joi.string()
        .valid("Low", "Medium", "High", "Critical")
        .messages({
            "any.only":
                "Priority must be Low, Medium, High, or Critical.",
        }),

    status: Joi.string()
        .valid(
            "Draft",
            "Images Uploaded",
            "AI Processing",
            "AI Completed",
            "Validated",
            "Report Generated",
            "Completed"
        )
        .messages({
            "any.only":
                "Status must be Draft, Images Uploaded, AI Processing, AI Completed, Validated, Report Generated, or Completed.",
        }),

    scheduledDate: Joi.date().messages({
        "date.base":
            "Scheduled date must be a valid date.",
    }),

    inspectionDate: Joi.date().messages({
        "date.base":
            "Inspection date must be a valid date.",
    }),

    fieldNotes: Joi.string()
        .trim()
        .max(2000)
        .allow("")
        .messages({
            "string.base":
                "Field notes must be a string.",
            "string.max":
                "Field notes cannot exceed 2000 characters.",
        }),

    assignedEngineers: Joi.array().items(
        Joi.string().hex().length(24).messages({
            "string.hex": "Invalid Engineer ID.",
            "string.length": "Invalid Engineer ID.",
        })
    ),

    assignedInspectors: Joi.array().items(
        Joi.string().hex().length(24).messages({
            "string.hex": "Invalid Inspector ID.",
            "string.length": "Invalid Inspector ID.",
        })
    ),
});

/* VALIDATION MIDDLEWARE */

const createInspectionValidation =
    validateRequestBody(createInspectionSchema);

const updateInspectionValidation =
    validateRequestBody(updateInspectionSchema);

module.exports = {
    createInspectionSchema,
    createInspectionValidation,
    updateInspectionSchema,
    updateInspectionValidation,
};