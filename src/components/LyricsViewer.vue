<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { Lyrics, LyricsLine, LyricsPart, LyricsWord } from "../utils/types";

let lyrics: Lyrics | undefined = undefined;
let lyricsString = ref("");

let lyricsElement = useTemplateRef("lyricsElement");

async function parseLyrics(lyrics: Lyrics) {
  if (!lyricsElement.value) return;
  const lyricsDiv = lyricsElement.value;
  lyricsDiv.innerHTML = "";
  const parts = lyrics.parts;
  (async () => {
    parts.forEach((part: LyricsPart) => {
      const partElement = document.createElement("div");
      // part.type
      const lines = part.lines;
      lines.forEach((line: LyricsLine) => {
        const lineElement = document.createElement("button");
        lineElement.classList.add("line");
        const words = line.words;
        words.forEach((word: LyricsWord) => {
          const wordElement = document.createElement("span");
          wordElement.setAttribute("data-content", word.text);
          wordElement.innerText = word.text;
          if (line.startTime && word.endTime && word.startTime) {
            wordElement.setAttribute(
              "data-duration",
              String(word.endTime - word.startTime),
            );
            wordElement.setAttribute(
              "data-delay",
              String(line.startTime - word.startTime),
            );
          }
          lineElement.appendChild(wordElement);
        });
        partElement.appendChild(lineElement);
        partElement.appendChild(document.createElement("br"));
      });
      lyricsDiv.appendChild(partElement);
      lyricsDiv.appendChild(document.createElement("br"));
    });
  })();
}

function onLyricsChange(newLyrics?: Lyrics) {
  if (!newLyrics) return;
  lyrics = newLyrics;
  parseLyrics(lyrics);
  console.log(lyrics);
  lyricsString.value = JSON.stringify(lyrics);
}
console.log(lyrics);
defineExpose({
  onLyricsChange,
});
</script>

<template>
  <textarea>{{ lyricsString }}</textarea>
  <div ref="lyricsElement" />
</template>

<style>
/* .line {
  background-color: transparent;
  color: var(hsla(0, 0%, 100%, 0.175), hsla(0, 0%, 100%, 0.4));
  border: 0;
  box-shadow: none;
  transition: "color 0.1s, transform 0.1s ease-in-out, padding 0.1s ease-in-out";
} */

.line {
  --lyrics-line-margin-top: 30px;
  --lyrics-line-margin-right: 0px;
  --lyrics-line-margin-bottom: 0px;
  --lyrics-line-margin-left: 0px;
  --lyrics-line-font-size: 34px;
  --lyrics-line-color: hsla(0, 0%, 100%, 0.175);
  --systemTertiary: hsla(0, 0%, 100%, 0.4);
  --lyrics-line-height: 1.2059623529;
  --line-animation-play-state: running;
  margin: 0;
  padding: 0;
  display: inline-block;
  border: 0;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  appearance: none;
  font-family: inherit;
  /* font-size: inherit; */
  /* line-height: inherit; */
  /* font-size: 22px; */
  /* line-height: 1.1818181818; */
  font-weight: 700;
  letter-spacing: 0em;
  margin-top: var(--lyrics-line-margin-top, 30px);
  margin-right: var(--lyrics-line-margin-right, 45px);
  margin-bottom: var(--lyrics-line-margin-bottom, 0);
  margin-left: var(--lyrics-line-margin-left, 20px);
  transform: scale(1);
  transform-origin: left center;
  font-size: var(--lyrics-line-font-size, 22px);
  color: var(--lyrics-line-color, var(--systemTertiary));
  line-height: var(--lyrics-line-line-height, 1.1818181818);
  text-align: initial;
  transition:
    color 0.1s,
    transform 0.1s ease-in-out,
    padding 0.1s ease-in-out;
  animation-name: var(--line-animation-name, none);
  animation-duration: 1s;
  animation-play-state: var(--line-animation-play-state, paused);
  animation-timing-function: linear;
  animation-delay: 0.5;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
</style>
