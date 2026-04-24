const express = require("express");
const { signup } = require("../controllers/authControllers");
const { signupValidation } = require("../validations/authValidation");

const router = express.Router();

router.post("/signup", signupValidation, signup);

module.exports = router;
