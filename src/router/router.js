const express = require('express')
const app = express()
const router = express.Router()
const port = process.env.PORT || 3000
const ip = require('ip')
const uuid = require('uuid').v4

// Model
// Users
const m_users_test = require('../models/m_schema_test').users
// apiGen
const m_api_gen = require('../models/m_schema').apiGen


// Home
router.get('/', (req, res) => {
  res.render('v_home', {
    title: 'home'
  })
})

// About



// Admin
// router.get('/admin',)

// Api key generator
router.get('/admin/apiGen', (req, res) => {
  const data = m_api_gen.find((err, data) => {
    if (err) console.log(err)
    return data
  })
  res.render('admin/v_apiGen', {
    title: 'Api key Generator',
    data: data
  })
})

app.get('/admin/apiGen/gen', (req, res) => {
  m_api_gen.find((err, data) => {
    res.json(data)
  })
})

app.post('/admin/apiGen/gen', (req, res) => {
  m_api_gen.create({
    key: uuid()
  }, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.json({
        status: true,
        method: req.method,
        url: req.url,
        key: data.key
      })
    }
  })
})

app.delete('/admin/apiGen/gen', (req, res) => {
  const key = req.body.key
  m_api_gen.findOneAndDelete(key, (err, data) => {
    if (err) console.log(err)
    res.send(data)
  })
})







// Test
router.get('/test', (req, res) => {
  res.render('v_test', {
    title: 'Test'
  })
})



app.get('/test/users/:id', (req, res) => {
  const id = req.params.id
  m_users_test.findById(id, (err, data) => {
    if (err) res.send(err)
    if (data == null) {
      res.json({
        status: false,
        msg: 'Data yang anda cari tidak ada!'
      })
    } else {
      res.json(data)
    }
  })
})

app.get('/test/users', (req, res) => {
  m_users_test.find((err, succ) => {
    if (err) res.send(err)
    if (succ == null || succ == '') {
      res.json({
        status: false,
        msg: 'Data masih kosong!'
      })
    } else {
      res.json({
        status: true,
        method: req.method,
        url: req.url,
        data: succ
      })
    }
  })
})

app.post('/test/users', (req, res) => {
  m_users_test.create({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    ip: ip.address()
  }, (err, succ) => {
    if (err) res.send(err)
    res.json({
      status: true,
      method: req.method,
      url: req.url,
      data: succ
    })
  })
})


module.exports = {
  app,
  router
}