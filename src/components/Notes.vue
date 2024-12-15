<template>  
    <v-row class="mt-16">
        <v-col>    
            <flicking :options="{ align: 'center', circular: true, moveType: 'freeScroll', interruptable: false, duration: 100, preventClickOnDrag: true }" @changed="indexChanged" ref="flickingComp" @moveEnd="stopMooving">            
                <note v-for="(note, n) in displayedLevel.noteList" :note-id="note.id" :note-name="note.name" :annotationList="note.annotationList" :key="n"/>           
            </flicking> 
        </v-col>
    </v-row>
</template>
<script setup lang="ts">  
    import Note from "./Note.vue";
    import { useLevelStore } from '../store/loadedLvl';
    import { storeToRefs } from 'pinia'
    import { ref, watch } from "vue";

    const lvlStore = useLevelStore();

    const { displayedLevel } = storeToRefs(lvlStore)  
    const flickingComp = ref();

    function indexChanged() {
        lvlStore.changeDisplaySliderIndex(flickingComp.value.index);        
    }

    function startMoving() {               
        flickingComp.value.disableInput();
    }

    function stopMooving() {       
        flickingComp.value.enableInput();
    }

    watch(
    () => lvlStore.sliderIndex,
    () => {       
        flickingComp.value.moveTo(lvlStore.sliderIndex);
        startMoving();
    }
)
</script>
<!--
esto es para que se pueda arrastrar y tmb hacer click (cuando es link)
    preventClickOnDrag: true

-->