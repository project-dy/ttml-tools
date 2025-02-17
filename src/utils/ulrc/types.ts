export interface ULRCMetadata {
  key: string;
  value: string[];
}

export interface LyricWord {
  startTime: number;
  endTime: number;
  word: string;
  emptyBeat?: number;
}

export interface LyricLine {
  words: LyricWord[];
  translatedWords?: LyricWord[];
  romanWords?: LyricWord[];
  isBackground: boolean;
  isSecondary: boolean;
  isDuet: boolean;
  startTime: number;
  endTime: number;
}

export interface ULRCLyrics {
  metadata: ULRCMetadata[];
  lines: LyricLine[];
}
