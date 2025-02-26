<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { Lyrics, LyricsLine, LyricsPart, LyricsWord } from "../utils/types";

let lyrics: Lyrics | undefined = undefined;
let lyricsString = ref("");

let lyricsElement = useTemplateRef("lyricsElement");

// let rootElement = useTemplateRef("root");

let audio: HTMLAudioElement = new Audio();

interface Word {
  highlighted: Boolean;
  element: HTMLSpanElement;
}

interface Line {
  startTime: number;
  highlighted: Boolean;
  element: HTMLDivElement;
  words: Word[];
}

interface Part {
  highlighted: Boolean;
  lines: Line[];
}

let lyricsState: Part[] = [];

interface IndexedLine {
  startTime: number;
  part: number;
  line: number;
}

let indexedLines: IndexedLine[] = [];

const sortLine = async () =>
  indexedLines.sort((a, b) => a.startTime - b.startTime);

const findStartTime = (currentTime: number): IndexedLine | undefined => {
  if (indexedLines.length === 0) {
    return undefined; // 배열이 비어있는 경우 undefined 반환
  }

  if (currentTime <= indexedLines[0].startTime) {
    return undefined;
    return indexedLines[0]; // currentTime이 첫 번째 startTime보다 작거나 같을 경우
  }

  if (currentTime >= indexedLines[indexedLines.length - 1].startTime) {
    return undefined;
    return indexedLines[indexedLines.length - 1]; // currentTime이 마지막 startTime보다 크거나 같을 경우
  }

  for (let i = 1; i < indexedLines.length; i++) {
    if (
      currentTime >= indexedLines[i - 1].startTime &&
      currentTime < indexedLines[i].startTime
    ) {
      return indexedLines[i - 1]; // currentTime이 두 startTime 사이에 있을 경우
    }
  }
  return undefined;
};
let lastLineElement: HTMLElement;
// let beforeLineElement: HTMLElement;

