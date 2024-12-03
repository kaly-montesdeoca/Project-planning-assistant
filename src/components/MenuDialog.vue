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
    import { useMainStore } from '../store/mainStore';
    import { remove, readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
    import { ref } from 'vue';
    import Helper from '../Helper';
    import { Project, NoteData, LevelData } from '../store/item.model';

    defineExpose({
        open,
    });

    const someStore = useMainStore();
    let newProjectName = '';
    let isOpenDialogNew = ref(false);
    let isOpenDialogMenu = ref(false);
    const header = [{title: 'Nombre', sortable: true, key: 'name'}, 
                    {title: 'Fecha creacion', sortable: true, key: 'createDate'}, 
                    {title: ' ', sortable: false, key: 'actions'}];   
    let projects = useMainStore().projects;

    //FUNCIONES

    async function loadProject (project:Project){
        const directoryName = Helper.GetProyectDirectory(project.name);
        const levels: LevelData[] = [];
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
        }
        someStore.loadLevlProjec(levels);
        isOpenDialogMenu.value = false;
        someStore.actualConfigProject = project;        
    }

    async function newProject() {
        console.log("Creando nuevo proyecto"); 
        const directoryName = Helper.GetProyectDirectory(newProjectName);       
        let directory =  await Helper.createDirectory(Helper.baseDirectory, Helper.GetStringWithoutSpaces(newProjectName));
        if (!directory) {
            return;
        }

        const configDir = Helper.GetConfigDir(newProjectName);
        let configFile = await Helper.createFile(directoryName, 'config.txt', '['+ newProjectName +']\r\n['+ new Date() +']\r\n[1]');
        if (!configFile){
            return;
        }

        let emptyAnn = Helper.generateLvlAnnotationEmty();
        let note:NoteData = {id: 0, parentId: 0, name:newProjectName, levelNumber:0, annotationList: [], dirImageList: []};
        emptyAnn.noteList.push(note);
        let annotation = await Helper.createFile(directoryName, 'level0.json', JSON.stringify(emptyAnn));
        if (!annotation) {
            return;
        }
        
        let annotlvl = await Helper.createFile(directoryName, 'annot0.json', '');
        if (!annotlvl) {
            return;
        }

        let imageDirectory = await Helper.createDirectory(directoryName+'/', 'images');
        if (!imageDirectory){
            return;
        }

        //Se crearon todos los ficheros
        console.log("Se creo el proyecto correctamente.");
        updateStore(configDir);
        isOpenDialogNew.value = false;
        newProjectName = '';
    }

    async function updateStore(configDir:string) {
        const configProjectfile = await readTextFile(configDir, {
          baseDir: BaseDirectory.AppLocalData,
        });
        someStore.saveProjectMetadata(configProjectfile);
    }

    async function deleteProject (project:Project){
        
        const directoryName = Helper.GetProyectDirectory(project.name); //Helper.GetStringWithoutSpaces(project.name);      
        await remove(directoryName, { baseDir: BaseDirectory.AppLocalData, recursive: true,});
        let tokenExists = await exists(directoryName, { baseDir: BaseDirectory.AppLocalData });
        if (tokenExists) {
            console.error("ERROR! No se pudo eliminar el proyecto.");
            return false;
        }
        //Actualizar store
        someStore.deleteProjectMetadata(project);
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