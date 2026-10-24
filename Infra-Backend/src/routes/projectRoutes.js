const express = require("express");
const router = express.Router();

const {
    getProjects,
    getProjectById,
    updateProject,
} = require("../controllers/projectControllers");

const { updateProjectValidation } = require("../validations/projectValidators");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");


router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);

router.put(
    "/:id",
    protect,
    authorizeRoles("Engineer"),
    updateProjectValidation,
    updateProject
);

module.exports = router;