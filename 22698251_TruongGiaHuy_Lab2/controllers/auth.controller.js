const authService = require("../services/auth.service");

exports.renderLoginPage = (req, res) => {
    res.render("auth/login", { path: '/login', error: null, layout: false });
};


exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authService.login(username, password);
        if (!user) {
            return res.render("auth/login", { path: '/login', error: "Invalid credentials", layout: false });
        }
        req.session.user = {
            userId: user.userId,
            username: user.username,
            role: user.role
        };
        res.redirect("/products");
    } catch (err) {
        console.error(err);
        res.render("auth/login", { path: '/login', error: "An error occurred" });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

exports.renderRegisterPage = (req, res) => {
    res.render("auth/register", { path: '/register', error: null, layout: false });
};

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        await authService.register(username, password, 'staff'); // Default role: staff
        res.redirect("/login");
    } catch (err) {
        res.render("auth/register", { path: '/register', error: err.message, layout: false });
    }
};

