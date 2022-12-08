import { groupBy } from "../utils/group-by";
import { Speech } from "./speech";

export interface SpeakerProps {
  name: string;
  speeches: Speech[];
}

export class Speaker implements SpeakerProps {
  public name: string;
  public speeches: Speech[];

  constructor(speakerProps: SpeakerProps) {
    this.name = speakerProps.name;
    this.speeches = speakerProps.speeches;
  }

  public static fromSpeeches(speeches: Speech[]): Speaker[] {
    const speakerToSpeechesMap: Map<string, Speech[]> = groupBy(
      speeches,
      ({ speaker }) => speaker
    );

    return Array.from(speakerToSpeechesMap.entries()).map(
      ([speakerName, speeches]) => new Speaker({ name: speakerName, speeches })
    );
  }

  public speechesFromYear(year: number) {
    return this.speeches.filter((speech) => speech.year === year);
  }

  public speechesOfTopic(topic: string) {
    return this.speeches.filter((speech) => speech.topic === topic);
  }

  public totalWords() {
    return this.speeches.reduce((sum, value) => sum + value.words, 0);
  }
}
