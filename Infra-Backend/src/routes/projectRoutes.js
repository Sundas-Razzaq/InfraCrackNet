const express = require("express");
const router = express.Router();

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

const {
    createProjectValidation,
    updateProjectValidation,
} = require("../validators/projectValidator");

const validateRequest = require("../middleware/validateRequest");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

/*
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Admin, Engineer
 */
router.post(
    "/",
    protect,
    authorizeRoles("admin", "engineer"),
    createProjectValidation,
    validateRequest,
    createProject
);

/*
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Private
 */
router.get(
    "/",
    protect,
    getProjects
);

/*
 * @route   GET /api/projects/:id
 * @desc    Get single project
 * @access  Private
 */
router.get(
    "/:id",
    protect,
    getProjectById
);

/*
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Admin, Engineer
 */
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "engineer"),
    updateProjectValidation,
    validateRequest,
    updateProject
);

/*
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Admin
 */
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteProject
);

module.exports = router;