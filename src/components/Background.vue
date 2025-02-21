<script setup lang="ts">
import { Application, Assets, Sprite } from "pixi.js";
import { useTemplateRef } from "vue";
// import { ref } from "vue";

// const background = ref(null);

const background = useTemplateRef("background");

class PIXIBackground {
  private app = new Application();
  // private textureUrl: string;
  private albumArt: Sprite = new Sprite();
  public inited: Boolean = false;
  constructor() {
    //textureUrl: string) {
    // this.textureUrl = textureUrl;
    this.init();
  }
  async init() {
    // await this.app.init({
    //   resizeTo: window,
    // });
    // Intialize the application.
    await this.app.init({
      resizeTo: window,
      // width: window.innerWidth,
      // height: window.innerHeight,
    });

    // Then adding the application's canvas to the DOM body.
    // document.body.appendChild(app.canvas);
    background.value?.appendChild(this.app.canvas);

    // Load the albumart texture.
    // const texture = await Assets.load(this.textureUrl);

    // // Create a new Sprite from an image path
    this.albumArt = new Sprite();
    // this.albumArt.texture = texture;
    // this.albumArt.texture.update();

    // Add to stage
    this.app.stage.addChild(this.albumArt);

    // Center the sprite's anchor point
    this.albumArt.anchor.set(0.5);

    // Move the sprite to the center of the screen
    this.albumArt.x = this.app.screen.width / 2;
    this.albumArt.y = this.app.screen.height / 2;
    this.inited = true;
  }
  public async updateTexture(textureUrl: string): Promise<void> {
    // console.log(bg.inited);
    // if (!bg.inited)
    //   return new Promise(() => setTimeout(this.updateTexture, 100, textureUrl))
    //     .then(() => Promise.resolve(this.inited))
    //     .then(() => this.updateTexture(textureUrl));
    this.albumArt.texture = await Assets.load(textureUrl);
    this.albumArt.texture.update();
    console.log(this.albumArt.texture.source);
    console.log(this.albumArt.texture.source.label.includes(textureUrl));
  }
}
// const bg = new PIXIBackground("/public/temp.jpg");
const bg = new PIXIBackground();
async function updateBackgroundImage(textureURL: string) {
  console.log(bg.inited);
  // await bg.updateTexture(textureURL);
  // console.log("r");
  setTimeout(() => bg.updateTexture(textureURL), 1000);
  console.log("r");
}
updateBackgroundImage("/public/temp1.jpg");
defineExpose({ updateBackground: updateBackgroundImage });
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
