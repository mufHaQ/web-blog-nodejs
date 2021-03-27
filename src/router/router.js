const express = require('express')
const app = express()
const router = express.Router()
const ip = require('ip')
const uuid = require('uuid').v4
const bcrypt = require('bcrypt')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const multer = require('multer')



// Model
// Users
// const m_users_test = require('../models/m_schema_test').users
// apiGen
const m_api_gen = require('../models/m_schema').apiGen
// Users
const m_user = require('../models/m_schema').users
// Blog
const m_blog = require('../models/m_schema').blog


// Middleware
app.use(session({
  secret: process.env.SECRET_SES,
  resave: false,
  saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  m_user.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(new localStrategy(function (username, password, done) {
  m_user.findOne({
    username: username
  }, function (err, user) {
    if (err) done(err)
    if (!user) return done(null, false, {
      message: 'Username salah!'
    })

    bcrypt.compare(password, user.password, function (err, res) {
      if (err) return done(err)
      if (res == false) return done(null, false, {
        message: 'Password salah!'
      })

      return done(null, user)
    })
  })
}))

let dropDown = false

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  dropDown = true
  res.redirect('/admin/login')
}

function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  dropDown = false
  res.redirect('/admin')
}


// Home
router.get('/', (req, res) => {
  m_blog.find((err, data) => {
    res.render('v_home', {
      title: 'Home',
      data: data,
      drp: dropDown
    })
  })
})

// About

router.get('/about', (req, res) => {
  res.render('v_about', {
    title: 'About'
  })
})




app.post('/setup', (req, res) => {
  m_user.findById(req.body.id, (err, data) => {
    if (err) res.send(err)
    let test = bcrypt.compareSync(req.body.password, data.password, (err, data) => data)
    res.send(test)
  })
})


// Admin
router.get('/admin', isLoggedIn, (req, res) => {
  m_blog.find((err, data) => {
    res.render('admin/v_admin', {
      title: 'Admin',
      data: data,
      drp: dropDown
    })
  })
})

// Regiter
router.get('/admin/register', (req, res) => {
  res.render('admin/v_register', {
    title: 'Register',
    drp: dropDown
  })
})
app.post('/admin/register', async (req, res) => {
  try {
    const passHash = await bcrypt.hash(req.body.password, 10)
    m_user.create({
      email: req.body.email,
      username: req.body.username,
      password: passHash
    }, (err, data) => {
      if (err) console.log(err)
      console.log(data)
      res.send(data)
    })
  } catch (err) {
    res.send(err)
  }
})

// Login
router.get('/admin/login', isLoggedOut, (req, res) => {
  res.render('admin/v_login', {
    title: 'Login',
    drp: dropDown
  })
})
app.post('/admin/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/admin/login'
}))
app.get('/admin/logout', (req, res) => {
  req.logOut()
  res.redirect('/admin')
})

// Api key generator
router.get('/admin/apiGen', isLoggedIn, (req, res) => {
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



app.post('/test/bcrypt', async (req, res) => {
  try {
    const passHash = await bcrypt.hash(req.body.pass, 10)
    res.json({
      status: true,
      pass: passHash
    })
  } catch (err) {
    res.send(err)
  }
})


router.get('/admin/post', isLoggedIn, (req, res) => {
  res.render('admin/v_post', {
    title: 'Post'
  })
})

router.get('/post/:id', (req, res) => {
  const id = req.params.id
  m_blog.findById(id, (err, data) => {
    res.render('v_post', {
      title: 'Post - ' + data.title,
      data: data
    })
  })
})


const fSE = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/public/assets/img/upload')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

const upload = multer({
  storage: fSE
})

app.post('/admin/post', upload.single('image'), (req, res) => {
  m_blog.create({
    imgName: req.file.filename,
    title: req.body.title,
    content: req.body.content
  })
  res.redirect('/admin/post')
})

app.post('/test/upload/img', upload.single('image'), (req, res) => {
  console.log(req.file)
  res.send('Single File upload success')
})

module.exports = {
  app,
  router
}