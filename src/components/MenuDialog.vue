<template>    
    <v-dialog v-model="isOpenDialogMenu">
        <div class="bg-white ">
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
                        <v-btn class="mb-2" color="primary" dark @click="NewProject"> Aceptar</v-btn>
                        <v-btn class="mb-2" color="primary" dark @click="CancelNewProject">Cancelar</v-btn>                        
                    </template> 
                </v-card>
            </v-dialog>
        </div>
    </v-dialog>
</template>

<script setup lang="ts">  
    import { useMainStore } from '../store/mainStore';
    import { remove, create, mkdir, readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
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

    function format(date:String) {        
        const date2 = new Date(date.toString());
        return date2.toLocaleDateString();
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

    function loadProject (project:Project){
        
    }

    function open() {
        isOpenDialogMenu.value = !isOpenDialogMenu.value;
    }

    function CancelNewProject() {
        newProjectName = '';
        isOpenDialogNew.value = false;
    }

    function generateAnnotationEmty(name:string) {
        const emptyAnn: NoteData = {  id: 0,
                                    parentId: 0,
                                    name: name,
                                    levelNumber: 0,
                                    annotationList: [],
                                    dirImageList: [] };
        const arrayAnn = [emptyAnn];
        const emptyLevel: LevelData = {
            levelNumber: 0,
            noteList: arrayAnn
        };

        return [emptyLevel];
    }
    async function NewProject() {
        console.log("Creando nuevo proyecto")
        //Crear la carpeta y el archivo config
        
        const directoryName = Helper.GetProyectDirectory(newProjectName);       
        let directory =  await createDirectory(Helper.baseDirectory, Helper.GetStringWithoutSpaces(newProjectName));

        if (directory) {
            const configDir = Helper.GetConfigDir(newProjectName);
            //let configFile = await createConfigFile(configDir);
            let configFile = await createFile(directoryName, 'config.txt', '['+ newProjectName +']\r\n['+ new Date() +']');

            if (configFile) {
                let emptyAnn = generateAnnotationEmty(newProjectName);
                let annotation = await createFile(directoryName, 'annotation.json', JSON.stringify(emptyAnn)); //Aca file
                if (annotation) {
                    let imageDirectory = await createDirectory(directoryName+'/', 'images');
                    if (imageDirectory) {
                        console.log("Se creo el proyecto correctamente.");
                        //Para agregar mas archivos, continuar desde aca 
                        //Este updateStore va siempre al final de todo
                        updateStore(configDir);
                    } 
                }
            } else {
                console.error("Ocurrio un error inesperado");
            }
        }
        isOpenDialogNew.value = false;
        newProjectName = '';
    }

    async function createFile(directoryName:string, fileName:string, data:string) {
        const completePath = directoryName +'/' + fileName;
        const file = await create(completePath, { baseDir: BaseDirectory.AppLocalData });
        await file.write(new TextEncoder().encode(data));
        await file.close();
        const tokenExists = await exists(completePath, { baseDir: BaseDirectory.AppLocalData });
        if(!tokenExists) {
            console.error("ERROR! Ocurrio un error al intentar crear el archivo: " + fileName + '.');
            return false;
        }
        return true;
    }

    async function createDirectory(directory:string, folderName:string) {
        let tokenExists = await exists(directory + folderName, { baseDir: BaseDirectory.AppLocalData });
        if (tokenExists) {
            console.error("ERROR! Ocurrio un error al intentar crear la carpeta:" + folderName + ".");
            return false;
        }
        await mkdir(directory + folderName, { baseDir: BaseDirectory.AppLocalData });
        tokenExists = await exists(directory + folderName, { baseDir: BaseDirectory.AppLocalData });
        if (!tokenExists) {
            console.error("ERROR! Ocurrio un error al intentar crear la carpeta:" + folderName + ".");
        }
        return true;
    }

    async function updateStore(configDir:string) {
        const configProjectfile = await readTextFile(configDir, {
          baseDir: BaseDirectory.AppLocalData,
        });
        someStore.saveProjectMetadata(configProjectfile);
    }
</script>