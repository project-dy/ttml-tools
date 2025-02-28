<script setup lang="ts">
import { Upload } from "lucide-vue-next";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { Button } from "@/components/ui/button";

let audio: HTMLAudioElement;
function setAudioElement(audioElement: HTMLAudioElement) {
  audio = audioElement;
}
function toggleAudio() {
  audio.paused ? audio.play() : audio.pause();
}
defineExpose({ setAudioElement });
</script>

<template>
  <main class="grid h-full shrink-0 items-center grid-cols-3 w-full">
    <div class="flex flex-col w-full h-full pl-4 text-sm justify-center">
      <div>
        <a>Song Name</a>
      </div>
      <div class="text-muted-foreground">
        <a>Artist</a>
      </div>
      <div class="text-muted-foreground">
        <a>Album</a>
      </div>
    </div>

    <!-- <Button><Icon icon="material-symbols:play-arrow-rounded"></Icon></Button> -->
    <div class="flex flex-col w-full h-full justify-center items-center">
      <Button variant="ghost" size="icon" :onclick="toggleAudio">
        <Icon icon="material-symbols:play-arrow-rounded" />
      </Button>
    </div>
    <div class="flex flex-col w-full h-full pr-4 justify-center items-end">
      <Upload />
    </div>
  </main>
</template>
