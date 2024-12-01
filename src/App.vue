<template>  
  <div>
    <notes />
  </div>
  <div class="position-absolute bottom-0 right-0 pb-2">
    <action-bar />
  </div> 
</template>
<script setup lang="ts">

  import ActionBar from "./components/ActionBar.vue";
  import Notes from "./components/Notes.vue";

</script>


<!--<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", { name: name.value });
}
</script>

<template>
  <main class="container">
    <h1>Welcome to Tauri + Vue</h1>

    <div class="row">   
      <p>Click on the Tauri, Vite, and Vue logos to learn more.</p>
    </div>
    
  </main>
</template>-->