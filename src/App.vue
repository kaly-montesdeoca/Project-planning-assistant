<template>  
  <div>
    <notes />
  </div>
  <div class="position-absolute bottom-0 right-0 pb-2">
    <action-bar @oMenu="openMenuDialog()"/>
    <menuDialog ref="menuDialog" />
  </div> 
</template>
<script setup lang="ts">

  import { ref, onMounted } from 'vue'
  import ActionBar from "./components/ActionBar.vue";
  import Notes from "./components/Notes.vue";
  import MenuDialog from "./components/MenuDialog.vue";
  import { readDir, readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
  import { useMainStore } from './store/mainStore'; 
  import Helper from './Helper';
  const someStore = useMainStore();
  const menuDialog = ref();//useTemplateRef("menuDialog");

  function openMenuDialog() {
    menuDialog.value.open();
  };

  async function loadData() {
    const entries = await readDir('ProjectsFiles', { baseDir: BaseDirectory.AppLocalData });
    let projectConfig = [];
    for (const element of entries ) {
      const tokenExists = await exists(Helper.GetConfigDir(element.name), { baseDir: BaseDirectory.AppLocalData });
      if (tokenExists) {        
        const configProjectfile = await readTextFile(Helper.GetConfigDir(element.name), {
          baseDir: BaseDirectory.AppLocalData,
        });
        projectConfig.push(configProjectfile);
      } else {
        console.error("ERROR! Falta fichero Config de projecto " + element.name);
      }
    }    
    someStore.saveProjectMetadataArray(projectConfig);
  }

  onMounted(() => {
    loadData();
  })

</script>