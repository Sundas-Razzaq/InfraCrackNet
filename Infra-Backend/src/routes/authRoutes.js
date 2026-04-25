const express = require("express");
const {
    signup,
    login,
    logout,
    getCurrentUser,
} = require("../controllers/authControllers");
const { signupValidation } = require("../validations/authValidation");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
