require('dotenv').config();
var express = require('express');
var cors = require('cors')
var app = express();
var DB = require('./db/connect')
var bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())
app.use(cors())

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, 'namlv200996', (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }


var keyController = require('./controllers/secretKey')
var rateController = require('./controllers/rate')
var adminController = require('./controllers/admin')
app.get('/', async (req, res) => {
    res.send('hello world!!')
})
app.get('/test', async (req,res) => {
    res.send('ok')
})
app.post('/list-key',authenticateToken , keyController.list)
app.post('/create-key',authenticateToken,keyController.create)
app.post('/detail-key',authenticateToken,keyController.detail)
app.post('/update-key',authenticateToken,keyController.update)
app.post('/verify-key',keyController.verify)
app.post('/feedback',rateController.create)
app.post('/admin/login',adminController.login)
app.post('/admin/register',adminController.register)
var server = app.listen(8081, function () {
    DB.connectDB()
    var host = server.address().address
    var port = server.address().port
    console.log("Server running http://%s:%s", host, port)
})

