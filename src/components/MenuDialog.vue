<template>    
    <v-dialog v-model="isOpenDialogMenu" z-index="100" min-width="500" max-width="800">
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
                        <v-text-field v-model="newProjectName" label="Nombre del proyecto" :rules="[required, maxAndMin]"></v-text-field>
                    </template>
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn class="mb-2" color="primary" dark @click="newProject"> Aceptar</v-btn>
                        <v-btn class="mb-2" color="primary" dark @click="CancelNewProject">Cancelar</v-btn>                        
                    </template> 
                </v-card>
            </v-dialog>
        </div>
        <NotifyAsk ref="ask"></NotifyAsk> 
    </v-dialog>
</template>

<script setup lang="ts">  
    import { ref } from 'vue';
    import { useMainStore } from '../store/mainStore';
    import { useLevelStore } from '../store/loadedLvl';
    import FilesHelper from '../Helpers/FilesHelper';
    import { Project, NoteData, LevelData, NotifType, Annotation } from '../store/item.model';
    import SqlHelper from '../Helpers/SqlHelper';
    import NotifyAsk from './NotifyAsk.vue';

    defineExpose({
        open,
    });

    const ask = ref();
    const mainStore = useMainStore();
    const lvlStore = useLevelStore();
    let newProjectName = ref('');
    let isOpenDialogNew = ref(false);
    let isOpenDialogMenu = ref(false);
    const header = [{title: 'Nombre', sortable: true, key: 'name'}, 
                    {title: 'Fecha creacion', sortable: true, key: 'createDate'}, 
                    {title: ' ', sortable: false, key: 'actions'}];  
  

    //FUNCIONES

    async function loadProject (project:Project){
        mainStore.showLoader();
        mainStore.actualConfigProject = project
        const allLvls: LevelData[] = []; 
        let allNotes: NoteData[] = [];
        const levels = await SqlHelper.readLevelTable(project.id);
        if(levels) {
            for(let i= 0; i < levels.length; i++){
                const notes:NoteData[] = await SqlHelper.readNoteTable(levels[i].id);                
                for(let j=0; j < notes.length; j++){
                    const annotations:Annotation[] = await SqlHelper.readAnnotationTable(notes[j].id);
                    const imgs:string[] = await SqlHelper.readImgsTable(notes[j].id);
                    notes[j].annotationList = annotations;                    
                    notes[j].dirImageList = imgs;
                }

                const lvl:LevelData = {id: levels[i].id, levelNumber: levels[i].levelNumber, noteList: notes};                
                allLvls.push(lvl);
                allNotes = allNotes.concat(notes);
            }
        } 
        lvlStore.loadSearchNotes(allNotes);      
        lvlStore.loadProject(allLvls);
        isOpenDialogMenu.value = false;
        mainStore.hideLoader();
    }

    async function newProject() {
        if (required(newProjectName.value) && maxAndMin(newProjectName.value)) {
            console.log("Creando nuevo proyecto"); 
            
            //Primero creamos el directorio del nuevo proyecto
            const directory = await FilesHelper.createNewProeyctFolder(newProjectName.value);
            if (!directory) { return; }
    
            const imageDirectory = await FilesHelper.createDirectory(FilesHelper.getStringWithoutSpaces(newProjectName.value) +'/', 'images');
            if (!imageDirectory){ return; }
            //Se crearon todos los ficheros
            //Crear los registros en la DB
            const result = await SqlHelper.createNewProject(newProjectName.value);
            if (result.lastInsertId === -1) { mainStore.notify("Fallo alta en DB.", NotifType.error);return;}
    
            const lastID = (result.lastInsertId != undefined) ? result.lastInsertId : -1;
            const newPro:Project = {id:lastID, name:newProjectName.value, totalLevels:1, createDate: new Date().toString()};
            mainStore.projects.push(newPro);
    
            console.log("Se creo el proyecto correctamente.");
            mainStore.notify("Se creo el proyecto correctamente.", NotifType.success);
            
            CancelNewProject();
        }
    }

    async function deleteProject (project:Project){
        const result = await ask.value.open('Atención', 'Seguro desea eliminar el proyecto?', { color: 'red', width: 500, zIndex: 200 });
 
        if (result) {
            const res = await SqlHelper.insertData(SqlHelper.DELETE_PROYECTO_TABLE, [project.id]);
            if (res.rowsAffected) {
                //Actualizar store
                mainStore.deleteProjectMetadata(project);
                mainStore.notify("Se elimino", NotifType.info);
            } else {
                mainStore.notify("Ocurrio un error al intentar eliminar el proyacto", NotifType.error);
            }
        } 
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
        newProjectName.value = '';
        isOpenDialogNew.value = false;
    }

    function required(v:string) {
        return (!!v || 'Requerido');
    }

    function maxAndMin(v:string) {
        return (v.length >= 3 && v.length <= 30 || 'Entre 3 y 30 caracteres');
    }
</script>