export interface TTMLMetadata {
  key: "musicName" | "artists" | "album" | string;
  value: string[];
}

export interface TTMLLyricWord {
  startTime: number;
  endTime: number;
  word: string;
  division?: number;
}

export interface TTMLLyricLine {
  words: TTMLLyricWord[];
  translatedLyric: string;
  romanLyric: string;
  isBackground: boolean;
  isSecondary: boolean;
  startTime: number;
  endTime: number;
}

export interface TTMLLyrics {
  metadata: TTMLMetadata[];
  lines: TTMLLyricLine[];
}
