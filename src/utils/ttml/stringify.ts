import { Lyrics } from "../types";

function stringifyTime(miliseconds: number): string {
  const minutes = String(Math.floor(miliseconds / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((miliseconds % 60000) / 1000)).padStart(
    2,
    "0",
  );
  const milliseconds = String(Math.floor(miliseconds % 1000)).padStart(2, "0");
  // [mm:ss.mss]
  return `${minutes}:${seconds}.${milliseconds}`;
}

export function stringify(lyrics: Lyrics) {
  const tt = document.createElement("tt");
  tt.setAttribute("xmlns", "http://www.w3.org/ns/ttml");
  tt.setAttribute("xmlns:itunes", "http://music.apple.com/lyric-ttml-internal");
  tt.setAttribute("xmlns:ttm", "http://www.w3.org/ns/ttml#metadata");
  tt.setAttribute("itunes:timing", "Word"); // Word, Line, None
  tt.setAttribute("xml:lang", "ja");
  const head = tt.appendChild(document.createElement("head"));
  const metadata = head.appendChild(document.createElement("metadata"));
  // let xml = new XMLSerializer().serializeToString(tt);
}
