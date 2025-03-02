import {
  Lyrics,
  LyricsLine,
  LyricsMetadata,
  LyricsPart,
  LyricsWord,
} from "../types";
import {
  ELRCLyrics,
  ELRCMetadata,
  ELRCLyricLine,
  ELRCLyricWord,
} from "./types";

export function standardize(elrcLyrics: ELRCLyrics): Lyrics {
  const metadata: LyricsMetadata[] = elrcLyrics.metadata.map(
    (meta: ELRCMetadata) => {
      let newMeta: LyricsMetadata;
      newMeta = meta;
      switch (meta.key) {
        case "ti":
          newMeta.key = "title";
          break;
        case "ar":
          newMeta.key = "artists";
          break;
        case "al":
          newMeta.key = "album";
          break;
        default:
          break;
      }
      return newMeta;
    },
  );
  let manIsFirst: Boolean | undefined = undefined;
  const lines: LyricsLine[] = elrcLyrics.lines.map((line, i) => {
    if (line.waraoke != "D" && manIsFirst === undefined) {
      if (line.waraoke == "F") manIsFirst = false;
      if (line.waraoke == "M") manIsFirst = true;
    }
    let singerNumber: number[] = [1];
    if (line.waraoke == "D") {
      singerNumber = [1, 2];
    } else if (line.waraoke == "F") {
      singerNumber = [Number(!manIsFirst)];
    } else if (line.waraoke == "M") {
      singerNumber = [Number(manIsFirst)];
    }
    let words: LyricsWord[] = line.words;
    words.forEach((word, i) => {
      if (!word.startTime) return;
      const prev = words[i - 1];
      if (prev) if (!prev.endTime) words[i - 1].endTime = word.startTime;
    });
    if (words[words.length - 1] && !words[words.length - 1].endTime) {
      if (elrcLyrics.lines[i + 1]?.startTime)
        words[words.length - 1].endTime = elrcLyrics.lines[i + 1].startTime;
    }
    // console.log(words[words.length - 1]);
    const newLine: LyricsLine = {
      words,
      startTime: line.startTime,
      endTime: elrcLyrics.lines[i + 1]?.startTime,
      isBackground: false,
      singerNumber,
    };
    return newLine;
  });
  const parts: LyricsPart[] = [
    {
      lines,
    },
  ];
  return { metadata, parts };
}

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

  let lines: ELRCLyricLine[] = [];
  // const lines: ELRCLyricLine[] = lyrics.lines.map(
  //   (line: LyricsLine): ELRCLyricLine => {
  //     const words: ELRCLyricWord[] = line.words.map(
  //       (word: LyricsWord): ELRCLyricWord => {
  //         return {
  //           startTime: word.startTime,
  //           word: word.text,
  //         };
  //       },
  //     );
  //     return {
  //       words,
  //       // waraoke: ,
  //       startTime: line.startTime,
  //       // comment: ""
  //     };
  //   },
  // );
  lyrics.parts.forEach((part: LyricsPart) => {
    part.lines.forEach((line: LyricsLine) => {
      const words: ELRCLyricWord[] = line.words.map(
        (word: LyricsWord): ELRCLyricWord => {
          return {
            startTime: word.startTime,
            text: word.text,
          };
        },
      );
      lines.push({
        words,
        // waraoke: ,
        startTime: line.startTime,
        // comment: ""
      });
    });
  });
  return {
    metadata,
    lines,
  };
}
