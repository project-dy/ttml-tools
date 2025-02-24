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

import { detect as languageDetect } from "tinyld/heavy";

export function standardize(ttml: TTMLLyrics): Lyrics {
  // let languages: { lang: string; count: number }[] = [];
  let lyricsText: string = "";
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
              lyricsText += word.text;
              return {
                startTime: word.startTime,
                endTime: word.endTime,
                text: word.text,
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

          lyricsText += "\n";
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
  const lngInfo = languageDetect(lyricsText);
  // console.log(lngInfo);
  debugger;

  return {
    language: ttml.language,
    guessedLanguage: lngInfo,
    metadata,
    parts,
  };
}

export function destandardize(lyrics: Lyrics): TTMLLyrics {
  const metadata: TTMLMetadata[] = lyrics.metadata.map(
    (meta: LyricsMetadata) => {
      let newMeta: TTMLMetadata;
      newMeta = meta;
      switch (meta.key) {
        case "title":
          newMeta.key = "musicName";
          break;
        default:
          break;
      }
      return newMeta;
    },
  );
  const parts: TTMLLyricPart[] = lyrics.parts.map(
    (part: LyricsPart): TTMLLyricPart => {
      const lines: TTMLLyricLine[] = part.lines.map(
        (line: LyricsLine): TTMLLyricLine => {
          const words: LyricsWord[] = line.words.map(
            (word: LyricsWord): TTMLLyricWord => {
              let characterTime = word.characterTime;
              let newWord: TTMLLyricWord = {
                text: word.text,
                startTime: word.startTime,
                endTime: word.endTime,
              };
              if (characterTime) {
                newWord.division = characterTime.length;
              }
              return newWord;
            },
          );

          let translatedLyric: string = "";
          line.translatedLyric?.forEach(
            (word) => (translatedLyric += word.text),
          );

          const newLine: TTMLLyricLine = {
            words,
            translatedLyric,
            isBackground: line.isBackground,
            isSecondary: line.singerNumber.includes(2),
            startTime: line.startTime,
            endTime: line.endTime,
          };
          return newLine;
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
