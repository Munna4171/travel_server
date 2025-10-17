import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // <-- Import CORS

const app = express();
dotenv.config();

const __dirname = path.resolve();
console.log("MONGO URL:", process.env.MONGO_URL);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

// CORS middleware
app.use(
  cors({
    origin: [
      "https://travel-psi-self.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true, // Add this if using cookies/JWT in cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);

// Static files and default route for production
if (process.env.NODE_ENV_CUSTOM === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  app.use("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
