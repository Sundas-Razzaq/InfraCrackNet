const express = require("express");

const {
    getProfile,
    updateProfile,
} = require("../controllers/profileControllers");

const { protect } = require("../middleware/authMiddleware");

const {
    updateProfileValidation,
} = require("../validations/profileValidation");

const router = express.Router();

router.get("/", protect, getProfile);

router.put(
    "/",
    protect,
    updateProfileValidation,
    updateProfile
);

module.exports = router;