export interface ELRCMetadata {
  key: string;
  value: string[];
}

export interface ELRCLyricWord {
  startTime: number;
  word: string;
}

export interface ELRCLyricLine {
  words: ELRCLyricWord[];
  waraoke?: "M" | "F" | "D";
  startTime: number;
  comment?: string; // above line.
}

export interface ELRCLyrics {
  metadata: ELRCMetadata[];
  lines: ELRCLyricLine[];
}
