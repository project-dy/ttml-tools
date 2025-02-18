export interface LyricsMetadata {
  key: "title" | "artists" | "album" | string;
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

export interface LyricsPart {
  type: "Verse" | "Chorus" | string;
  lines: LyricsLine[];
}

export interface Lyrics {
  metadata: LyricsMetadata[];
  parts: LyricsPart[];
}
