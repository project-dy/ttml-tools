import {
  Lyrics,
  LyricsMetadata,
  LyricsLine,
  LyricsWord,
  LyricsPart,
} from "../types";
import {
  TTMLLyrics,
  TTMLLyricLine,
  TTMLLyricWord,
  TTMLMetadata,
  TTMLLyricPart,
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
  const parts: LyricsPart[] = ttml.parts.map(
    (part: TTMLLyricPart): LyricsPart => {
      const lines: LyricsLine[] = part.lines.map(
        (line: TTMLLyricLine): LyricsLine => {
          const words: LyricsWord[] = line.words.map(
            (word: TTMLLyricWord): LyricsWord => {
              let characterTime: number[] = [];
              if (word.division && word.startTime && word.endTime) {
                const temp =
                  (word.endTime - word.startTime) / word.division + 1;
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
        type: part.type,
        lines: lines,
      };
    },
  );

  return {
    metadata,
    parts,
  };
}
