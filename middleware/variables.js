module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.isAdmin = req.session.isAdmin
    next()
}