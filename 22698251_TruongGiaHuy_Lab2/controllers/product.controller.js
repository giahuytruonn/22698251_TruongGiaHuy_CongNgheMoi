const productService = require("../services/product.service");
const categoryService = require("../services/category.service");

exports.getAllProducts = async (req, res) => {
    // Filters
    const { name, categoryId, minPrice, maxPrice } = req.query;

    // Pass filters to service
    const products = await productService.getAllProducts({
        name, categoryId, minPrice, maxPrice
    });

    const categories = await categoryService.getAll();

    res.render("products/index", {
        products,
        categories,
        filters: { name, categoryId, minPrice, maxPrice },
        path: '/products'
    });
};

exports.renderCreatePage = async (req, res) => {
    const categories = await categoryService.getAll();
    res.render("products/create", { categories, path: '/products/create' });
};

exports.createProduct = async (req, res) => {
    const userId = req.session.user ? req.session.user.userId : 'system';
    await productService.createProduct(req.body, req.file, userId);
    res.redirect("/products");
};

exports.renderEditPage = async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    const categories = await categoryService.getAll();

    if (!product) {
        return res.redirect("/products");
    }

    res.render("products/edit", { product, categories, path: '/products' });
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user ? req.session.user.userId : 'system';

    await productService.updateProduct(id, req.body, req.file, userId);
    res.redirect("/products");
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user ? req.session.user.userId : 'system';

    await productService.deleteProduct(id, userId);
    res.redirect("/products");
};

