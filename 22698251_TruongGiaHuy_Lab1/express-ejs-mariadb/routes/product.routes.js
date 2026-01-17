const express = require('express');
const router = express.Router();
const db = require('../db/query');
const { requireAuth } = require('../middleware/auth.middleware');

// Áp dụng middleware requireAuth cho tất cả routes product
router.use(requireAuth);

router.get('/', async (req, res) => {
    const rows = await db.query('SELECT * FROM products');
    res.render('products', { products: rows });
});

router.post('/add', async (req, res) => {
    const { id, name, price, quantity } = req.body;

    if (id) {
        // Update nếu có id
        await db.query(
            'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
            [name, price, quantity, id]
        );
    } else {
        // Insert nếu không có id
        await db.query(
            'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)',
            [name, price, quantity]
        );
    }
    res.redirect('/');
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.redirect('/');
});

module.exports = router;
