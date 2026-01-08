const jwt = require("jsonwebtoken");
const User = require("./models/User");
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

const docs = {}; // { roomId: { content, cursors } }

function setupSockets(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (token) {
      try {
        const data = jwt.verify(token, JWT_SECRET);
        socket.user = data;
      } catch (e) {
        console.log("JWT verify failed");
      }
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log(" Socket connected:", socket.id);

    socket.on("join-room", ({ roomId, username }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.username = username || (socket.user && socket.user.username);

      if (!docs[roomId]) docs[roomId] = { content: "", cursors: {} };
      socket.emit("init-document", { content: docs[roomId].content });
      io.to(roomId).emit("user-joined", { socketId: socket.id, username: socket.username });
    });

    socket.on("code-change", ({ roomId, content }) => {
      if (!docs[roomId]) docs[roomId] = { content: "", cursors: {} };
      docs[roomId].content = content;
      socket.to(roomId).emit("code-update", { content });
    });

    socket.on("chat-message", ({ roomId, message }) => {
      io.to(roomId).emit("chat-message", {
        socketId: socket.id,
        username: socket.username || "anon",
        message,
        ts: Date.now(),
      });
    });

    socket.on("save-personal", async ({ code }) => {
      if (!socket.user) return;
      try {
        await User.findByIdAndUpdate(socket.user.id, { personalDoc: code });
        socket.emit("personal-saved", { ok: true });
      } catch (e) {
        socket.emit("personal-saved", { ok: false, error: e.message });
      }
    });

    socket.on("disconnect", () => {
      const roomId = socket.roomId;
      if (roomId && docs[roomId]) delete docs[roomId].cursors[socket.id];
      io.to(roomId).emit("user-left", { socketId: socket.id, username: socket.username });
      console.log(" Socket disconnected:", socket.id);
    });
  });
}

module.exports = { setupSockets };
