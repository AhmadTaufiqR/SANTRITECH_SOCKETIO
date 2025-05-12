const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Flutter connected: " + socket.id);
});

app.post("/trigger", express.json(), (req, res) => {
  const { title, message } = req.body;

  // Broadcast ke semua client Flutter
  io.emit("notification", { title, message });

  res.send({ success: true });
});

server.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
