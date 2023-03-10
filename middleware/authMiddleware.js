const jwt = require('jsonwebtoken');
const Student = require('../models/student-user')


//code to require login to see certain page
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    //check if the json web token exists and is verfied
    if (token) {
        jwt.verify(token, 'group 9 final', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken)
                next();
            }
        })
    }
    else {
        res.redirect('/login')
    }

}

// check who the current user is
const checkStudent = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'group 9 final', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.student = null;
                next();
            } else {
                console.log(decodedToken);
                let student = await Student.findById(decodedToken.id);
                res.locals.student = student
                next();
            }
        });
    }
    else {
        res.locals.student = null;
        next();
    }
};

module.exports = { requireAuth, checkStudent };