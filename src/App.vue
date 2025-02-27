<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import ttml from "./utils/ttml";
import elrc from "./utils/elrc";
import { Lyrics } from "./utils/types";
import LyricsViewer from "./components/LyricsViewer.vue";
import Background from "./components/Background.vue";
// import { saveAsFile } from "./utils/save";

const isTauri = ref(false);
if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
  // inside tauri
  isTauri.value = true;
} else {
  // outside tauri
  isTauri.value = false;
}

let lyrics: Lyrics;

const childComponentRef = ref<InstanceType<typeof LyricsViewer> | null>(null);

const audio = useTemplateRef("audio");

function refresh() {
  if (childComponentRef.value === null) return;
  childComponentRef.value.onLyricsChange(lyrics);
}

function onCurrentTimeChange(currentTime: number) {
  if (childComponentRef.value === null) return;
  childComponentRef.value.onCurrentTimeChange(currentTime);
}

function syncAudioElement(audioElement: HTMLAudioElement) {
  if (childComponentRef.value === null) return;
  childComponentRef.value.syncAudioElement(audioElement);
}

const handleFileInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    // if (!e.target) return;
    // console.log(file.name);
    const text = e.target?.result as string;
    if (!text) return;
    if (file.name.endsWith(".ttml")) {
      console.log(ttml.parse(text));
      lyrics = ttml.standardize(ttml.parse(text));
      console.log(lyrics);

      const elrcLyrics = elrc.destandardize(lyrics);
      console.log(elrcLyrics);
      const elrcString = elrc.stringify(elrcLyrics);
      console.log(elrcString);
      // saveAsFile("lyrics.elrc", elrcString);
    } else if (file.name.endsWith(".lrc") || file.name.endsWith(".elrc")) {
      // console.log(elrc.parse(text));
      lyrics = elrc.standardize(elrc.parse(text));
      console.log(lyrics);
      const ttmlLyrics = ttml.destandardize(lyrics);
      console.log(ttmlLyrics);
    } else if (
      file.name.endsWith(".flac") ||
      file.name.endsWith(".mp3") ||
      file.name.endsWith(".m4a") ||
      file.name.endsWith(".webm")
    ) {
      const blob = window.URL || window.webkitURL;
      if (!audio.value || !blob) return;
      const audioElement = audio.value;
      const blobURL = blob.createObjectURL(file);
      audioElement.src = blobURL;
      audioElement.load();
      audioElement.play();
      audioElement.pause();
      // audioElement.onload = () => {
      //   blob.revokeObjectURL(blobURL);
      // };
      /*audioElement.addEventListener("timeupdate", (e: Event) => {
        const el = e.target as HTMLAudioElement;
        const currentTime = el.currentTime;
        // console.log(currentTime);
        onCurrentTimeChange(currentTime);
        syncAudioElement(el);
        });*/
      let interval: ReturnType<typeof setInterval>;
      audioElement.addEventListener("play", (e) => {
        interval = setInterval(
          (e: Event) => {
            const el = e.target as HTMLAudioElement;
            const currentTime = el.currentTime;
            // console.log(currentTime);
            onCurrentTimeChange(currentTime);
            syncAudioElement(el);
          },
          0,
          e,
        );
      });
      audioElement.addEventListener("pause", () => {
        clearInterval(interval);
      });
      audioElement.addEventListener("load", () => {
        clearInterval(interval);
      });
    }
    refresh();
  };
  reader.readAsText(file);
};
</script>

<template>
  <Background style="display: none" />
  <main class="container">
    <audio ref="audio" controls />
    <input
      type="file"
      id="file-input"
      @change="handleFileInput"
      ref="fileInput"
    />
    <LyricsViewer ref="childComponentRef" />
  </main>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}
</style>
