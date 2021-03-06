"use strict";
var http = require('http');
var url = require('url');
var fs = require('fs');

var count = 1000;
var connectionArray = [];
var chatLog = [];

var port = process.env.PORT || 3000;
var webSocketServer = require('websocket').server;
var http = require('http');
const express = require('express');
var app = express();
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/announcement', (req, res) => res.sendFile(__dirname + '/announcement.html'));
app.use(express.static(__dirname));
var server = app.listen(port, () => console.log('Listening on port ' + port + '!'));

var wsServer = new webSocketServer({
  httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
  var connection = request.accept(null, request.origin); 
  connectionArray.push(connection);
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
    // console.log("Received Message: " + message.utf8Data);
    if (message.utf8Data == 'click') {
      if (count < 10000) {
        count++;
      }
      var randVX = Math.random() * 10;
      var randVY = Math.random() * .5;
      var randDirection = Math.random();
      var sparkSize = 5 + Math.floor(Math.random() * (count / 100));
      var spark = {count:count,vx:randVX,vy:randVY,direction:randDirection,sparkSize:sparkSize,action:'click'};
      console.log('Spark created: ' + count);
      for (var i = 0; i < connectionArray.length; i++) {
        connectionArray[i].send(JSON.stringify(spark));
      }
    }
    if (message.utf8Data == 'update') {
      // updates user that just connected
      var update = {count:count,action:'update'};
      connection.send(JSON.stringify(update));
    }
    if (message.utf8Data.startsWith('Waruna')) {
      // updates announcements
      for (var i = 0; i < connectionArray.length; i++) {
        connectionArray[i].send(JSON.stringify({timestamp: new Date().getTime(), message: message.utf8Data.substring(6),action:'announce'}));
      }
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
    connectionArray = connectionArray.filter(function(el, idx, ar) {
      return el.connected;
    });
  });

});

countDown();

function countDown() {
  if (count > 0) {
    count--;
    console.log('Fire dimmed: ' + count);
    var update = {count:count,action:'update'};
    for (var i = 0; i < connectionArray.length; i++) {
        connectionArray[i].send(JSON.stringify(update));
    }
  }
  setTimeout(countDown, 1000);
}