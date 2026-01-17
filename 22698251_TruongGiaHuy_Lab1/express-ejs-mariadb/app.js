const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'product-management-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.username || null;
    next();
});

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');

app.use('/', authRoutes);
app.use('/', productRoutes);

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
