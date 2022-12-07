import express from "express";
import path from "path";
import morgan from "morgan";
import { evaluationRouter } from "./evaluation/evaluation-router";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { mapToHttpError } from "./error-handling/middlewares/map-to-http-error";
import { sendError } from "./error-handling/middlewares/send-error";

dayjs.extend(customParseFormat);

const app = express();

app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));
app.use(express.static(path.join(__dirname, "public")));

app.use(evaluationRouter);

app.use(mapToHttpError);
app.use(sendError);

export { app };
