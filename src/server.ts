import express from "express";
import path from "path";
import morgan from "morgan";
import { evaluationRouter } from "./evaluation/evaluation-router";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { mapToHttpError } from "./error-handling/middlewares/map-to-http-error";
import { sendError } from "./error-handling/middlewares/send-error";

dayjs.extend(customParseFormat);

const server = express();
const port = 3000;

server.use(morgan("dev"));
server.use(express.static(path.join(__dirname, "public")));

server.use(evaluationRouter);

server.use(mapToHttpError);
server.use(sendError);

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
