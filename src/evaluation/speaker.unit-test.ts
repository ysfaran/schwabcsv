import { describe, expect } from "@jest/globals";
import { Speaker } from "./speaker";
import { Speech, SpeechProps } from "./speech";
import dayjs from "dayjs";

describe("Speaker Unit Tests", () => {
  describe("fromSpeeches()", () => {
    it("splits speakers based on speaker name", () => {
      const speeches = [
        createSpeech({ speaker: "speaker1" }),
        createSpeech({ speaker: "speaker2" }),
        createSpeech({ speaker: "speaker2" }),
      ];

      const speakers = Speaker.fromSpeeches(speeches);

      expect(speakers).toHaveLength(2);

      expect(speakers[0].name).toBe("speaker1");
      expect(speakers[0].speeches).toEqual([speeches[0]]);

      expect(speakers[1].name).toBe("speaker2");
      expect(speakers[1].speeches).toEqual([speeches[1], speeches[1]]);
    });
  });

  describe("speechesFromYear()", () => {
    it.each([
      [[], 0],
      [["2022-01-01"], 1],
      [["2022-01-01", "2022-02-02", "2023-02-02"], 2],
    ])(
      "for year 2022 with speeches from %p returns %i speeches",
      (dates: string[], expectedSpeeches: number) => {
        const year = 2022;
        const speeches = dates.map((dateStr) =>
          createSpeech({ date: dayjs(dateStr, "YYYY-MM-DD", true) })
        );

        const speaker = new Speaker({ name: "speaker", speeches });
        const speechesFromYear = speaker.speechesFromYear(year);

        expect(speechesFromYear).toHaveLength(expectedSpeeches);
      }
    );
  });

  describe("speechesOfTopic()", () => {
    it.each([
      [[], 0],
      [["Industry"], 1],
      [["Industry", "Industry", "Politics"], 2],
    ])(
      "for topic 'Industry' with speeches of topics %p returns %i speeches",
      (topics: string[], expectedTopics: number) => {
        const topic = "Industry";
        const speeches = topics.map((topic) => createSpeech({ topic }));

        const speaker = new Speaker({ name: "speaker", speeches });
        const speechesOfTopic = speaker.speechesOfTopic(topic);

        expect(speechesOfTopic).toHaveLength(expectedTopics);
      }
    );
  });

  describe("totalWords()", () => {
    it.each([
      [[0], 0],
      [[1], 1],
      [[1, 2, 3], 6],
    ])(
      "for speeches with %p words returns %i total words",
      (wordsItems: number[], expectedTotalWords: number) => {
        const speeches = wordsItems.map((words) => createSpeech({ words }));

        const speaker = new Speaker({ name: "speaker", speeches });
        const totalWords = speaker.totalWords();

        expect(totalWords).toBe(expectedTotalWords);
      }
    );
  });

  function createSpeech(overrides?: Partial<SpeechProps>) {
    return new Speech({
      speaker: "speaker",
      topic: "Topic",
      date: dayjs("2022-01-01", "YYYY-MM-DD", true),
      words: 1,
      ...overrides,
    });
  }
});
