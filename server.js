const express = require('express')
const apiRouter = require('./server/routes')

const app = express()
app.use(express.json())

app.use('/', apiRouter)

app.listen(process.env.PORT || '3000', () => {
    console.log("server is listenin!!!")
})