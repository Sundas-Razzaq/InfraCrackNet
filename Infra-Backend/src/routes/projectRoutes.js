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

/*Create a new project*/
router.post(
    "/",
    protect,
    authorizeRoles("Engineer"),
    createProjectValidation,
    createProject
);

/* Get all projects*/
router.get(
    "/",
    protect,
    getProjects
);

/*Get single project*/
router.get(
    "/:id",
    protect,
    getProjectById
);

/* Update project*/
router.put(
    "/:id",
    protect,
    authorizeRoles("Engineer"),
    updateProjectValidation,
    updateProject
);

/*Delete project*/
router.delete(
    "/:id",
    protect,
    authorizeRoles("Engineer"),
    deleteProject
);

module.exports = router;