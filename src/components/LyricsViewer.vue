<script setup lang="ts">
import { ref } from "vue";
import { Lyrics } from "../utils/types";

let lyrics: Lyrics | undefined = undefined;
let lyricsString = ref("");
function onLyricsChange(newLyrics?: Lyrics) {
  if (!newLyrics) return;
  lyrics = newLyrics;
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
</template>
