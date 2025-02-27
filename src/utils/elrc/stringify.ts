import { ELRCLyrics } from "./types";

function stringifyTime(miliseconds: number): string {
  const minutes = String(Math.floor(miliseconds / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((miliseconds % 60000) / 1000)).padStart(
    2,
    "0",
  );
  const milliseconds = String(Math.floor((miliseconds % 1000) / 10)).padStart(
    2,
    "0",
  );
  // [mm:ss.ms]
  return `${minutes}:${seconds}.${milliseconds}`;
}

export function stringify(elrc: ELRCLyrics) {
  let elrcString: string = "";
  elrc.metadata.forEach((meta) => {
    const metaString = `[${meta.key}:${String(meta.value).replace("[", "\\[").replace("]", "\\]")}]`;
    elrcString = elrcString.concat(metaString, "\n");
  });
  elrc.lines.forEach((line) => {
    let words: string = "";
    line.words.forEach((word) => {
      if (!word.startTime) {
        words += `${word.text}`;
        return;
      }
      words += `<${stringifyTime(word.startTime)}>${word.text}`;
    });
    if (!line.startTime) {
      elrcString += `${words}\n`;
      return;
    }
    elrcString += `[${stringifyTime(line.startTime)}] ${words}\n`;
  });
  return elrcString;
}
