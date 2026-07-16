const { body } = require("express-validator");

const projectValidationRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required.")
        .isLength({ max: 100 })
        .withMessage("Project name cannot exceed 100 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required.")
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters."),

    body("structureType")
        .notEmpty()
        .withMessage("Structure type is required.")
        .isIn(["Bridge", "Building", "Road"])
        .withMessage("Invalid structure type."),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Project location is required.")
        .isLength({ max: 200 })
        .withMessage("Location cannot exceed 200 characters."),

    body("priority")
        .notEmpty()
        .withMessage("Project priority is required.")
        .isIn(["Low", "Medium", "High", "Critical"])
        .withMessage("Invalid project priority."),

    body("status")
        .optional()
        .isIn(["Active", "On Hold", "Completed"])
        .withMessage("Invalid project status."),
];

const createProjectValidation = projectValidationRules;

const updateProjectValidation = projectValidationRules;

module.exports = {
    createProjectValidation,
    updateProjectValidation,
};