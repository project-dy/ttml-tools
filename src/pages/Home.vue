<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import ttml from "@/utils/ttml";
import elrc from "@/utils/elrc";
import { Lyrics } from "@/utils/types";
import LyricsViewer from "@/components/LyricsViewer.vue";
import Background from "@/components/Background.vue";
import { Input } from "@/components/ui/input";
// import { saveAsFile } from "./utils/save";

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
  <main class="m-0 pt-10">
    <Input
      type="file"
      id="file-input"
      @change="handleFileInput"
      ref="fileInput"
    />
    <LyricsViewer ref="childComponentRef" />
    <audio ref="audio" controls />
  </main>
</template>
