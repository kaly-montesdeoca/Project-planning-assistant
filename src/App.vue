<template>
    <v-container class="bg-green h-screen" fluid >
        <v-row v-if="projecLoaded()" >
            <v-col>
                <v-row  class="d-flex justify-center bg-green">
                    <parentCard />
                </v-row>
                <v-row>
                    <v-col>
                        <notes />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>        
        <v-row v-else class="h-screen d-flex align-center justify-center">  <!--d-flex align-center justify-center-->
            <!--<testSliderGroup ></testSliderGroup>-->
            <h1>No hay proyecto seleccionado</h1>
        </v-row>
        <div class="position-absolute bottom-0 right-0 pb-2">
            <action-bar @oMenu="openMenuDialog()" @oNewNote="openNewNoteDialog()" @oSearch="openSearchDialog()"/>
            <menu-dialog ref="menuDialog" />
            <new-note-dialog ref="newNOteDialog" />
            <SearchDialog ref="SearchDialogRef" />                         
            <NotifyAsk ref="ask" @oClick="respond"></NotifyAsk>  
            <v-btn @Click="preguntar()">a</v-btn>          
        </div> 

    </v-container> 
</template>
<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useMainStore } from './store/mainStore'; 
    import { useLevelStore } from './store/loadedLvl';
    import SqlHelper from './Helpers/SqlHelper';
    import {  NotifType, Project } from './store/item.model';
    import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log';
    import ActionBar from "./components/ActionBar.vue";
    import MenuDialog from "./components/MenuDialog.vue";
    import ParentCard from './components/ParentCard.vue';
    import NewNoteDialog from './components/NewNoteDialog.vue';
    import Notes from "./components/Notes.vue";   
    import SearchDialog from './components/SearchDialog.vue';
    import { check } from '@tauri-apps/plugin-updater';
    const lvlStore = useLevelStore();
    const mainStore = useMainStore();
    const menuDialog = ref();
    const newNOteDialog = ref();
    const SearchDialogRef = ref();
    const ask = ref();

    import NotifyAsk from './components/NotifyAsk.vue';
    import { invoke } from '@tauri-apps/api/core';

    async function preguntar() {
        ask.value.open('Atención', 'Actualizacion disponible', { color: 'green', width: 500, zIndex: 200 }).then((ask:boolean) => {
          if (ask) {
            console.log(ask);
          }
        })
    }    

    function respond(value:boolean) {
        console.log(value);
    }
    async function checkForAppUpdates() {
        const update = await check();
        let accept = false;
        if (update === null) {
            mainStore.notify("Error al buscar actualizacion.", NotifType.error);
            return;
        } else if (update?.available) {
            ask.value.open('Atención', 'Actualizacion disponible', { color: 'green', width: 500, zIndex: 200 }).then((ask:boolean) => {
                if (ask) {
                    accept = true;                    
                }
             })
             await update.downloadAndInstall();
            await invoke("graceful_restart");
        } else {
            mainStore.notify("Sistema actualizado", NotifType.info);
        }
    };
    function openMenuDialog() {
        menuDialog.value.open();
    };

    function openNewNoteDialog() {
        newNOteDialog.value.open();
    }

    function openSearchDialog() {
        SearchDialogRef.value.open();
    }

    function projecLoaded() {
        return Object.keys(lvlStore.displayedLevel).length !== 0;
    }

    async function loadProjects() {
        const projects =  await SqlHelper.readProyectTable();
        const myProjects:Project[] = [];
        projects?.forEach(p => {
            const newProject:Project = {
                id:p.id,
                name: p.name,
                totalLevels: p.totalLevels,
                createDate: p.createDate 
            };
            myProjects.push(newProject);
        })
        if (projects !== undefined) {
            mainStore.saveProjectMetadataArray(myProjects); 
        }
    }
    function forwardConsole(
        fnName: 'log' | 'debug' | 'info' | 'warn' | 'error',
        logger: (message: string) => Promise<void>
        ) {
        const original = console[fnName];
        console[fnName] = (message) => {
            original(message);
            logger(message);
        };
    }
    
    onMounted(() => {
        loadProjects();
        checkForAppUpdates();
       /* forwardConsole('log', trace);
        forwardConsole('debug', debug);
        forwardConsole('info', info);
        forwardConsole('warn', warn);
        forwardConsole('error', error);*/
    })

</script>