async function parseLyrics(lyrics: Lyrics) {
  if (!lyricsElement.value) return;
  const lyricsDiv = lyricsElement.value;
  lyricsDiv.innerHTML = "";
  const parts = lyrics.parts;
  (async () => {
    for (let i = 0; i < parts.length; i++) {
      const part: LyricsPart = parts[i];
      // parts.forEach((part: LyricsPart, i: number) => {
      lyricsState[i] = { highlighted: false, lines: [] };
      const partElement = document.createElement("div");
      if (i === 0)
        partElement.appendChild(
          (() => {
            const lastLineElement = document.createElement("div");
            lastLineElement.style.height = "312.96px";
            // lastLineElement = beforeLineElement;
            return lastLineElement;
          })(),
        );
      // part.type
      const lines = part.lines;
      for (let j = 0; j < lines.length; j++) {
        const line: LyricsLine = lines[j];
        // lines.forEach((line: LyricsLine, j: number) => {
        const lineElement = document.createElement("div");
        const lineStartTime = line.startTime;
        if (!lineStartTime) return;
        lyricsState[i].lines[j] = {
          startTime: lineStartTime,
          highlighted: false,
          element: lineElement,
          words: [],
        };
        lineElement.addEventListener("click", () => {
          audio.focus();
          console.log(`${audio.currentTime} -> ${lineStartTime / 1000}`);
          audio.currentTime = lineStartTime / 1000;
          audio.play();
        });
        indexedLines.push({ part: i, line: j, startTime: lineStartTime });

        lineElement.classList.add("display-synced-line", "is-animating"); //("display-synced-line", "is-duet", "is-animating", "is-current", "is-secondary-vocalist","is-duet")
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("line");
        const vocalDiv = document.createElement("div");
        vocalDiv.classList.add(
          !line.isBackground ? "primary-vocals" : "background-vocals",
        );
        const wordDiv = document.createElement("div");
        wordDiv.classList.add("word");
        const words = line.words;
        for (let k = 0; k < words.length; k++) {
          const word: LyricsWord = words[k];
          // words.forEach((word: LyricsWord, k: number) => {
          const wordElement = document.createElement("span");
          lyricsState[i].lines[j].words[k] = {
            highlighted: false,
            element: wordElement,
          };
          wordElement.setAttribute("data-content", word.text);
          wordElement.innerText = word.text;
          wordElement.classList.add("syllable");
          if (line.startTime && word.endTime && word.startTime) {
            wordElement.setAttribute(
              "data-duration",
              String(word.endTime - word.startTime),
            );
            wordElement.setAttribute(
              "data-delay",
              String(word.startTime - line.startTime),
            );
          }
          wordDiv.appendChild(wordElement);
        }
        vocalDiv.appendChild(wordDiv);
        buttonElement.appendChild(vocalDiv);
        lineElement.appendChild(buttonElement);
        partElement.appendChild(lineElement);
        partElement.appendChild(document.createElement("br"));
      }
      lyricsDiv.appendChild(partElement);
      lyricsDiv.appendChild(document.createElement("br"));
    }
    await sortLine();
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
let lastLine: Line;
function onCurrentTimeChange(currentTime: number) {
  if (!lyricsElement.value) return;
  const lyricsDiv = lyricsElement.value;
  // console.log(currentTime);
  const currentLineInfo = findStartTime(currentTime * 1000);
  if (!currentLineInfo) {
    lyricsDiv
      .querySelectorAll(".is-current")
      .forEach((e) => e.classList.remove("is-current"));
    return;
  }
  const currentLine =
    lyricsState[currentLineInfo.part].lines[currentLineInfo.line];

  if (lastLine !== currentLine) {
    try {
      // console.log(lastLineElement);
      lastLineElement.scrollIntoView();
    } catch (e) {}
    if (lastLine !== undefined) lastLineElement = currentLine.element;
    lastLine = currentLine;
  }

  // lyricsDiv.scroll({
  //   top: currentLine.element.offsetTop,
  //   behavior: "smooth",
  // });

  // console.log(currentLine);
  if (!currentLine.element.classList.contains("is-current")) {
    lyricsDiv
      .querySelectorAll(".is-current")
      .forEach((e) => e.classList.remove("is-current"));
    currentLine.element.classList.add("is-current");
  }
  // style="transform: matrix(1, 0, 0, 1, 0, -2); --gradient-progress: 100%;"
  const time = currentTime * 1000 - currentLine.startTime;
  let lastPercentage: number = 100;
  currentLine.words.forEach((word) => {
    const wordElement = word.element;
    const duration = Number(wordElement.getAttribute("data-duration"));
    const delay = Number(wordElement.getAttribute("data-delay"));
    if (!duration) return;
    let percentage = ((time - delay) / duration) * 100;
    if (percentage < 0) percentage = 0;
    // if (percentage === 0) return;
    if (percentage > 100) percentage = 100;
    /*console.log(
      word.element.innerText,
      delay,
      duration,
      time,
      currentTime * 1000,
      currentLine.startTime,
      percentage,
    );*/
    if (lastPercentage == 100) {
      wordElement.style.transform = "matrix(1, 0, 0, 1, 0, -2)";
      wordElement.style.setProperty("--gradient-progress", `${percentage}%`);
    } else {
      wordElement.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
      wordElement.style.setProperty("--gradient-progress", `-100%`);
    }
    lastPercentage = percentage;
  });
}
function syncAudioElement(audioElement: HTMLAudioElement) {
  // console.log(audioElement);
  audio = audioElement;
}
defineExpose({
  onLyricsChange,
  onCurrentTimeChange,
  syncAudioElement,
});
</script>

<template>
  <div
    style="height: 75vh; overflow-y: auto; scroll-behavior: smooth"
    ref="root"
  >
    <textarea style="display: none">{{ lyricsString }}</textarea>
    <div ref="lyricsElement" />
  </div>
</template>

<style src="./LyricsViewer.css"></style>
<!-- <style>
/* .line {
  background-color: transparent;
  color: var(hsla(0, 0%, 100%, 0.175), hsla(0, 0%, 100%, 0.4));
  border: 0;
  box-shadow: none;
  transition: "color 0.1s, transform 0.1s ease-in-out, padding 0.1s ease-in-out";
} */

.syllable {
  display: inline-block;
  position: relative;
  transform-origin: right;
  white-space: pre;
}
.display-synced-line.is-current
  .syllable:not(.emphasis)[style*="--gradient-progress"] {
  background-image: linear-gradient(
    90deg,
    rgba(
        var(--gradient-color),
        var(--gradient-color),
        var(--gradient-color),
        var(--gradient-color-alpha-active)
      )
      var(--gradient-progress),
    rgba(
        var(--gradient-color),
        var(--gradient-color),
        var(--gradient-color),
        var(--gradient-color-alpha)
      )
      calc(var(--gradient-progress) + 20%)
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}

.line {
  box-shadow: 0 0 0px;
  --lyrics-line-margin-top: 30px;
  --lyrics-line-margin-right: 0px;
  --lyrics-line-margin-bottom: 0px;
  --lyrics-line-margin-left: 0px;
  --lyrics-line-font-size: 34px;
  --lyrics-line-color: hsla(0, 0%, 100%, 0.175);
  --systemTertiary: hsla(0, 0%, 100%, 0.4);
  --lyrics-line-height: 1.2;
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
-->
