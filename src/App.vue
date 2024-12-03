<template>
    <div class="bg-green">
        <v-row v-if="projecLoaded()" class="d-flex justify-center bg-green">
            <parentCard />
            <notes />
        </v-row>
        <v-row v-else class="h-screen d-flex align-center justify-center"> 
            <h1>No hay proyecto seleccionado</h1>
        </v-row>
        <div class="position-absolute bottom-0 right-0 pb-2">
            <action-bar @oMenu="openMenuDialog()"/>
            <menu-dialog ref="menuDialog" />
        </div> 
    </div> 
</template>
<script setup lang="ts">

    import { ref, onMounted } from 'vue'
    import ActionBar from "./components/ActionBar.vue";
    import MenuDialog from "./components/MenuDialog.vue";
    import ParentCard from './components/ParentCard.vue';
    import Notes from './components/Notes.vue';
    import { readDir, readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
    import { useMainStore } from './store/mainStore'; 
    import Helper from './Helper';

    const someStore = useMainStore();
    const menuDialog = ref();

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

    function projecLoaded() {
        return Object.keys(someStore.actualLevel).length !== 0;
    }
    
    onMounted(() => {
        loadData();
    })

</script>