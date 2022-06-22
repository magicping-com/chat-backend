const isLoggedIn = (req, res, next) => {
    if (req.user) {
        // console.log(req.user);
        // console.log(req.user['id']);
        // console.log(req.user.displayName);
        // console.log(req.user.emails[0].value);

        next()
    } else {
        res.redirect('/')
    }
}

module.exports = isLoggedIn
