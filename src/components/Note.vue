<template>
    <v-card variant="outlined" elevation="16" class="text-center ma-4 bg-white" width="500">
        <v-card-title>
            <v-hover>
                <template v-slot:default="{ isHovering, props }">
                    <v-row class="d-flex justify-center py-2" v-bind="props" > 
                        <v-sheet class="">{{ thisNote.name }}</v-sheet>
                        <v-sheet class="right-0 position-absolute mr-12 mt-4">
                            <v-speed-dial location="bottom center" transition="scale-transition" >
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-fab :active="(isHovering !== null)? isHovering : false" v-bind="activatorProps" class="ms-4" icon="mdi-cog" location="bottom start" size="x-small" absolute offset @click=""/>
                                </template>
                                <v-btn key="1" @click="changeName">Editar nombre</v-btn>
                                <v-btn key="2" @click="changeParent">Cambiar padre</v-btn>
                                <v-btn key="3" @click="changeIndex">Cambiar indice</v-btn>
                                <v-btn key="4" @click="deleteNote">Eliminar</v-btn>
                            </v-speed-dial>
                        </v-sheet>
                    </v-row>
                </template>
            </v-hover>
        </v-card-title>
        <v-divider />
        <v-card-text class="text-left pb-0">
            <v-row no-gutters>
                <v-col>
                    <PerfectScrollbar :options="{ suppressScrollX: true}" class="px-4">
                        <v-row v-for="item in props.thisNote.annotationList" :key="`sub-group-${item.id}`" no-gutters ref="items">
                            <v-col cols="11" >
                                <v-textarea :model-value="item.data" rows="1" variant="underlined" auto-grow density="compact" flat hide-details @update:modelValue="txtAreaChange($event, item)" @update:focused="focusChange" color="green" 
                                />                   
                            </v-col>
                            <v-col cols="1" class="d-flex align-center">
                                <v-row class="d-flex flex-row-reverse">
                                    <v-btn icon="mdi-delete" class="ml-2" size="x-small"/>                       
                                </v-row>
                            </v-col>
                            <v-divider />
                        </v-row>
                    </PerfectScrollbar>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-slide-group class="pt-2" selected-class="bg-success" show-arrows>
                    <v-slide-group-item v-for="(img, n) in props.thisNote.dirImageList" :key="n">                    
                        <v-img :width="150" aspect-ratio="1" class="ma-2" max-height="120" cover :src="img" @click="openZoom(img)"/>
                    </v-slide-group-item>
                </v-slide-group>
            </v-row>
        </v-card-text>
        <template v-slot:actions>
            <v-row div class="d-flex justify-center">
                <v-tooltip text="Añadir imagen">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-image-plus" class="ml-2" size="small" elevation="4" v-bind="props" @click="addImg"/>
                    </template>               
                </v-tooltip>
                <v-tooltip text="Ir a zona de hijos">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-file-replace" class="ml-2" size="small" elevation="4" v-bind="props" :disabled="childExist()" @click="goToChild"/>
                    </template>               
                </v-tooltip>
                <v-tooltip text="Añadir anotación">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-plus" class="ml-2" size="small" elevation="4" v-bind="props" @click="addNewAnnotation"/>
                    </template>               
                </v-tooltip>
            </v-row>
        </template>
        <NotifyAsk ref="ask"></NotifyAsk>
        <v-dialog v-model="lupa" z-index="300" min-width="400" max-width="1000">
            <v-card>
                <v-img :src="imgTemp"/>
            </v-card>
        </v-dialog>
    </v-card> 
