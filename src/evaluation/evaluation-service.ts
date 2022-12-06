import axios from "axios";
import { InvalidSpeechCSVError, Speech } from "./speech";
import { Speaker } from "./speaker";

export interface EvaluationResult {
  mostSpeeches: string | null;
  mostSecurity: string | null;
  leastWordy: string | null;
}

const YEAR_FILTER = 2013;
const TOPIC_NAME_FILTER = "Internal Security";

export class InvalidCSVURLError extends Error {}

export class EvaluationService {
  public async evaluateFromURLs(URLs: string[]): Promise<EvaluationResult> {
    const uniqueURLs = Array.from(new Set(URLs));

    // fetch CSVs in parallel
    const speechPromises = uniqueURLs.map(this.fetchSpeechesFromCSVURL, this);
    const speeches = (await Promise.all(speechPromises)).flat();

    const speakers = Speaker.fromSpeeches(speeches);

    const speakerWithMostSpeechesInYear =
      this.evaluateSpeakerWithMostSpeechesFromYear(speakers, YEAR_FILTER);

    const speakerWithMostSpeechesOfTopic =
      this.evaluateSpeakerWithMostSpeechesAboutTopic(
        speakers,
        TOPIC_NAME_FILTER
      );

    const leastWordySpeaker = this.getLeastWordySpeaker(speakers);

    return {
      mostSpeeches: speakerWithMostSpeechesInYear?.name ?? null,
      mostSecurity: speakerWithMostSpeechesOfTopic?.name ?? null,
      leastWordy: leastWordySpeaker?.name ?? null,
    };
  }

  private async fetchSpeechesFromCSVURL(url: string): Promise<Speech[]> {
    const response = await axios.get(url, { responseEncoding: "utf8" });

    try {
      const speeches = await Speech.fromCSV(response.data);
      return speeches;
    } catch (e) {
      if (e instanceof InvalidSpeechCSVError) {
        throw new InvalidCSVURLError(
          `URL '${url}' points to invalid CSV data: ${e.message}`
        );
      }
      throw e;
    }
  }

  private evaluateSpeakerWithMostSpeechesFromYear(
    speakers: Speaker[],
    year: number
  ) {
    const sortedSpeakers = speakers
      .map((speaker) => ({
        ...speaker,
        speechesInYear: speaker.speechesFromYear(year).length,
      }))
      .sort((a, b) => b.speechesInYear - a.speechesInYear);

    if (!sortedSpeakers.length || sortedSpeakers[0].speechesInYear === 0) {
      return null;
    }

    // if the top two speakers have same amount of speeches return null
    if (
      sortedSpeakers.length > 1 &&
      sortedSpeakers[0].speechesInYear === sortedSpeakers[1].speechesInYear
    ) {
      return null;
    }

    return sortedSpeakers[0];
  }

  private evaluateSpeakerWithMostSpeechesAboutTopic(
    speakers: Speaker[],
    topic: string
  ) {
    const sortedSpeakers = speakers
      .map((speaker) => ({
        ...speaker,
        speechesOfTopic: speaker.speechesOfTopic(topic).length,
      }))
      .sort((a, b) => b.speechesOfTopic - a.speechesOfTopic);

    if (!sortedSpeakers.length || sortedSpeakers[0].speechesOfTopic === 0) {
      return null;
    }

    // if the top two speakers have same amount of speeches return null
    if (
      sortedSpeakers.length > 1 &&
      sortedSpeakers[0].speechesOfTopic === sortedSpeakers[1].speechesOfTopic
    ) {
      return null;
    }

    return sortedSpeakers[0];
  }

  private getLeastWordySpeaker(speakers: Speaker[]) {
    const sortedSpeakers = speakers
      .map((speaker) => ({
        ...speaker,
        totalWords: speaker.totalWords(),
      }))
      .sort((a, b) => a.totalWords - b.totalWords);

    if (!sortedSpeakers.length || sortedSpeakers[0].totalWords === 0) {
      return null;
    }

    // if the top two speakers have same amount of words return null
    if (
      sortedSpeakers.length > 1 &&
      sortedSpeakers[0].totalWords === sortedSpeakers[1].totalWords
    ) {
      return null;
    }

    return sortedSpeakers[0];
  }
}
