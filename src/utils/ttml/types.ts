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
  startTime: number; // if no, it should be 0
  endTime: number;
}

export interface TTMLLyricPart {
  type?: "Verse" | "Chorus" | string;
  lines: TTMLLyricLine[];
  begin?: number;
  end?: number;
}

export interface TTMLLyrics {
  metadata: TTMLMetadata[];
  parts: TTMLLyricPart[];
}
