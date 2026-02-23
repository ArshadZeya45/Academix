import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { corsOptions } from "./config/cors.js";
import cors from "cors";
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
