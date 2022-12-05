import express from "express";
import { query, validationResult } from "express-validator";
import { ValidationError } from "../error-handling/validation-error";
import { EvaluationService } from "./evaluation-service";

const evaluationRouter = express.Router();
const evaluationService = new EvaluationService();

evaluationRouter.get(
  "/evaluation",
  query("url")
    .exists()
    .withMessage("Provide at least one url")
    .toArray()
    .isURL({
      require_tld: false,
      require_protocol: true,
      protocols: ["https", "http"],
    })
    .withMessage(
      "At least one of the provided URLs is invalid (example: 'https://example.com/file.csv)'"
    ),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new ValidationError({ errors: errors.array() });
      }

      const urls = req.query!.url as unknown as string[];
      const evaluationResult = await evaluationService.evaluateFromURLs(urls);

      return res.json(evaluationResult);
    } catch (e) {
      next(e);
    }
  }
);

export { evaluationRouter };
