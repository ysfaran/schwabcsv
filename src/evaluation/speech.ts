import dayjs from "dayjs";
import CSV from "csvtojson/v2";
import { isInt } from "../utils/is-int";

export interface SpeechProps {
  speaker: string;
  topic: string;
  date: dayjs.Dayjs;
  words: number;
}

export class InvalidSpeechCSVError extends Error {}

export class Speech implements SpeechProps {
  public speaker: string;
  public topic: string;
  public date: dayjs.Dayjs;
  public words: number;

  private static CSV_HEADERS = ["speaker", "topic", "date", "words"];

  constructor(speechProps: SpeechProps) {
    this.speaker = speechProps.speaker;
    this.topic = speechProps.topic;
    this.date = speechProps.date;
    this.words = speechProps.words;
  }

  public static async fromCSV(CSVContent: string): Promise<Speech[]> {
    Speech.assertValidCSVHeader(CSVContent);

    const speechPropsItems: SpeechProps[] =
      await Speech.createCSVParser().fromString(CSVContent);

    return speechPropsItems.map((speechProps) => new Speech(speechProps));
  }

  public get year() {
    return this.date.year();
  }

  private static assertValidCSVHeader(CSVContent: string) {
    const csvLines = CSVContent?.split("\n");

    if (!csvLines.length) {
      throw new InvalidSpeechCSVError("Content is empty");
    }

    const csvHeaders = csvLines[0]
      .split(",")
      .map((header) => header.toLowerCase().trim());

    if (csvHeaders.length !== Speech.CSV_HEADERS.length) {
      throw new InvalidSpeechCSVError(
        `Expected ${Speech.CSV_HEADERS.length} headers, but got ${csvHeaders.length}`
      );
    }

    const headersEqual = csvHeaders.every(
      (header, i) => header.toLowerCase().trim() === Speech.CSV_HEADERS[i]
    );

    if (!headersEqual) {
      throw new InvalidSpeechCSVError(
        `Expected headers to be [${Speech.CSV_HEADERS}], but got [${csvHeaders}]`
      );
    }
  }

  private static createCSVParser = () => {
    return CSV({
      delimiter: ",",
      headers: Speech.CSV_HEADERS,
      trim: true,
      checkColumn: true,
      colParser: {
        speaker: (item) => {
          if (typeof item !== "string" || !item.length) {
            throw new InvalidSpeechCSVError(`'${item}' is not a valid speaker`);
          }

          return item;
        },
        topic: (item) => {
          if (typeof item !== "string" || !item.length) {
            throw new InvalidSpeechCSVError(`'${item}' is not a valid topic`);
          }

          return item;
        },
        date: (item) => {
          const date = dayjs(item, "YYYY-MM-DD", true);

          if (!date.isValid()) {
            throw new InvalidSpeechCSVError(
              `'${item}' is not a valid date (required format: YYYY-MM-DD)`
            );
          }

          return date;
        },
        words: (item) => {
          if (typeof item !== "string" || !item.length || !isInt(item)) {
            throw new InvalidSpeechCSVError(
              `'${item}' is not a valid value for words`
            );
          }

          const words = parseInt(item, 10);

          if (words < 0) {
            throw new InvalidSpeechCSVError(
              `'${item}' is not a valid words count, because it's less than 0`
            );
          }

          return words;
        },
      },
    });
  };
}
