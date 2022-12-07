import { describe, expect, it, jest } from "@jest/globals";
import { when } from "jest-when";
import request from "supertest";
import axios from "axios";
import { EvaluationResult } from "./evaluation-service";
import { app } from "../app";

jest.mock("axios");

const axiosMock = axios as jest.Mocked<typeof axios>;

describe("EvaluationRouter Integration Tests", () => {
  describe("with successul API request", () => {
    const CSV_2013 = `Speaker, Topic, Date, Words
    Alexander Abel, Education Policy, 2013-10-30, 5310
    Bernhard Belling, Internal Security, 2013-11-05, 1210
    Caesare Collin, Coal Subsidies, 2013-11-06, 1119
    Alexander Abel, Internal Security, 2013-12-11, 911`;

    const CSV_2014 = `Speaker, Topic, Date, Words
    Alexander Abel, Education Policy, 2014-10-30, 5310
    Bernhard Belling, Coal Subsidies, 2014-11-05, 1210
    Caesare Collin, Coal Subsidies, 2014-11-06, 1119
    Alexander Abel, Internal Security, 2014-12-11, 911`;

    const CSV_ALL_NULL = `Speaker, Topic, Date, Words
    Alexander Abel, Education Policy, 2012-10-30, 50
    Caesare Collin, Coal Subsidies, 2012-11-06, 50`;

    it.each([
      [
        [CSV_2013, CSV_2014],
        {
          mostSpeeches: "Alexander Abel",
          mostSecurity: "Alexander Abel",
          leastWordy: "Caesare Collin",
        },
      ],
      [
        [CSV_ALL_NULL],
        {
          mostSpeeches: null,
          mostSecurity: null,
          leastWordy: null,
        },
      ],
    ])(
      "for given CSVs %o returns correct response %o",
      async (CSVs: string[], expectedResult: EvaluationResult) => {
        const csvUrls = mockAxiosCSVRequests(CSVs);

        const response = await request(app)
          .get("/evaluation")
          .query({ url: csvUrls });

        expect(response.body).toEqual(expectedResult);
      }
    );
  });

  describe("with failed API request", () => {
    it("returns BadRequestError when CSV is invalid", async () => {
      const csvUrls = mockAxiosCSVRequests(["invalid CSV"]);

      const response = await request(app)
        .get("/evaluation")
        .query({ url: csvUrls });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        name: "BadRequestError",
        message: expect.any(String),
        detail: {
          type: "InvalidCSVURLError",
        },
      });
    });

    it("returns BadRequestError when no URL is passed as query", async () => {
      const response = await request(app).get("/evaluation");

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        name: "BadRequestError",
        message: expect.any(String),
        detail: {
          type: "ValidationError",
          errors: expect.any(Array),
        },
      });
    });
  });

  function mockAxiosCSVRequests(CSVs: string[]): string[] {
    const urls: string[] = [];

    for (const [i, CSV] of CSVs.entries()) {
      const url = `https://test.test/csv${i}.csv`;
      when(axiosMock.get)
        .calledWith(url, { responseEncoding: "utf8" })
        .mockResolvedValue({ data: CSV } as never);

      urls.push(url);
    }

    return urls;
  }
});
