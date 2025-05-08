import express, { Request, Response } from "express";
import dotenv from "dotenv";
import qrRoutes from "./api/qr/qr.routes";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());

app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("QR Service");
});

app.use("/qr", qrRoutes);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
