<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { RouterView } from "vue-router";
// import PlayerBar from "./components/PlayerBar.vue";
import { Upload } from "lucide-vue-next";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { useTemplateRef } from "vue";
import { Lyrics } from "@/utils/types";
import ttml from "@/utils/ttml";
import elrc from "@/utils/elrc";
import { saveAsFile } from "./utils/save";

const audio = useTemplateRef("audio");
const routerViewElement = useTemplateRef("routerView");

function toggleAudio() {
  const audioE = audio.value;
  if (!audioE) return;
  audioE.paused ? audioE.play() : audioE.pause();
}

function onFile() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.addEventListener("change", handleFileInput);
  input.click();
}

let lyrics: Lyrics;
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

      // const elrcLyrics = elrc.destandardize(lyrics);
      // console.log(elrcLyrics);
      // const elrcString = elrc.stringify(elrcLyrics);
      // console.log(elrcString);
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
      console.log(audio);
      if (!audio.value || !blob) return;
      const audioElement = audio.value as HTMLAudioElement;
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
      /*let interval: ReturnType<typeof setInterval>;
      audioElement.addEventListener("play", (e) => {
        interval = setInterval(
          (e: Event) => {
            // const el = e.target as HTMLAudioElement;
            // const currentTime = el.currentTime;
            // console.log(currentTime);
            // onCurrentTimeChange(currentTime);
            // syncAudioElement(el);
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
        });*/
    }
    // refresh();
    if (audio.value) audio.value.setAttribute("lyrics", JSON.stringify(lyrics));
  };
  reader.readAsText(file);
};
defineExpose({ handleFileInput });
</script>

<template>
  <audio ref="audio" class="pl-64" />

  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#"> Home </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Player</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <RouterView
        class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto"
        v-slot="{ Component }"
      >
        <component
          :is="Component"
          ref="routerView"
          :audio="audio"
          :lyrics="lyrics"
        ></component>
      </RouterView>
      <Separator />
      <footer
        class="flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
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
          <div
            class="flex flex-col w-full h-full pr-4 justify-center items-end"
          >
            <Button variant="ghost" size="icon" :onclick="onFile">
              <Upload />
            </Button>
          </div>
        </main>
      </footer>
    </SidebarInset>
  </SidebarProvider>
</template>
