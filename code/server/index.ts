import express from "express";
import cors from "cors";
import docsRouter from "./routes/docs";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/docs", docsRouter);

app.listen(4000, () => console.log("Server running on port 4000"));
