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
import PlayerBar from "./components/PlayerBar.vue";
import { shallowRef, useTemplateRef } from "vue";

const audioElement = useTemplateRef("audio");

const playerBar = useTemplateRef("playerBar");
setInterval(
  () =>
    playerBar.value?.setAudioElement(audioElement.value as HTMLAudioElement),
  0,
);
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
        :audio="{ audioElement }"
      >
      </RouterView>
      <Separator />
      <footer
        class="flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <PlayerBar ref="playerBar" />
      </footer>
    </SidebarInset>
  </SidebarProvider>
</template>
