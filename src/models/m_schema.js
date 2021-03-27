const mongoose = require('mongoose')


// Users
const {
  Schema
} = mongoose

// Users
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})
const users = mongoose.model('users', userSchema)


// apiGen
const apiGenSchema = new Schema({
  key: String
}, {
  timestamps: true
})
const apiGen = mongoose.model('apiKeys', apiGenSchema)


// Blog
const blogSchema = new Schema({
  imgName: String,
  title: String,
  content: String,
}, {timestamps: true})
const blog = mongoose.model('blogs', blogSchema)


module.exports = {
  users,
  apiGen,
  blog
}