const express = require("express");
const upload = require("../middleware/uploadMiddleware");


const {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePhoto,
} = require("../controllers/profileControllers");

const { protect } = require("../middleware/authMiddleware");

const {
    updateProfileValidation,
    changePasswordValidation,
} = require("../validations/profileValidation");


const router = express.Router();

router.get("/", protect, getProfile);

router.put(
    "/",
    protect,
    updateProfileValidation,
    updateProfile
);

router.put(
    "/change-password",
    protect,
    changePasswordValidation,
    changePassword
);

router.put(
    "/photo",
    protect,
    upload.single("profileImage"),
    uploadProfilePhoto
);

module.exports = router;