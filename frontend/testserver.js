const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 3000

const io = require('socket.io')

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.use(express.static('public'))

http.listen(port, function(){
    console.log('listening on *:' + port)
})