const jwt = require('jsonwebtoken');
const Student = require('../models/student-user')
const Teacher = require('../models/teacher-user')


//code to require login to see certain page
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    //check if the json web token exists and is verfied
    if (token) {
        jwt.verify(token, 'group 9 final', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/stuLogin');
            } else {
                console.log(decodedToken)
                next();
            }
        })
    }
    else {
        res.redirect('/stuLogin')
    }

}

const requireAuthTeach = (req, res, next) => {
    const token = req.cookies.jwt

    //check if the json web token exists and is verfied
    if (token) {
        jwt.verify(token, 'group 9 final', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/teachLogin');
            } else {
                console.log(decodedToken)
                next();
            }
        })
    }
    else {
        res.redirect('/teachLogin')
    }

}

// check if the current user is a student
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

// check if current user is a teacher
const checkTeacher = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'group 9 final', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.teacher = null;
                next();
            } else {
                console.log(decodedToken);
                let teacher = await Teacher.findById(decodedToken.id);
                res.locals.teacher = teacher
                next();
            }
        });
    }
    else {
        res.locals.teacher = null;
        next();
    }
};

module.exports = { requireAuth, checkStudent, requireAuthTeach, checkTeacher };
