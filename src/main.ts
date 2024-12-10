import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

const vuetify = createVuetify({
    components,
    directives,
    icons: {},
  })

// End Vuetify

//pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
// end pinia
createApp(App).use(vuetify).use(PerfectScrollbarPlugin).use(pinia).use(
  Vue3Toasity,
  {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions,
).component("Flicking", Flicking).mount("#app");
