import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";

// Environment variables load karna
dotenv.config();

const __dirname = path.resolve();

// Express app initialize ki
const app = express();

// Middleware use karna (CORS, JSON handling, URL encoding, logging)
app.use(
  cors({
    origin: "http://localhost:5173/", // Frontend ka origin set kiya
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json()); // JSON data handle karna
app.use(express.urlencoded({ extended: true })); // URL encoded data handle karna
app.use(morgan("dev")); // Logging ke liye Morgan middleware

// Static files ke liye folder set kiya
app.use(express.static(path.join(__dirname, "public")));

// View engine ko EJS set kiya
app.set("view engine", "ejs");

// Socket.io setup
const httpServer = createServer(app); // HTTP server create kiya
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("recive-message", { id: socket.id, ...data });
  });

  console.log(`Backend User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User disconnectd :", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

// Root route ko handle kiya
app.get("/", (req, res) => {
  res.render("index"); // index.ejs ko render karna
});

// Port ko set kiya aur server ko start kiya
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
