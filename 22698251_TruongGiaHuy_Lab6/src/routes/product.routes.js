const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');

router.get('/', productController.listProducts);

router.get('/add', productController.getAddProduct);
router.post('/add', upload.single('image'), productController.postAddProduct);

router.get('/edit/:id', productController.getEditProduct);
router.post('/edit/:id', upload.single('image'), productController.postEditProduct);

router.post('/delete/:id', productController.deleteProduct);

router.get('/product/:id', productController.getProductDetail);

module.exports = router;
