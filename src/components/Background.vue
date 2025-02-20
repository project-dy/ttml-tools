<script setup lang="ts">
import { Application, Assets, Sprite } from "pixi.js";
import { useTemplateRef } from "vue";
// import { ref } from "vue";

// const background = ref(null);

const background = useTemplateRef("background");

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({
    resizeTo: window,
    // width: window.innerWidth,
    // height: window.innerHeight,
  });

  // Then adding the application's canvas to the DOM body.
  // document.body.appendChild(app.canvas);
  background.value?.appendChild(app.canvas);

  // Load the bunny texture.
  const texture = await Assets.load("/public/temp.jpg");

  // Create a new Sprite from an image path
  const albumArt = new Sprite(texture);

  // Add to stage
  app.stage.addChild(albumArt);

  // Center the sprite's anchor point
  albumArt.anchor.set(0.5);

  // Move the sprite to the center of the screen
  albumArt.x = app.screen.width / 2;
  albumArt.y = app.screen.height / 2;
})();
</script>

<template>
  <div
    ref="background"
    style="
      z-index: -9999;
      position: absolute;
      width: 100vw;
      height: 100vh;
      left: 0px;
      top: 0px;
      overflow: hidden;
    "
  ></div>
</template>
