import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import allRoutes from "./routes/web.js";

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("connection successfull");
  })
.catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);


allRoutes(app);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
