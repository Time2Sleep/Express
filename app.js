const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv/config')
const mongoose = require('mongoose')
const authRouter = require('./backend/routers/authRouter')
const errorMiddleware = require('./backend/middlewares/ErrorMidleware.js')

const app = express()
const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cors())
app.use('/auth', authRouter)
app.use(errorMiddleware)

app.get('/', (req, res) => res.send('Hello express'))

const start = async () => {
    try {
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(
            () => console.log(`Mongodb connected successfully`),
            err => console.error('[ERR] MONGOOSE: ', err)
        )
        app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}/`))
    } catch (e) {
        console.error('[ERR] MONGOOSE: ', e)
    }
}

start()