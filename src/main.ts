import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

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
createApp(App).use(vuetify).use(pinia).mount("#app");
