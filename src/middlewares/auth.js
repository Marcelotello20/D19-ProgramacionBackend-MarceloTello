export const auth = function (req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    return next();
}

export const logged = function (req, res, next) {
    if (req.session.user) {
        return res.redirect("/");
    }

    next();
}

export default {auth, logged};