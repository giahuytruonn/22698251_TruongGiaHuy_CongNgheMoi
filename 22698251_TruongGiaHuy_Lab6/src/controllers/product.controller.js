const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

exports.listProducts = async (req, res) => {
    try {
        let products = await Product.getAll();
        
        // Bonus: Search functionality
        const searchQuery = req.query.q;
        if (searchQuery) {
            products = products.filter(p => p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        res.render('index', { products, searchQuery });
    } catch (error) {
        req.flash('error_msg', 'Failed to fetch products');
        res.render('index', { products: [], searchQuery: '' });
    }
};

exports.getAddProduct = (req, res) => {
    res.render('add');
};

exports.postAddProduct = async (req, res) => {
    try {
        const { name, price, unit_in_stock } = req.body;
        
        // Data validation
        if (!name || !price || !unit_in_stock) {
            req.flash('error_msg', 'Please fill in all fields');
            return res.redirect('/add');
        }

        let url_image = '/images/default.png'; // default
        if (req.file) {
            url_image = '/images/uploads/' + req.file.filename;
        }

        const newProduct = {
            id: uuidv4(),
            name,
            price: Number(price),
            unit_in_stock: Number(unit_in_stock),
            url_image
        };

        await Product.create(newProduct);
        req.flash('success_msg', 'Product added successfully!');
        res.redirect('/');
    } catch (error) {
        console.error("Add Product Error:", error);
        req.flash('error_msg', 'Failed to add product');
        res.redirect('/add');
    }
};

exports.getEditProduct = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            req.flash('error_msg', 'Product not found!');
            return res.redirect('/');
        }
        res.render('edit', { product });
    } catch (error) {
        req.flash('error_msg', 'Failed to get product for editing');
        res.redirect('/');
    }
};

exports.postEditProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, unit_in_stock } = req.body;

        // Validation
        if (!name || !price || !unit_in_stock) {
            req.flash('error_msg', 'Please fill all required fields');
            return res.redirect(`/edit/${id}`);
        }

        const updates = {
            name,
            price: Number(price),
            unit_in_stock: Number(unit_in_stock)
        };

        if (req.file) {
            updates.url_image = '/images/uploads/' + req.file.filename;

            // Handle old image deletion (bonus point)
            const oldProduct = await Product.getById(id);
            if (oldProduct && oldProduct.url_image && !oldProduct.url_image.includes('default.png')) {
                const oldImagePath = path.join(__dirname, '../../public', oldProduct.url_image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await Product.update(id, updates);
        req.flash('success_msg', 'Product updated successfully!');
        res.redirect('/');
    } catch (error) {
        console.error("Edit Product Error:", error);
        req.flash('error_msg', 'Failed to update product');
        res.redirect(`/edit/${req.params.id}`);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Handle old image deletion (bonus point)
        const oldProduct = await Product.getById(id);
        if (oldProduct && oldProduct.url_image && !oldProduct.url_image.includes('default.png')) {
            const oldImagePath = path.join(__dirname, '../../public', oldProduct.url_image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await Product.delete(id);
        req.flash('success_msg', 'Product deleted successfully!');
        res.redirect('/');
    } catch (error) {
        console.error("Delete Product Error:", error);
        req.flash('error_msg', 'Failed to delete product');
        res.redirect('/');
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            req.flash('error_msg', 'Product not found!');
            return res.redirect('/');
        }
        res.render('detail', { product });
    } catch (error) {
        req.flash('error_msg', 'Failed to load product detail');
        res.redirect('/');
    }
};
