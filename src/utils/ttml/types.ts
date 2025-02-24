export interface TTMLMetadata {
  key: "musicName" | "artists" | "album" | "songwriters" | string;
  value: string[];
}

export interface TTMLLyricWord {
  startTime?: number;
  endTime?: number;
  text: string;
  division?: number;
}

export interface TTMLLyricLine {
  words: TTMLLyricWord[];
  translatedLyric?: string;
  romanLyric?: string;
  isBackground: boolean;
  // isSecondary: boolean;
  singerNumber: number;
  startTime?: number; // if no, it should be 0
  endTime?: number;
}

export interface TTMLLyricPart {
  type?: "Verse" | "Chorus" | string;
  lines: TTMLLyricLine[];
  begin?: number;
  end?: number;
}

export interface TTMLLyrics {
  language?: string;
  metadata: TTMLMetadata[];
  parts: TTMLLyricPart[];
}
