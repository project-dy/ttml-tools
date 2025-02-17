export interface TTMLMetadata {
  key: string;
  value: string[];
}

export interface LyricWord {
  startTime: number;
  endTime: number;
  word: string;
  division?: number;
}

export interface LyricLine {
  words: LyricWord[];
  translatedLyric: string;
  romanLyric: string;
  isBackground: boolean;
  isSecondary: boolean;
  startTime: number;
  endTime: number;
}

export interface TTMLLyrics {
  metadata: TTMLMetadata[];
  lines: LyricLine[];
}
