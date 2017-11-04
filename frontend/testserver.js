const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3001;

app.use(express.static('public'));

http.listen(port, function(){
    console.log('listening on *:' + port)
});