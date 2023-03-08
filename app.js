const mongoose = require("mongoose");
const express = require("express");
const morgan = require('morgan');
const Course = require("./models/course");
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//library for passwords
const bcrypt = require('bcrypt');

//express app
const app = express();

// new for render
const PORT = process.env.PORT || 3030;


//connect to mongodb
const dbURI = "mongodb+srv://group9:Group9PW@finalproject.bqrh3po.mongodb.net/Group9Final?retryWrites=true&w=majority"
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true })
  //\/\/.then((result) => app.listen(3000))
  .then((result) => app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
  }))
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.json());

//user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    },
  password: {
    type: String,
    required: true,
    },
  teachercode: {
    type: String,
    required: true,
  }
});

//JWT token for the user
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, 'secret');
  return token;
};

//Hash for the user password
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

//routes
app.get('/', (req, res) => {
  res.render('index', {title: 'Home page'});
});

app.get('/teacher', (req, res) => {
  res.render('teacher', {title: 'Teacher Page'});
});

app.get('/login', (req, res) => {
  res.render('login', {title: 'Schedule Login'});
});

app.get('/create', (req, res) => {
  res.render('create', {title: 'Create New Course'});
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Create New Username/Password' });
});

app.get('/profile', (req, res) => {
  res.render('profile', { title: 'Welcome' });
});

// course routes

 app.get('/course', (req, res) => {
  Course.find()
    .then((result) => {
      res.render('course', { title: 'All Courses', courses: result})
    })
    .catch((err) => {
      console.log(err)
    })
})

app.post('/course', (req, res) => {
  const course = new Course(req.body)

  course.save()
    .then((result) => {
      res.redirect('/course')
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/courses/:id', (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then(result => {
      res.render('describe', { course: result, title: 'Course Description'});
    })
    .catch(err => {
      console.log(err);
    })
})

app.delete('/courses/:id', (req, res) => {
  const id = req.params.id;
  Course.findByIdAndDelete(id)
      .then(result => {
          res.json({ redirect: '/course' })
      })
      .catch(err => {
          console.log(err);
      })
})

//student login passwords
app.post('/login', async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password.');

  const token = user.generateAuthToken();

  
  res.redirect('profile', { title: 'Welcome'});
});

// register page

app.post('/register', async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['username', 'password']));
  await user.save();

  const token = user.generateAuthToken();

  res.redirect('index', {title: 'Home Page'})
});



// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
})