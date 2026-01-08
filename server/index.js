require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { setupSockets } = require("./sockets");
const authRoutes = require("./routes/auth");
const codeRoutes = require("./routes/code");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/code", codeRoutes);

setupSockets(io);


const PORT = process.env.PORT || 5000;
async function connectmon() {
await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // 30 seconds
})
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => console.error(" MongoDB connection error:", err));
}
connectmon();