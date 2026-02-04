const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { requireAdmin } = require("../middlewares/auth.middleware");

// Protect all category routes with Admin check
router.use(requireAdmin);

router.get("/categories", categoryController.getAll);
router.post("/categories", categoryController.create);
router.post("/categories/:id/delete", categoryController.delete);

module.exports = router;
