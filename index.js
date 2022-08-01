require('dotenv').config();
var express = require('express');
var app = express();
var DB = require('./db/connect')
var bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())
var keyController = require('./controllers/secretKey')
var rateController = require('./controllers/rate')
app.get('/', async (req, res) => {
    res.send('hello world!!')
})
app.get('/test', async (req,res) => {
    res.send('ok')
})
app.post('/create-key',keyController.create)
app.post('/update-key',keyController.update)
app.post('/verify-key',keyController.verify)
app.post('/feedback',rateController.create)
var server = app.listen(8081, function () {
    DB.connectDB()
    var host = server.address().address
    var port = server.address().port
    console.log("Server running http://%s:%s", host, port)
})

