require('dotenv').config();
var express = require('express');
var app = express();
var DB = require('./db/connect')
var bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())
var keyController = require('./controllers/secretKey')
app.post('/create-key',keyController.create)
app.post('/update-key',keyController.update)
app.post('/verify-key',keyController.verify)
var server = app.listen(8081, function () {
    DB.connectDB()
    var host = server.address().address
    var port = server.address().port
    console.log("Server running http://%s:%s", host, port)
})

