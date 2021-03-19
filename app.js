const express = require('express')
const app = express()
const helmet = require('helmet')
const path = require('path')

require('ejs')

require('dotenv').config()

const port = process.env.PORT
const dbase = process.env.DB

const mongoose = require('mongoose')
mongoose.connect(dbase, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', () => console.log('Terjadi kesalahan saat koneksi database'))
db.once('open', () => console.log('Sukses koneksi ke database'))

app.listen(port, () => {
  console.log(`Listening to port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(helmet())
app.use(helmet.hidePoweredBy())

app.set('views', path.join(__dirname, '/src/public/views/pages/'));
app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/src/public/assets'));

const routing = require('./src/router/router')
app.use(routing.app)
app.use(routing.router)