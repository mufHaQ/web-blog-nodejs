const mongoose = require('mongoose')

const {Schema} = mongoose

// Users
const userSchema = new Schema({
  email: String,
  username: String,
  password: String,
  ip: String
}, {timestamps: true})
const users = mongoose.model('users', userSchema)


module.exports = {
  users
}