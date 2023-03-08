const mongoose = require("mongoose");
const express = require("express");
const morgan = require('morgan');
const Course = require("./models/course");

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

//login passwords
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.render('login', {message: 'Invalid username or password.' });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
          res.send('Logged in successfully.');
        } else {
          res.render('login', {message: 'Invalid username or password.'});
        }
      });
    }
  });
});

// register page

app.get('/register', (req, res) => {
  res.render('register', { message: null });
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, (err, user) => {
    if (err) throw err;
    if (user) {
      res.render('register', { message: 'Username already exists.' });
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw err;

        const newUser = new User({
          username: username,
          password: hash
        });

        newUser.save((err) => {
          if (err) throw err;
          res.send('User created successfully.');
        });
      });
    }
  });
});



// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
})