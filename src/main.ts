import { createApp } from "vue";
import "@/assets/index.css";
import App from "./App.vue";

import { newRouter } from "./plugins/router";

createApp(App).use(newRouter()).mount("#app");
