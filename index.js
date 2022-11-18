const http = require('http')
const express = require("express");
const app = express();
const WebSocket = require("ws");
const PORT = process.env.PORT || 8000;
const path = require('path');
const moment = require("moment");
app.set("port", PORT);

var controllerSocket = [];
var clientsocket = [];
const server = http.createServer(
    app
  );

server.listen(PORT);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '/public')))
wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
          if (clientsocket.length == 0)
              clientsocket.push(ws);
          if (controllerSocket.length != 0)    
              controllerSocket[0].send(message);
    });
  });

  app.get("/configureSession", async (req, res) => {
    
  
    const setupSession = () => {
      return new Promise((resolve, reject) => {
        // Establishing connection with IDE
        controllerSocket.push (new WebSocket(
          `ws://localhost:9002`,
          {
            perMessageDeflate: false,
          }
        ))
  
        controllerSocket[0].on("error", function (error) {
          console.log(error)
          reject(error);
        });
  
        // if connection is established with IDE
        controllerSocket[0].on("open", (open) => {
          resolve();
          console.log("connected")
        });
  
        // Send message to all register clients with this socket session on message receive
        controllerSocket[0].on("message", function incoming(data) {
        
          if (clientsocket.length != 0)
              clientsocket[0].send(data);    
      });
    });   
  }
  try {
    // setTimeout(async () => {
    await setupSession();
    res.send("OK");
    // }, 3000);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
    
  });



  
    
 

  