<template> 
<div class="h-screen">   
    <v-row class="mt-16">
        <v-col>    
        <flicking :options="{ align: 'prev', circular: true, moveType: 'freeScroll' }">
            
                <note v-for="(note, n) in actualLevel.noteList" :note-name="note.name" :annotationList="note.annotationList" :key="n"/>
           
        </flicking> 
        <!--<v-btn @click="btn">boton</v-btn>-->
        </v-col>
    </v-row>    
</div>
</template>
<script setup lang="ts">  
    import Note from "./Note.vue";
    import { useMainStore } from '../store/mainStore';
    import { storeToRefs } from 'pinia'
    import { ref } from "vue";
    const store = useMainStore();
    const { actualLevel } = storeToRefs(store)  
    let isOpenDialogNew = ref(true);
    let booleanvar = true;
    function btn() {
        isOpenDialogNew.value = !isOpenDialogNew.value  ;
    }
</script>