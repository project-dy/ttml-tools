import { Lyrics, LyricsMetadata, LyricsLine, LyricsWord } from "../types";
import {
  TTMLLyrics,
  TTMLLyricLine,
  TTMLLyricWord,
  TTMLMetadata,
} from "./types";

export function standardize(ttml: TTMLLyrics): Lyrics {
  const metadata: LyricsMetadata[] = ttml.metadata.map((meta: TTMLMetadata) => {
    let newMeta: LyricsMetadata;
    newMeta = meta;
    switch (meta.key) {
      case "musicName":
        newMeta.key = "title";
        break;
      default:
        break;
    }
    return newMeta;
  });
  const lines: LyricsLine[] = ttml.lines.map(
    (line: TTMLLyricLine): LyricsLine => {
      const words: LyricsWord[] = line.words.map(
        (word: TTMLLyricWord): LyricsWord => {
          let characterTime: number[] = [];
          if (word.division) {
            const temp = (word.endTime - word.startTime) / word.division + 1;
            for (let i = 0; i < word.division; i++) {
              characterTime[i] = temp * (i + 1);
            }
          }
          return {
            startTime: word.startTime,
            endTime: word.endTime,
            text: word.word,
            characterTime,
          };
        },
      );
      let translatedLyric: LyricsWord[] | undefined;
      if (line.translatedLyric)
        translatedLyric = [
          {
            startTime: line.startTime,
            endTime: line.endTime,
            text: line.translatedLyric,
          },
        ];

      return {
        words,
        translatedLyric,
        isBackground: line.isBackground,
        singerNumber: [!line.isSecondary ? 1 : 2],
        startTime: line.startTime,
        endTime: line.startTime,
      };
    },
  );
  return {
    metadata,
    lines,
  };
}
