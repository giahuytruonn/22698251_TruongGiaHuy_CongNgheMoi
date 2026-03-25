const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET_NAME } = require('../config/aws.config');

const deleteImageFromS3 = async (imageUrl) => {
    if (!imageUrl || imageUrl.includes('default.png')) return;
    
    // imageUrl format: https://bucket-name.s3.region.amazonaws.com/products/filename.png
    try {
        const urlObj = new URL(imageUrl);
        // Remove leading slash for the Key: /products/filename.png -> products/filename.png
        const key = decodeURIComponent(urlObj.pathname.substring(1));
        
        await s3Client.send(new DeleteObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key
        }));
    } catch (error) {
        console.error("Failed to delete image from S3:", error);
    }
};

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
        
        if (!name || !price || !unit_in_stock) {
            req.flash('error_msg', 'Please fill in all fields');
            return res.redirect('/add');
        }

        let url_image = '/images/default.png'; // default local fallback if needed
        if (req.file) {
            url_image = req.file.location; // S3 URL provided by multer-s3
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
            updates.url_image = req.file.location;

            // Handle old image deletion from S3
            const oldProduct = await Product.getById(id);
            if (oldProduct && oldProduct.url_image) {
                await deleteImageFromS3(oldProduct.url_image);
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
        
        const oldProduct = await Product.getById(id);
        if (oldProduct && oldProduct.url_image) {
            await deleteImageFromS3(oldProduct.url_image);
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
