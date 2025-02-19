import { ELRCLyrics, ELRCMetadata, ELRCLyricWord } from "./types";

const timeRegexp =
  /^(((?<hour>[0-9]+):)?(?<min>[0-9]+):)?(?<sec>[0-9]+([.:]([0-9]{1,2}))?)$/;
function parseTime(timeSpan?: string): number | undefined {
  if (!timeSpan) return;
  const matches = timeRegexp.exec(timeSpan);
  if (!matches) {
    return 0;
  }
  const hour = Number(matches.groups?.hour || "0");
  const min = Number(matches.groups?.min || "0");
  const sec = Number(matches.groups?.sec.replace(/:/, ".") || "0");
  return Math.floor((hour * 3600 + min * 60 + sec) * 1000);
}

export function parse(elrc: string): ELRCLyrics {
  const elrcMeta: ELRCMetadata[] = [];
  const elrcLines: ELRCLyrics["lines"] = [];
  elrc.split("\n").forEach((line) => {
    if (
      line.startsWith("[") &&
      line.includes("]") &&
      isNaN(Number(line.trim().slice(1, 2))) &&
      line.split("]")[0]?.includes(":")
    ) {
      const [key, value] = line.trim().slice(1, -1).split(":");
      elrcMeta.push({ key, value: [value] });
      return;
    } else if (line.startsWith("#")) {
      const text = line.slice(1).trim();
      if (!text) return;
      if (elrcLines.length == 0) {
        elrcLines[0] = {
          words: [],
          startTime: 0,
          comment: text,
        };
        return;
      }
      elrcLines[elrcLines.length - 1].comment = text;
      return;
    } else if (
      line.startsWith("[") &&
      line.includes("]") &&
      !isNaN(Number(line.trim().slice(1, 2))) &&
      line.split("]")[0]?.includes(":")
    ) {
      const startTimeLine = parseTime(line.split("]")[0].slice(1));
      let text = line.split("] ")[1].trim();
      let words: ELRCLyricWord[] = [];
      const isELRC = text.startsWith("<");
      if (isELRC) {
        const len = text.split(">").length - 1;
        for (let i = 0; i < len; i++) {
          // console.log(i);
          const startTime = parseTime(text.split(">")[0].slice(1));
          const word = text.split(">")[1].split("<")[0];
          words.push({ startTime, text: word });
          text = text.replace(text.split("<")[1], "").slice(1);
          // console.log(i, startTime, word, text);
        }
      } else {
        words.push({ text: text });
      }
      elrcLines.push({ startTime: startTimeLine, words });
    }
  });
  return {
    metadata: elrcMeta,
    lines: elrcLines,
  };
}
