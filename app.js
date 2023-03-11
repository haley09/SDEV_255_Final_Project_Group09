const mongoose = require("mongoose");
const express = require("express");
const morgan = require('morgan');
const Course = require("./models/course");
const Student = require("./models/student-user")
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const cookieParser = require('cookie-parser')

const { requireAuth, checkStudent } = require('./middleware/authMiddleware')
const { requireAuthTeach, checkTeacher } = require('./middleware/authMiddleware')

const authRoutes = require('./routes/authRoutes')

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
app.use(cookieParser());

//routes
app.get('*', checkStudent);
app.get('*', checkTeacher);

app.get('/', (req, res) => {
  res.render('index', {title: 'Home page'});
});

app.get('/create', (req, res) => {
  res.render('create', {title: 'Create New Course'});
});

app.get('/profile', (req, res) => {
  res.render('profile', { title: 'Welcome' });
});


app.get('/registerType', (req, res) => {
  res.render('registerType', { title: 'New User Registration' });
});

// teacher course routes

 app.get('/courseTeach', (req, res) => {
  Course.find()
    .then((result) => {
      res.render('courseTeach', { title: 'All Courses', courses: result})
    })
    .catch((err) => {
      console.log(err)
    })
})

app.post('/courseTeach', (req, res) => {
  const course = new Course(req.body)

  course.save()
    .then((result) => {
      res.redirect('/courseTeach')
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/courses/:id', (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then(result => {
      res.render('describeTeach', { course: result, title: 'Course Description'});
    })
    .catch(err => {
      console.log(err);
    })
})

app.delete('/courses/:id', (req, res) => {
  const id = req.params.id;
  Course.findByIdAndDelete(id)
      .then(result => {
          res.json({ redirect: '/courseTeach' })
      })
      .catch(err => {
          console.log(err);
      })
})

//student course routes
app.get('/courseStudent', (req, res) => {
  Course.find()
    .then((result) => {
      res.render('courseStudent', { title: 'All Courses', courses: result})
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/coursesStudent/:id', (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then(result => {
      res.render('describeStudent', { course: result, title: 'Course Description'});
    })
    .catch(err => {
      console.log(err);
    })
})

app.put('/coursesStudent/:id', checkStudent, async (req,res) => {
  const courseId = req.params.id
  const studentId = res.locals.student.id

  await Student.findOneAndUpdate({id: studentId}, {$addToSet: {schedule: courseId}})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err)
  });

})

app.delete('/coursesStudent/:id', checkStudent, async (req,res) => {
  const courseId = req.params.id
  const studentId = res.locals.student.id

  await Student.findOneAndUpdate({id: studentId}, {$pull: {schedule: courseId}})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err)
  });

}) 

// student schedule

app.get('/schedule', requireAuth, (req, res) => {
  const schedule = res.locals.student.schedule
    Course.find({_id: { $in: schedule }})
      .then(result => {
        console.log(result)
      res.render('schedule', { courses: result, title: 'Student Schedule'});
    })
    .catch(err => {
      console.log(err);
    })
});


// new register/login routes
app.use(authRoutes);


// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
})