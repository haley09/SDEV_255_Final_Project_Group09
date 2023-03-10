const Student = require('../models/student-user');
const jwt = require('jsonwebtoken')

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: ''};

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


module.exports.register_get = (req, res) => {
    res.render('register');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.register_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.create({ email, password });
        const token = createToken(student._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ student: student._id })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })

    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.login(email, password);
        const token = createToken(student._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ student: student._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/')
}