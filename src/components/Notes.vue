<template> 
<div class="">   
    <v-row class="mt-16">
        <v-col>    
        <flicking :options="{ align: 'center', circular: true, moveType: 'freeScroll' }" @changed="cambioPibe" ref="flickingComp">
            
                <note v-for="(note, n) in displayedLevel.noteList" :note-name="note.name" :annotationList="note.annotationList" :key="n"/>
           
        </flicking> 
        <!--<v-btn @click="scrollFlick">boton</v-btn>-->
        </v-col>
    </v-row>    
</div>
</template>
<script setup lang="ts">  
    import Note from "./Note.vue";
    import { useMainStore } from '../store/mainStore';
    import { useLevelStore } from '../store/loadedLvl';
    import { storeToRefs } from 'pinia'
    import { ref, watch } from "vue";

    const store = useMainStore();
    const lvlStore = useLevelStore();

    const { displayedLevel } = storeToRefs(lvlStore)  
    const flickingComp = ref();


    function cambioPibe() {
        lvlStore.changeDisplaySliderIndex(flickingComp.value.index);        
    }

    watch(
    () => lvlStore.nextSliderIndex,
    () => {
        flickingComp.value.moveTo(lvlStore.nextSliderIndex);
    }
)
</script>
<!--
esto es para que se pueda arrastrar y tmb hacer click (cuando es link)
    preventClickOnDrag: true

-->