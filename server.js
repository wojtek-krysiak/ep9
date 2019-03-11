if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ep9'
const PORT = process.env.PORT || 4040

const app = express()
app.use(bodyParser.json())

const User = mongoose.model('User', {
  name: String,
  email: String,
  surname: String,
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/users', async (req, res) => {
  const users = await User.find({}).limit(10)
  res.send(users)
})

app.post('/users', async (req, res) => {
  const user = await new User(req.body.user).save()
  res.send(user)
})

const run = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true
  })
  await app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
  })
}

run()
