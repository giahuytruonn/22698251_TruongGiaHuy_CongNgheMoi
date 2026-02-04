const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();

const controller = require("../controllers/product.controller");
const { requireLogin, requireAdmin } = require("../middlewares/auth.middleware");

router.get("/", (req, res) => {
    res.redirect("/products");
});

// Public: List products (Actually lab says staff can see list)
// Requirement: "staff: chỉ xem danh sách" -> So getAllProducts needs requireLogin?
// Or maybe public can see? Let's assume requireLogin for everything per req "Login page".

router.use(requireLogin);

router.get("/products", controller.getAllProducts);

// Admin only operations
router.get("/products/create", requireAdmin, controller.renderCreatePage);
router.get("/products/:id/edit", requireAdmin, controller.renderEditPage);

router.post("/products", requireAdmin, upload.single("image"), controller.createProduct);
router.post("/products/:id/update", requireAdmin, upload.single("image"), controller.updateProduct);
router.post("/products/:id/delete", requireAdmin, controller.deleteProduct);

module.exports = router;
