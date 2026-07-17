const express = require("express");
const router = express.Router();

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} = require("../controllers/projectControllers");

const {
    createProjectValidation,
    updateProjectValidation,
} = require("../validations/projectValidators");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

/*
 *   POST /api/projects
 *  Create a new project
 *  Admin, Engineer
 */
router.post(
    "/",
    protect,
    authorizeRoles("admin", "engineer"),
    createProjectValidation,
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
    updateProject
);

/*
 * DELETE /api/projects/:id
 * Delete project
 */
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteProject
);

module.exports = router;