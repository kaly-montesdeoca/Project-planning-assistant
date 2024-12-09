<template>    
    <v-dialog v-model="isOpenDialogMenu">
        <div class="bg-white">
            <h2 class="text-center">Proyectos</h2>
            <v-divider />        
            <v-data-table :headers="header" :sort-by="[{ key: 'nombre', order: 'asc' }]" :items="mainStore.projects">
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
    import FilesHelper from '../Helpers/FilesHelper';
    import { Project, NoteData, LevelData, NotifType } from '../store/item.model';
    import SqlHelper from '../Helpers/SqlHelper';


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
  

    //FUNCIONES

    async function loadProject (project:Project){
        mainStore.actualConfigProject = project
        const allLvls: LevelData[] = []; 
        const levels = await SqlHelper.readLevelTable(project.id);
        if(levels) {
            for(let i= 0; i < levels.length; i++){
                const notes:NoteData[] = await SqlHelper.readNoteTable(levels[i].id);                
                for(let j=0; j < notes.length; j++){
                    const annotations:string[] = await SqlHelper.readAnnotationTable(notes[j].id);
                    const imgs:string[] = await SqlHelper.readImgsTable(notes[j].id);
                    notes[j].annotationList = annotations;
                    notes[j].dirImageList = imgs;
                }

                const lvl:LevelData = {id: levels[i].id, levelNumber: levels[i].levelNumber, noteList: notes};                
                allLvls.push(lvl);
            }
        }       
        lvlStore.loadProject(allLvls);
        isOpenDialogMenu.value = false;
    }

    async function newProject() {
        console.log("Creando nuevo proyecto"); 
        
        //Primero creamos el directorio del nuevo proyecto
        const directory = await FilesHelper.createNewProeyctFolder(newProjectName);
        if (!directory) { return; }

        const imageDirectory = await FilesHelper.createDirectory(FilesHelper.getStringWithoutSpaces(newProjectName) +'/', 'images');
        if (!imageDirectory){ return; }
        //Se crearon todos los ficheros
        //Crear los registros en la DB
        const result = await SqlHelper.createNewProject(newProjectName);
        if (result.lastInsertId === -1) { mainStore.notify("Fallo alta en DB.", NotifType.error);return;}

        const lastID = (result.lastInsertId != undefined) ? result.lastInsertId : -1;
        const newPro:Project = {id:lastID, name:newProjectName, totalLevels:1, createDate: new Date().toString()};
        mainStore.projects.push(newPro);

        console.log("Se creo el proyecto correctamente.");
        mainStore.notify("Se creo el proyecto correctamente.", NotifType.success);
        
        isOpenDialogNew.value = false;
        newProjectName = '';
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