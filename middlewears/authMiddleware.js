const jwt = require('../lib/jwtPromisifier')
const secret = 'SomePrivateSecret'

exports.authentication = async (req, res, next) => {
    const token = req.cookies['user'];

    if (token) {
        try {
            const decodedToken = await jwt.verify(token, secret);

            req.user = decodedToken;
            req.isAuthenticated = true;
            req.email = decodedToken.email;


            res.email = decodedToken.email;
            res.locals.email = decodedToken.email;
            res.locals.isAuthenticated = true;
        } catch(err) {
            console.log(err.message);

            res.clearCookie('user');
            res.redirect('/404');
        }
    }

    next();
};

exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated) {
        return res.redirect('/404');
    }

    next();
}

exports.notForUsers = async (req, res, next) =>{
    const token = req.cookies['user'];

    if (token) {
        try {
            const decodedToken = await jwt.verify(token, secret);

            return res.redirect('/404')
        } catch(err) {
            console.log(err.message);

            res.clearCookie('user');
            res.redirect('/404');
        }
    }

    next();
}
