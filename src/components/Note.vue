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
        <v-card-text class="text-left">
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
                <v-slide-group class="pa-4" selected-class="bg-success" show-arrows>
                    <v-slide-group-item v-for="(img, n) in props.thisNote.dirImageList" :key="n">                    
                        <v-img :width="162" aspect-ratio="1/1" class="ma-2"
                            :src="img" />
                        <!--<img src="image.jpeg">-->
                    </v-slide-group-item>
                </v-slide-group>
            </v-row>
        </v-card-text>
        <template v-slot:actions>
            <v-row div class="d-flex justify-center">
                <v-tooltip text="Añadir imagen">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-image-plus" class="ml-2" size="small" elevation="4" v-bind="props"/>
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
    </v-card> 
</template>
<script setup lang="ts">
    import { PropType, ref } from 'vue';
    import { useLevelStore } from '../store/loadedLvl';
    import { useComunicationStore } from '../store/comunication';    
    import SqlHelper from '../Helpers/SqlHelper';
    import { Annotation, NoteData } from '../store/item.model';
    import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
    import NotifyAsk from './NotifyAsk.vue';

    const props = defineProps({
        thisNote: {type:Object as PropType <NoteData>, required: true},
    }); 

    const lvlStore = useLevelStore();
    const comunicationStore = useComunicationStore();
    const ask = ref();
    let timeAoutID:number;
    let pendingUpdate: boolean = false;
    let annotationEdited : Annotation;
    async function addNewAnnotation() {
        const result = await SqlHelper.insertData(SqlHelper.INSERT_ANNOTTATION_TABLE, [props.thisNote.id, '']);        
        const id = (result.lastInsertId != undefined) ? result.lastInsertId : -1;
        props.thisNote.annotationList.push({id: id, data:'', note_id:props.thisNote.id} as Annotation);
        
    }

    function focusChange() { 
        if (pendingUpdate) {
            cancelTimeOut();
            updateAnnotation();
        }
    }

    function updateAnnotation () {
        pendingUpdate = false;
        //console.log(annotationEdited);
        //sql--->
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
