const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
var bodyParser = require('body-parser')

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json())

app.use(cors());
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
});

// Store client sockets and their corresponding client IDs
const clientSockets = new Map();

io.on('connection', (socket) => {
  const clientId = socket.handshake.query.clientId;
  console.log(`A user connected with ID: ${clientId}`);

  // Store the socket with the client ID
  clientSockets.set(clientId, socket);

  socket.on('disconnect', () => {
    console.log(`A user with ID ${clientId} disconnected`);

    // Remove the socket when the client disconnects
    clientSockets.delete(clientId);
  });

  socket.on('message', (data) => {
    console.log(`Received message from client ${clientId}:`, data);

    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit('message', data);
  });
});

// Route to send a message to a specific client
app.post('/send-message/:clientId', (req, res) => {
  const { clientId } = req.params;
  const { message } = req.body;
  console.log(message);

  // Retrieve the socket of the specified client
  const clientSocket = clientSockets.get(clientId);

  if (!clientSocket) {
    return res.status(404).json({ message: 'Client not found' });
  }

  // Send the message to the specified client
  clientSocket.emit('message', message);

  return res.json({ message: 'Message sent successfully' });
});

app.set('port', process.env.PORT || 4005);

server.listen(process.env.PORT || 4005, () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
