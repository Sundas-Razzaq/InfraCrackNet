const express = require("express");
const {
    signup,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
} = require("../controllers/authControllers");
const {
    signupValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} = require("../validations/authValidation");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidation, resetPassword);
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
