// import { XMLParser } from "fast-xml-parser";

// const parser = new XMLParser({
//   ignoreAttributes: false,
//   attributeNamePrefix: "",
//   allowBooleanAttributes: true,
//   parseAttributeValue: true,
//   trimValues: true,
// });

// export function parse(ttml: string) {
//   return parser.parse(ttml);
// }

import { TTMLLyrics, TTMLMetadata } from "./types";

import { Lyrics, LyricsMetadata, LyricsLine, LyricsWord } from "../types";
import { LyricLine, LyricWord } from "../ulrc/types";

const timeRegexp =
  /^(((?<hour>[0-9]+):)?(?<min>[0-9]+):)?(?<sec>[0-9]+([.:]([0-9]{1,3}))?)$/;
export function parseTime(timeSpan: string): number {
  const matches = timeRegexp.exec(timeSpan);
  if (!matches) {
    return 0;
  }
  const hour = Number(matches.groups?.hour || "0");
  const min = Number(matches.groups?.min || "0");
  const sec = Number(matches.groups?.sec.replace(/:/, ".") || "0");
  return Math.floor((hour * 3600 + min * 60 + sec) * 1000);
}

export function parse(ttml: string): TTMLLyrics {
  const domParser = new DOMParser();
  const doc: XMLDocument = domParser.parseFromString(ttml, "text/xml");
  // console.log(doc);
  // debugger;
  const ttMeta: TTMLMetadata[] = [];
  const ttLines: TTMLLyrics["lines"] = [];

  const metadata = doc.getElementsByTagName("metadata");
  for (let i = 0; i < metadata.length; i++) {
    const meta = metadata[i];
    const key = meta.getAttribute("key");
    if (!key) continue;
    const value = meta.getAttribute("value");
    if (!value) continue;
    const existing = ttMeta.find((m) => m.key === key);
    if (existing) {
      existing.value.push(value);
      continue;
    }
    ttMeta.push({ key, value: [value] });
  }

  const body = doc.getElementsByTagName("body")[0];
  const divs = body.getElementsByTagName("div");
  for (let i = 0; i < divs.length; i++) {
    const div = divs[i];

    const ps = div.getElementsByTagName("p");
    function parseP(p: Element, isBackground = false) {
      // console.log(p);
      const spans = p.getElementsByTagName("span");
      const line: TTMLLyrics["lines"][number] = {
        words: [],
        translatedLyric: "",
        romanLyric: "",
        isBackground,
        isSecondary: p.getAttribute("ttm:agent") === "v2",
        startTime: parseTime(p.getAttribute("begin") || ""),
        endTime: parseTime(p.getAttribute("end") || ""),
      };
      // const startTimeLyrics = parseTime(p.getAttribute("startTime") || "");
      // const endTimeLyrics = parseTime(p.getAttribute("entTime") || "");
      let includeBackground = false;
      function parseSpan(spans: HTMLCollectionOf<Element>) {
        for (let j = 0; j < spans.length; j++) {
          const span = spans[j];
          if (span.getAttribute("ttm:role") === "x-bg") {
            // debugger;
            parseP(span, true);
            includeBackground = true;
            continue;
          } else if (
            span.getAttribute("ttm:role") === "x-translation" &&
            span.textContent
          ) {
            line.translatedLyric = span.textContent;
            continue;
          } else if (
            span.getAttribute("ttm:role") === "x-roman" &&
            span.textContent
          ) {
            line.romanLyric = span.textContent;
            continue;
          }
          const division =
            typeof span.getAttribute("amll:empty-beat") === "string"
              ? Number(span.getAttribute("amll:empty-beat"))
              : undefined;
          const startTime = parseTime(span.getAttribute("begin") || "");
          const endTime = parseTime(span.getAttribute("end") || "");
          // debugger;
          const word = span.textContent;
          if (!word) continue;
          line.words.push({
            startTime,
            endTime,
            word,
            division,
          });
        }
      }
      parseSpan(spans);

      // ttLines.push(line);
      if (includeBackground) {
        const insertIndex = ttLines.length - 1;
        ttLines.splice(insertIndex, 0, line);
      } else {
        ttLines.push(line);
      }
    }
    for (let j = 0; j < ps.length; j++) {
      parseP(ps[j]);
    }
  }

  // debugger;

  return {
    metadata: ttMeta,
    lines: ttLines,
  };
}

export function standardize(ttml: TTMLLyrics): Lyrics {
  const metadata: LyricsMetadata[] = ttml.metadata;
  const lines: LyricsLine[] = ttml.lines.map((line): LyricsLine => {
    const words: LyricsWord[] = line.words.map((word): LyricsWord => {
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
    });
    return {
      words,
      translatedLyric: undefined, // 기존 lyrics는 단순한 text이지만, 이 lyrics는 time-synced lyrics임 따라서 migration불가
      isBackground: line.isBackground,
      singerNumber: !line.isSecondary ? 1 : 2,
      startTime: line.startTime,
      endTime: line.startTime,
    };
  });
  return {
    metadata,
    lines,
  };
}

export default { parse, standardize };
