const express = require('express')
const cors = require('cors')
const apiRouter = require('./server/routes')

const app = express()
app.use(express.json())

app.use(cors())
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization,accept');
    if (req.method === 'OPTIONS'){
        res.statusCode = 200;
        return res.end();
    }
    else{
        return next();
    }
})

app.use('/', apiRouter)

app.listen(process.env.PORT || '5500', () => {
    console.log("server is listenin!!!")
})