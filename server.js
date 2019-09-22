const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')
const connectDB = require('./config/db')
const app = express()

connectDB()




// app.use(cors(), express.json())

app.use(express.json({ extended: false}))
app.get('/', (req, res) => res.send("API Running"))

// GET Routes

app.use('/api/foods', require('./routes/api/foods'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))





// Mongo connection

// mongoose
//     .connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
//     .then(() => console.log("MongoDB Connected.."))
//     .catch(err => console.log(err))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))