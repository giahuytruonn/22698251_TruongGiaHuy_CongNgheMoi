const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = {
    requireAuth,
    redirectIfLoggedIn
};
