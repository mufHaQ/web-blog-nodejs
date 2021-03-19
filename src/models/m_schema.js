const mongoose = require('mongoose')


// Users
const {
  Schema
} = mongoose

const blogSchema = new Schema({
  email: String,
  username: String,
  password: String,
  ip: String
}, {
  timestamps: true
})
const blog = mongoose.model('blogs', blogSchema)


// apiGen
const apiGenSchema = new Schema({
  key: String
})
const apiGen = mongoose.model('apiKeys', apiGenSchema)

module.exports = {
  blog,
  apiGen
}