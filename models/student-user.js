const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const studentSchema = new mongoose.Schema({
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
  studentSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
  })

  //static method to log in student
  studentSchema.statics.login = async function(email, password) {
    const student = await this.findOne({ email });
    if (student) {
        const auth = await bcrypt.compare(password, student.password)
        if (auth){
            return student;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect student email');
  }

  const Student = mongoose.model('student', studentSchema)

  module.exports = Student;