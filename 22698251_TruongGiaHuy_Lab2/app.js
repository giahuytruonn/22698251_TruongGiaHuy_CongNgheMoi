require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { setUserVar } = require("./middlewares/auth.middleware");

const expressLayouts = require("express-ejs-layouts");
const app = express();

app.use(expressLayouts);
app.set("layout", "./layout");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session Setup
app.use(session({
    secret: 'mysecretkey_lab2_advanced', // In production use .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Apply global middleware to set locals.user
app.use(setUserVar);

app.use(require("./routes/auth.routes"));
app.use(require("./routes/product.routes"));
app.use(require("./routes/category.routes"));

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
