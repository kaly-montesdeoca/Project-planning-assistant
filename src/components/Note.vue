<template>
    <v-card variant="outlined" elevation="16" :title="noteName" class="text-center ma-4 bg-white" width="500">
        <v-divider />
        <v-card-text class="text-left">
            <v-row no-gutters>
                <v-col>
                    <PerfectScrollbar :options="{ suppressScrollX: true}" class="px-4">
                        <v-row v-for="(item, i) in annotationList" :key="`sub-group-${i}`" no-gutters>
                            <v-col cols="11" >
                                <v-textarea :model-value="item.data" rows="1" variant="underlined" auto-grow density="compact" flat hide-details @update:modelValue="txtAreaChange($event, item)" @update:focused="focusChange"/>                   
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
                    <v-slide-group-item v-for="(img, n) in dirImageList" :key="n">                    
                        <v-img :width="162" aspect-ratio="1/1" class="ma-2"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" />
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
    </v-card> 
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { useLevelStore } from '../store/loadedLvl';
import SqlHelper from '../Helpers/SqlHelper';
import { Annotation } from '../store/item.model';
 import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
    const props = defineProps({
        noteName: String,
        noteId: {type:Number, required: true},
        annotationList: {type: Object as PropType<Annotation[]>,   default: function () { return [] }, required: true},
        dirImageList: {type: Array,   default: function () { return [] }, required: false},
    });

    const lvlStore = useLevelStore();
    let timeAoutID:number;
    let pendingUpdate: boolean = false;
    let annotationEdited : Annotation;
    async function addNewAnnotation() {
        const result = await SqlHelper.insertData(SqlHelper.INSERT_ANNOTTATION_TABLE, [props.noteId, '']);        
        const id = (result.lastInsertId != undefined) ? result.lastInsertId : -1;
        props.annotationList.push({id: id, data:'', note_id:props.noteId} as Annotation);
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
       const iOnIndex = (iOnLevel === 1) ? 0 : (lvlStore.getSliderIndexByParentID(props.noteId, iOnLevel));

       lvlStore.goToLevel(iOnLevel);
        setTimeout(function() {
            lvlStore.changeDisplaySliderIndex(iOnIndex);
        }, 500);
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
-->