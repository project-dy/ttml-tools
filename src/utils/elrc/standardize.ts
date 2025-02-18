import { Lyrics, LyricsLine, LyricsMetadata, LyricsWord } from "../types";
import {
  ELRCLyrics,
  ELRCMetadata,
  ELRCLyricLine,
  ELRCLyricWord,
} from "./types";

export function destandardize(lyrics: Lyrics): ELRCLyrics {
  const metadata: ELRCMetadata[] = lyrics.metadata.map(
    (meta: LyricsMetadata) => {
      let newMeta: ELRCMetadata;
      newMeta = meta;
      switch (meta.key) {
        case "title":
          newMeta.key = "ti";
          break;
        case "artists":
          newMeta.key = "ar";
          break;
        case "album":
          newMeta.key = "al";
          break;
        default:
          break;
      }
      return newMeta;
    },
  );
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
