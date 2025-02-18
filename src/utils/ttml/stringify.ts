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
  const head = tt.appendChild(document.createElement("head"));
  const metadata = head.appendChild(document.createElement("metadata"));
  // let xml = new XMLSerializer().serializeToString();
}
