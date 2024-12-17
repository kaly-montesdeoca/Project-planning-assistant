<template>
    <v-container class="bg-green pa-0" fluid no-gutters>
       <v-row no-gutters class="h-screen d-flex">
            <v-col v-if="projecLoaded()">
                <v-row  class="d-flex justify-center bg-green ">
                        <parentCard />
                </v-row>
                <v-row>
                    <v-col>
                        <notes />
                    </v-col>
                </v-row>
            </v-col>
            <v-col v-else>
                <v-row class="h-screen align-center justify-center">
                    <h1>No hay proyecto seleccionado</h1>
                </v-row>           
                <v-row no-gutters>           
                    <h5>V {{version}}</h5> 
                </v-row>  
            </v-col>
        </v-row>
        <v-row class="position-absolute bottom-0 right-0 mb-2 mr-2">
            <action-bar @oMenu="openMenuDialog()" @oNewNote="openNewNoteDialog()" @oSearch="openSearchDialog()"/>
        </v-row> 
        <menu-dialog ref="menuDialog" />
        <new-note-dialog />
        <SearchDialog ref="SearchDialogRef" />                   
        <Updater />   
        <Loader />  
        <NewLevelSelector />        
    </v-container> 
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { getVersion } from '@tauri-apps/api/app';
    import { useMainStore } from './store/mainStore'; 
    import { useLevelStore } from './store/loadedLvl';
    import { useComunicationStore } from './store/comunication';    
    import SqlHelper from './Helpers/SqlHelper';
    import {  Project } from './store/item.model';
    import ActionBar from "./components/ActionBar.vue";
    import MenuDialog from "./components/MenuDialog.vue";
    import ParentCard from './components/ParentCard.vue';
    import NewNoteDialog from './components/NewNoteDialog.vue';
    import Notes from "./components/Notes.vue";   
    import SearchDialog from './components/SearchDialog.vue';
    import Updater from './components/Updater.vue';
    import Loader from './components/Loader.vue';
    import NewLevelSelector from './dialogs/NewLevelSelector.vue';
    //import ClipboardImage from './components/ClipboardImage.vue';

    const lvlStore = useLevelStore();
    const mainStore = useMainStore();
    const comunicationStore = useComunicationStore();
    const menuDialog = ref();
    const SearchDialogRef = ref();
    let version = ref('');
    function openMenuDialog() {
        menuDialog.value.open();
    };

    function openNewNoteDialog() {
        comunicationStore.openNewNoteDialog();
    }

    function openSearchDialog() {
        SearchDialogRef.value.open();
    }

    function projecLoaded() {
        return Object.keys(lvlStore.displayedLevel).length !== 0;
    }

    async function loadProjects() {
        mainStore.showLoader();
        await mainStore.cargarSqlDirectory();
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
        mainStore.hideLoader();
        version.value = await getVersion();
    }
    
    onMounted(() => {
        loadProjects();      
    })

</script>

<style>
::-webkit-scrollbar {
display: none;
}
</style>