<template>    
    <v-dialog v-model="isOpenDialogMenu">
        <div class="bg-white">
            <h2 class="text-center">Proyectos</h2>
            <v-divider />        
            <v-data-table :headers="header" :sort-by="[{ key: 'nombre', order: 'asc' }]" :items="projects">
                <template v-slot:top>
                    <v-toolbar flat >
                        <v-toolbar-title>Nuevo proyecto</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn class="mb-2" color="primary" dark @click="isOpenDialogNew = true">
                            Nuevo
                        </v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.createDate`]="{ item }">
                    <div>
                        {{ format(item.createDate) }}
                    </div>
                </template>
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex flex-row-reverse">
                        <v-icon size="small" @click="loadProject(item)">
                            mdi-upload
                        </v-icon>
                        <v-icon class="mr-2" size="small" @click="deleteProject(item)">
                            mdi-delete
                        </v-icon>
                    </div>
                </template>
            </v-data-table>
            <v-dialog v-model="isOpenDialogNew">                
                <v-card class="mx-auto" max-width="320" title="Nuevo Proyecto" >
                    <template v-slot:text>
                        <v-text-field v-model="newProjectName" messages="Nombre del proyecto" ></v-text-field>
                    </template>
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn class="mb-2" color="primary" dark @click="newProject"> Aceptar</v-btn>
                        <v-btn class="mb-2" color="primary" dark @click="CancelNewProject">Cancelar</v-btn>                        
                    </template> 
                </v-card>
            </v-dialog>
        </div>
    </v-dialog>
</template>

<script setup lang="ts">  
    import { ref } from 'vue';
    import { useMainStore } from '../store/mainStore';
    import { useLevelStore } from '../store/loadedLvl';
    import Helper from '../Helpers/Helper';
    import FilesHelper from '../Helpers/FilesHelper';
    import { Project, NoteData, LevelData, NotifType } from '../store/item.model';
    import { remove, readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';


    defineExpose({
        open,
    });

    const mainStore = useMainStore();
    const lvlStore = useLevelStore();
    let newProjectName = '';
    let isOpenDialogNew = ref(false);
    let isOpenDialogMenu = ref(false);
    const header = [{title: 'Nombre', sortable: true, key: 'name'}, 
                    {title: 'Fecha creacion', sortable: true, key: 'createDate'}, 
                    {title: ' ', sortable: false, key: 'actions'}];   
    let projects = useMainStore().projects;

    //FUNCIONES

    async function loadProject (project:Project){
        /*const directoryName = FilesHelper.getProyectDirectory(project.name);
        const levels: LevelData[] = [];
        let notesCount = 0;
        for (let i = 0; i < project.totalLevels; i++){
            const tokenExists = await exists(directoryName + '/level' + i + '.json', { baseDir: BaseDirectory.AppLocalData });
            const tokenExists2 = await exists(directoryName + '/annot' + i + '.json', { baseDir: BaseDirectory.AppLocalData });
            if (!tokenExists || !tokenExists2) {
                console.error("ERROR! Al cargar el proyecto.");
                return;
            }
            const levlFile = await readTextFile(directoryName + '/level' + i + '.json', { baseDir: BaseDirectory.AppLocalData });
            const annotationFile = await readTextFile(directoryName + '/annot' + i + '.json', { baseDir: BaseDirectory.AppLocalData });

            levels.push(Helper.mergeLvlNotesWithAnnotations(levlFile, annotationFile));
            notesCount += levels[i].noteList.length;
        }
        lvlStore.notesCount = notesCount;
        lvlStore.loadProject(levels);
        isOpenDialogMenu.value = false;
        someStore.actualConfigProject = project; */ 
        //------------------------------------------------------
        const directoryName = FilesHelper.getProyectDirectory(project.name);
        let notesCount = 0;
        const levels: LevelData[] = [];
        
        for (let i = 0; i < project.totalLevels; i++){
            const tokenExists = await exists(directoryName + '/data' + i + '.json', { baseDir: BaseDirectory.AppLocalData });
            if (!tokenExists) { mainStore.notify("Error al cargar el proyecto.", NotifType.error); return; }
            const levlFile = await readTextFile(directoryName + '/data' + i + '.json', { baseDir: BaseDirectory.AppLocalData });
            const levelObj:LevelData = JSON.parse(levlFile);
            if (levelObj.fragmented) {
                const moreNotes = await getPartitions(directoryName + '/data' + i);
                levelObj.noteList.concat(moreNotes);
            }
            notesCount += levelObj.noteList.length;
            levels.push(levelObj);
        }

        lvlStore.notesCount = notesCount;
        lvlStore.loadProject(levels);
        isOpenDialogMenu.value = false;
        mainStore.actualConfigProject = project;
    }

    async function getPartitions(directoryAndPartialName:string) {
        let finish = false;
        let part = 1;
        let notes:NoteData[] = [] as NoteData[];
        while (!finish) {
            const tokenExists = await exists(directoryAndPartialName + 'part' + part +'.json', { baseDir: BaseDirectory.AppLocalData });
            if (tokenExists) {
                const notestxt = await readTextFile(directoryAndPartialName + 'part' + part +'.json', { baseDir: BaseDirectory.AppLocalData });
                notes.push(JSON.parse(notestxt));
            } else {
                finish = false;
            }
        }
        return notes;
    }

    async function newProject() {
        console.log("Creando nuevo proyecto"); 
        
        //Primero creamos el directorio del nuevo proyecto

        /*const directoryName = Helper.GetProyectDirectory(newProjectName);       
        let directory =  await Helper.createDirectory(Helper.baseDirectory, Helper.GetStringWithoutSpaces(newProjectName));
        if (!directory) {
            return;
        }*/
        const directory = await FilesHelper.createNewProeyctFolder(newProjectName);
        if (!directory) { return; }

        /*const configDir = Helper.GetConfigDir(newProjectName);
        let configFile = await Helper.createFile(directoryName, 'config.txt', '['+ newProjectName +']\r\n['+ new Date() +']\r\n[1]');
        if (!configFile){
            return;
        }*/
        const configFile = await FilesHelper.createConfigFile(newProjectName);
        if (!configFile) { return; }

        /*let imageDirectory = await Helper.createDirectory(directoryName+'/', 'images');
        if (!imageDirectory){
            return;
        }*/

        const imageDirectory = await FilesHelper.createDirectory(FilesHelper.getStringWithoutSpaces(newProjectName) +'/', 'images');
        if (!imageDirectory){ return; }

        /*let emptyAnn = Helper.generateLvlAnnotationEmty();
        let note:NoteData = {id: 0, parentId: 0, name:newProjectName, annotationList: [], dirImageList: []};
        emptyAnn.noteList.push(note);
        let annotation = await Helper.createFile(directoryName, 'level0.json', JSON.stringify(emptyAnn));
        if (!annotation) {
            return;
        }*/
        const dataFile = await FilesHelper.createDataFile(newProjectName);
        if (!dataFile){ return; }
        
        /*let annotlvl = await Helper.createFile(directoryName, 'annot0.json', '');
        if (!annotlvl) {
            return;
        }*/

        //Se crearon todos los ficheros
        console.log("Se creo el proyecto correctamente.");
        //updateStore(configDir);
        isOpenDialogNew.value = false;
        newProjectName = '';
    }

    async function updateStore(configDir:string) {
        const configProjectfile = await readTextFile(configDir, {
          baseDir: BaseDirectory.AppLocalData,
        });
        mainStore.saveProjectMetadata(configProjectfile);
    }

    async function deleteProject (project:Project){
        
        /*const directoryName = Helper.GetProyectDirectory(project.name); //Helper.GetStringWithoutSpaces(project.name);      
        await remove(directoryName, { baseDir: BaseDirectory.AppLocalData, recursive: true,});
        let tokenExists = await exists(directoryName, { baseDir: BaseDirectory.AppLocalData });
        if (tokenExists) {
            console.error("ERROR! No se pudo eliminar el proyecto.");
            return false;
        }
        //Actualizar store
        someStore.deleteProjectMetadata(project);*/
    }

    //Formularios
    function open() {
        isOpenDialogMenu.value = !isOpenDialogMenu.value;
    }

    function format(date:String) {        
        const date2 = new Date(date.toString());
        return date2.toLocaleDateString();
    }
    
    function CancelNewProject() {
        newProjectName = '';
        isOpenDialogNew.value = false;
    }
</script>