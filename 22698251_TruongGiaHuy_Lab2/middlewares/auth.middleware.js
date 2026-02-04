exports.requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

exports.requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send("Access Denied: Admins Only");
    }
    next();
};

exports.setUserVar = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};
