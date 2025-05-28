// const express = require("express");
// const admin = require("firebase-admin");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.use(express.json());

// // Inisialisasi Firebase Admin SDK
// const serviceAccount = require(path.join(
//   __dirname,
//   "santritech-app-firebase-adminsdk-fbsvc-f74f59b8b5.json"
// ));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Fungsi kirim FCM
// const sendFcmMessage = async ({ token, title, body }) => {
//   const message = {
//     token,
//     data: {
//       title,
//       body,
//     },
//     android: {
//       priority: "high",
//     },
//   };

//   return admin.messaging().send(message);
// };

// // Endpoint Express
// app.post("/fcm", async (req, res) => {
//   const { token, title, body } = req.body;

//   if (!token || !title || !body) {
//     return res.status(400).json({ error: "Missing token, title, or body" });
//   }

//   try {
//     const response = await sendFcmMessage({ token, title, body });
//     res.json({ success: true, messageId: response });
//   } catch (error) {
//     console.error("Error sending FCM:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`FCM server running on http://localhost:${PORT}`);
// });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

// Inisialisasi Firebase Admin SDK
const serviceAccount = require(path.join(
  __dirname,
  "santritech-app-firebase-adminsdk-fbsvc-f74f59b8b5.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fungsi kirim FCM
const sendFcmMessage = async ({ token, title, body }) => {
  const message = {
    token,
    data: {
      title,
      body,
    },
    android: {
      priority: "high",
    },
  };

  return admin.messaging().send(message);
};

io.on("connection", (socket) => {
  console.log("Laravel connected: " + socket.id);
  console.log("Flutter connected: " + socket.id);

  socket.on("client-message", async (data) => {
    // console.log("Pesan diterima:", data);
    const { token, title, body } = data;
    if (!token || !title || !body) {
      // return res.status(400).json({ error: "Missing token, title, or body" });
      console.log("Ada yang salah");
    }

    try {
      const response = await sendFcmMessage({ token, title, body });
      // res.json({ success: true, messageId: response });
      // console.log(response);
      console.log("Berhasil Dikirim");
    } catch (error) {
      console.error("Error sending FCM:", error);
      // res.status(500).json({ error: error.message });
    }
  });
});

server.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
