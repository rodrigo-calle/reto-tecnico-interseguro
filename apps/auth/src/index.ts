import express, { Request, Response } from "express";
import "dotenv/config";
import { loadEnvs } from "./config";
import authRouter from "./apis/auth/auth.routes";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello Auth");
});

app.use("/auth", authRouter);

app
  .listen(PORT, () => {
    loadEnvs();
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