</template>
<script setup lang="ts">
    import { PropType, ref } from 'vue';
    import { convertFileSrc } from '@tauri-apps/api/core';
    import { useLevelStore } from '../store/loadedLvl';
    import { useComunicationStore } from '../store/comunication';        
    import SqlHelper from '../Helpers/SqlHelper';
    import { Annotation, NoteData, NotifType } from '../store/item.model';
    import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
    import NotifyAsk from './NotifyAsk.vue';
    import { copyFile, exists } from '@tauri-apps/plugin-fs';
    import { open } from '@tauri-apps/plugin-dialog';
    import { useMainStore } from '../store/mainStore';

    //const assetUrl = convertFileSrc("C:/Users/Kaly/AppData/Local/com.ppa.app/ProjectsFiles/test.png");
    const props = defineProps({
        thisNote: {type:Object as PropType <NoteData>, required: true},
    }); 

    const lvlStore = useLevelStore();
    const comunicationStore = useComunicationStore();
    const ask = ref();
    let timeAoutID:number;
    let pendingUpdate: boolean = false;
    let annotationEdited : Annotation;
    let lupa = ref(false);
    let imgTemp:string;
    function openZoom(img:string) {
        imgTemp = img;
        lupa.value = true;
    }

    async function addNewAnnotation() {
        const result = await SqlHelper.insertData(SqlHelper.INSERT_ANNOTTATION_TABLE, [props.thisNote.id, '']);        
        const id = (result.lastInsertId != undefined) ? result.lastInsertId : -1;
        props.thisNote.annotationList.push({id: id, data:'', note_id:props.thisNote.id} as Annotation);
        
    }

    async function addImg() {       
        const file = await getFilesPath();
        const countFiles = file.length;

        if (countFiles !== 0) {
            const thisNoteId = props.thisNote.id;
            const proyectDir = await useMainStore().getProyectDirectory() + 'images/';

            for (let i = 0; i < countFiles; i++){                
                const filePath = file[i];
                const index = filePath.lastIndexOf('\\');
                let fileName = filePath.slice(index+1);
                fileName = await checkForDuplicatedName(proyectDir, fileName);
                let saveOnDB = await saveToDir(filePath, proyectDir + fileName); 
                if (saveOnDB) {
                    const result = await SqlHelper.insertData(SqlHelper.INSERT_IMAGES_TABLE, [fileName, thisNoteId]);
                    if (result.rowsAffected) {
                        addToArrayImgs(proyectDir + fileName);
                        useMainStore().notify("Imagen guardada", NotifType.info);   
                    } else {
                        useMainStore().notify("Error al cargar la imagen (DB error)", NotifType.error);
                    }
                } else {
                    useMainStore().notify("Error al cargar la imagen", NotifType.error);
                }
            }
        }       
    }

    function addToArrayImgs(path:string) {
        props.thisNote.dirImageList.push(convertFileSrc(path));        
    }

    async function checkForDuplicatedName(toPath:string , fileName:string):Promise<string> {
        let tokenExists = await exists(toPath+fileName);
        if (!tokenExists) {
            return fileName;
        }
        let index = fileName.lastIndexOf('.');
        let nameWithourExtencion = fileName.slice(0, index);
        let extencion = fileName.slice(index);

        let count = 0;
        while(tokenExists) {
            count +=1;
            tokenExists = await exists(toPath + nameWithourExtencion + '('+ count.toString() + ')' + extencion);
        }
       
        return nameWithourExtencion + '(' + count.toString() + ')' + extencion;
    }

    async function saveToDir(filePath:string, toPath:string): Promise<boolean> {
        try {
            await copyFile(filePath, toPath);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async function getFilesPath():Promise<string[]> {
        const files = await open({
            multiple: true,
            directory: false,
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg']
            }]
        });
        return (files !== null) ? files: [];
    }

    function focusChange() { 
        if (pendingUpdate) {
            cancelTimeOut();
            updateAnnotation();
        }
    }

    function updateAnnotation () {
        pendingUpdate = false;
        SqlHelper.insertData(SqlHelper.UPDATE_ANNOTATION_TABLE, [annotationEdited.data, annotationEdited.id]);
    }

    function txtAreaChange(event:string, data:Annotation) {
        annotationEdited = data;
        annotationEdited.data = event
        pendingUpdate = true;
        cancelTimeOut();
        const saveText = setTimeout(() => {   
            updateAnnotation();
          }, 3000);
        saveTimeOutID(saveText);  
    }

    function saveTimeOutID(saveText:number){
        timeAoutID = saveText;
    }

    function cancelTimeOut() {
        clearTimeout(timeAoutID);
    }

    function childExist() {
        return (lvlStore.displayedLevel.levelNumber === lvlStore.allLvls.length-1);
    }

    function goToChild() {
       const iOnLevel = (lvlStore.displayedLevel.levelNumber +1);
       const iOnIndex = (iOnLevel === 1) ? 0 : (lvlStore.getSliderIndexByParentID(props.thisNote.id, iOnLevel));

       lvlStore.goToLevel(iOnLevel);
        setTimeout(function() {
            lvlStore.changeDisplaySliderIndex(iOnIndex);
        }, 500);
    }

    async function deleteNote() {
        const result = await ask.value.open('Atención', 'Seguro desea eliminar la nota y sus hijas?', { color: 'red', width: 500, zIndex: 200 });
        if (result) {
            lvlStore.deleteNote(props.thisNote);
        }
    }

    function changeName() {
        comunicationStore.openEditNoteDialog(props.thisNote);
    }

    function changeParent() {
        comunicationStore.openLevelSelectorDialog(props.thisNote);
    }

    function changeIndex() {
        
    }
</script>

<style>
@import 'vue3-perfect-scrollbar/style.css';

.ps {
  max-height: 200px; /* or height: 100px; */
}
</style>

<!--
https://github.com/mercs600/vue3-perfect-scrollbar
// const todos = ref<Annotation[]>([]);
-->
