export interface LyricsMetadata {
  key: string;
  value: string[];
}

export interface LyricsWord {
  startTime: number;
  endTime: number;
  text: string;
  roman?: string;
  characterTime?: number[]; // from startTime, how many ms spent to the [index] second
}

export interface LyricsLine {
  words: LyricsWord[];
  translatedLyric?: LyricsWord[];
  isBackground: boolean;
  singerNumber: number[];
  startTime: number;
  endTime: number;
}

export interface Lyrics {
  metadata: LyricsMetadata[];
  lines: LyricsLine[];
}
