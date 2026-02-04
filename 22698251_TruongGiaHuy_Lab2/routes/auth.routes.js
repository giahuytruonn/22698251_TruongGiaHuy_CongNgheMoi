const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/login", authController.renderLoginPage);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/register", authController.renderRegisterPage);
router.post("/register", authController.register);

module.exports = router;
