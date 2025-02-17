import { Lyrics, LyricsMetadata, LyricsLine, LyricsWord } from "../types";
import {
  ELRCLyrics,
  ELRCMetadata,
  ELRCLyricLine,
  ELRCLyricWord,
} from "./types";

export function destandardize(lyrics: Lyrics): ELRCLyrics {
  const metadata: ELRCMetadata[] = lyrics.metadata;
  const lines: ELRCLyricLine[] = lyrics.lines.map(
    (line: LyricsLine): ELRCLyricLine => {
      const words: ELRCLyricWord[] = line.words.map(
        (word: LyricsWord): ELRCLyricWord => {
          return {
            startTime: word.startTime,
            word: word.text,
          };
        },
      );
      return {
        words,
        // waraoke: ,
        startTime: line.startTime,
        // comment: ""
      };
    },
  );
  return {
    metadata,
    lines,
  };
}
