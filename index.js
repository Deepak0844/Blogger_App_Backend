import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { authRouter } from "./routers/authRouter.js";
import { usersRouter } from "./routers/usersRouter.js";
import { PostRouter } from "./routers/postRouter.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to db"))
  .catch((err) => console.log(err));

app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/post", PostRouter);

app.listen(PORT, () => {
  console.log("Server started", PORT);
});
