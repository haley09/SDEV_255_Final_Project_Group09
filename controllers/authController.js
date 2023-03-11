const Student = require('../models/student-user');
const Teacher = require('../models/teacher-user');
const jwt = require('jsonwebtoken')

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', firstName: '', lastName: ''};

    //incorrect email
    if (err.message === 'incorrect student email') {
        errors.email = 'that email not registered'
    }

    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'wrong password'
    }

    //duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered'
        return errors;
    }

    //validation errors
    if (err.message.includes('student validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

//Create Token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'group 9 final', {
      expiresIn: maxAge
  });
}

//student pages


module.exports.studentReg_get = (req, res) => {
    res.render('studentReg');
}

module.exports.stuLogin_get = (req, res) => {
    res.render('stuLogin');
}

module.exports.studentReg_post = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const student = await Student.create({ firstName, lastName, email, password });
        const token = createToken(student._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ student: student._id })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })

    }
}

module.exports.stuLogin_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.stuLogin(email, password);
        const token = createToken(student._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ student: student._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

// teacher pages

module.exports.teachReg_get = (req, res) => {
    res.render('teachReg');
}

module.exports.teachLogin_get = (req, res) => {
    res.render('teachLogin');
}

module.exports.teachReg_post = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const teacher = await Teacher.create({ firstName, lastName, email, password });
        const token = createToken(teacher._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ teacher: teacher._id })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })

    }
    
}

module.exports.teachLogin_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.teachLogin(email, password);
        const token = createToken(teacher._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ teacher: teacher._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
    
}

//log out page


module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/')
}