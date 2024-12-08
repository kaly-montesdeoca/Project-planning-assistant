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
            <action-bar @oMenu="openMenuDialog()" @oNewNote="openNewNoteDialog()"/>
            <menu-dialog ref="menuDialog" />
            <new-note-dialog ref="newNOteDialog" />        
            <v-btn @click="dbtest"> db</v-btn>    
        </div> 

    </v-container> 
</template>
<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useMainStore } from './store/mainStore'; 
    import { useLevelStore } from './store/loadedLvl';
    import Helper from './Helpers/Helper';
    import FilesHelper from './Helpers/FilesHelper';
    import { FileNeedSave, NotifType } from './store/item.model';
    import { readDir, readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
    import ActionBar from "./components/ActionBar.vue";
    import MenuDialog from "./components/MenuDialog.vue";
    import ParentCard from './components/ParentCard.vue';
    import NewNoteDialog from './components/NewNoteDialog.vue';
    import Notes from "./components/Notes.vue";  

    import Database from '@tauri-apps/plugin-sql';
    
    
    const lvlStore = useLevelStore();
    const mainStore = useMainStore();
    const menuDialog = ref();
    const newNOteDialog = ref();
    function openMenuDialog() {
        menuDialog.value.open();
    };

    async function dbtest() {
        const db = await Database.load('sqlite:C:/Users/Kaly/AppData/Local/com.ppa.app/ProjectsFiles/Test1/testdb.db');
        
        //const result:TestType[] = await db.select("SELECT ID, Numero FROM Nivel;")// .execute("SELECT ID, Numero FROM Nivel;");
       
        //console.log(result[0].ID);
    }

    function openNewNoteDialog() {
        newNOteDialog.value.open();
    }

    //Levanta los archivos config de c/proyecto
    async function loadData() {
        const entries = await readDir('ProjectsFiles', { baseDir: BaseDirectory.AppLocalData });
        let projectConfig = [];
        for (const element of entries ) {
            const tokenExists = await exists(FilesHelper.getConfigDir(element.name), { baseDir: BaseDirectory.AppLocalData });
            if (tokenExists) {        
                const configProjectfile = await readTextFile(FilesHelper.getConfigDir(element.name), {
                baseDir: BaseDirectory.AppLocalData,
                });
                projectConfig.push(configProjectfile);
            } else {
                mainStore.notify("Falta fichero Config de projecto " + element.name, NotifType.error);            
            }
        }    
        mainStore.saveProjectMetadataArray(projectConfig);        
    }

    function projecLoaded() {
        return Object.keys(lvlStore.displayedLevel).length !== 0;
    }

    //Guardado y guardado automatico
    //La creacion de un nuevo nivel se guarda al momento
    //1 - Crear nota                          -> 
    //2 - Editar nota (add/remove annot )     ->    
    //3 - editar Annotation                   -> 
    function saveProyect() {
        for (let i = 0; i < mainStore.filesNeedSave.length; i++){
            if (mainStore.filesNeedSave[i].needSave) {
                mainStore.filesNeedSave[i].needSave = false;
                saveFile(mainStore.filesNeedSave[i]);
            }
        }
    }

    function saveFile(fileToSave:FileNeedSave) {
        let fileData;
        if (fileToSave.prefix === 'level'){
            fileData = lvlStore.allLvls[fileToSave.fileNumber]
        } else if (fileToSave.prefix === 'annot') {
            //fileData = lvlStore.
        }
    }
    
    onMounted(() => {
        loadData();
    })

</script>