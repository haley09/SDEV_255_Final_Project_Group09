const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const teacherSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, 'Please enter your name']
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your last name']
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email']
      },
    password: {
      type: String,
      required: [true, 'Password required'],
      minlength: [6, 'Please enter a 6 character password']
      }
    }
  );

  //fire a fuction before document is saved to db for PW hash
  teacherSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
  })

  //static method to log in teacher
  teacherSchema.statics.teachLogin = async function(email, password) {
    const teacher = await this.findOne({ email });
    if (teacher) {
        const auth = await bcrypt.compare(password, teacher.password)
        if (auth){
            return teacher;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect student email');
  }

  const Teacher = mongoose.model('teacher', teacherSchema)

  module.exports = Teacher;