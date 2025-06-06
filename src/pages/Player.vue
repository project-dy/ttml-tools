<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import ttml from "@/utils/ttml";
import elrc from "@/utils/elrc";
import { Lyrics } from "@/utils/types";
import LyricsViewer from "@/components/LyricsViewer.vue";
// import Background from "@/components/Background.vue";
import { Input } from "@/components/ui/input";
// import { saveAsFile } from "./utils/save";

const props = defineProps<{
  audio: HTMLAudioElement;
  lyrics: Lyrics;
}>();
console.log(props);

let lyrics: Lyrics;

const childComponentRef = ref<InstanceType<typeof LyricsViewer> | null>(null);

// const audio = useTemplateRef("audio");
let audio = props.audio;

function refresh() {
  if (childComponentRef.value === null) {
    console.log(childComponentRef.value);
    return;
  }
  childComponentRef.value.onLyricsChange(lyrics);
}

function onCurrentTimeChange(currentTime: number) {
  if (childComponentRef.value === null) return;
  childComponentRef.value.onCurrentTimeChange(currentTime);
}

let isFirstSync = false;

function syncAudioElement(audioElement: HTMLAudioElement) {
  audio = audioElement;

  if (!isFirstSync && audioElement) {
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
  setLyrics(audioElement);
  if (childComponentRef.value === null) return;
  childComponentRef.value.syncAudioElement(audioElement);
}

function setLyrics(audioElement: HTMLAudioElement) {
  const lr = audioElement.getAttribute("lyrics");
  if (lr && JSON.stringify(lyrics) != lr) {
    const lj = JSON.parse(lr) as Lyrics;
    lyrics = lj;
    refresh();
  }
  // else {
  //   console.log(JSON.stringify(lyrics), lr, JSON.stringify(lyrics) == lr);
  //   // debugger;
  // }
}

syncAudioElement(audio);

setInterval(() => {
  // console.log(audio, audio.getAttribute("lyrics"));
  setLyrics(audio);
}, 100);
// defineExpose({ setLyrics });
</script>

<template>
  <main class="m-0 pt-10">
    <!-- <Input
      type="file"
      id="file-input"
      @change="handleFileInput"
      ref="fileInput"
    /> -->
    <LyricsViewer ref="childComponentRef" />
    <!-- <audio ref="audio" controls /> -->
  </main>
</template>
