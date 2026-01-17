const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const AuthController = {
    showLoginPage(req, res) {
        const error = req.query.error || null;
        const success = req.query.success || null;
        res.render('login', { error, success });
    },

    showRegisterPage(req, res) {
        const error = req.query.error || null;
        res.render('register', { error });
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.redirect('/login?error=Vui lòng nhập đầy đủ thông tin');
            }

            const user = await User.findByUsername(username);
            if (!user) {
                return res.redirect('/login?error=Tên đăng nhập hoặc mật khẩu không đúng');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.redirect('/login?error=Tên đăng nhập hoặc mật khẩu không đúng');
            }

            req.session.userId = user.id;
            req.session.username = user.username;

            res.redirect('/');
        } catch (error) {
            console.error('Login error:', error);
            res.redirect('/login?error=Đã xảy ra lỗi, vui lòng thử lại');
        }
    },

    async register(req, res) {
        try {
            const { username, password, confirmPassword } = req.body;

            if (!username || !password || !confirmPassword) {
                return res.redirect('/register?error=Vui lòng nhập đầy đủ thông tin');
            }

            if (password !== confirmPassword) {
                return res.redirect('/register?error=Mật khẩu xác nhận không khớp');
            }

            if (password.length < 6) {
                return res.redirect('/register?error=Mật khẩu phải có ít nhất 6 ký tự');
            }

            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.redirect('/register?error=Tên đăng nhập đã được sử dụng');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create(username, hashedPassword);

            res.redirect('/login?success=Đăng ký thành công! Vui lòng đăng nhập');
        } catch (error) {
            console.error('Register error:', error);
            res.redirect('/register?error=Đã xảy ra lỗi, vui lòng thử lại');
        }
    },

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/login');
        });
    }
};

module.exports = AuthController;
