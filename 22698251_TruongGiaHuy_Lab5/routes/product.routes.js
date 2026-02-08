const express = require("express");
const path = require("path");
const multer = require("multer");
const productController = require("../controllers/product.controller");

const router = express.Router();

const uploadPath = path.join(__dirname, "..", "public", "assest", "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

const upload = multer({ storage });

router.get("/", productController.list);
router.get("/create", productController.showCreate);
router.post("/", upload.single("image"), productController.create);
router.get("/:id/edit", productController.showEdit);
router.put("/:id", upload.single("image"), productController.update);
router.delete("/:id", productController.remove);

module.exports = router;

