<template>
    <v-dialog v-model="isOpenDialog">
        <v-card class="mx-auto" max-width="320" title="Nueva nota" >
            <template v-slot:text>
                <v-text-field v-model="newNoteName" messages="Nombre del proyecto" ></v-text-field>
            </template>
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn class="mb-2" color="primary" dark @click="newNote"> Aceptar</v-btn>
                <v-btn class="mb-2" color="primary" dark @click="cancelNewNote">Cancelar</v-btn>                        
            </template> 
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>

    import { ref } from 'vue';
    import { NoteData } from '../store/item.model';
    import { useMainStore } from '../store/mainStore';
    import { useLevelStore } from '../store/loadedLvl';
    import Helper from '../Helper';

    const store = useMainStore();
    const lvlStore = useLevelStore();
    let isOpenDialog = ref(false);
    let newNoteName = '';

    defineExpose({
        open,
    });

    function open() {
        isOpenDialog.value = !isOpenDialog.value;
    }

    function newNote() {
        /*
        console.log(lvlStore.displayedLevel.levelNumber-2);
        //console.log(store.actualSliderIndex);
        //En el segundo nivel (nivel 1) todos son hijos del padre 1
        let parentId;
        let indexOfNewElement;
        if(lvlStore.displayedLevel.levelNumber === 1) {
            parentId = 1;
            //En la lista de notas de este nivel
            indexOfNewElement = lvlStore.displayedLevel.noteList.length;
        } else {
           // parentId = Helper.binarySearchParentID(store.actualSliderIndex, store.parentSliderIndexArr[lvlStore.displayedLevel.levelNumber-2]);
            //indexOfNewElement =  updateSliderIndex(parentId);
        }

        const newNote:NoteData = { id: lvlStore.getNewNoteID(),
                                    parentId: parentId,
                                    name: newNoteName,                                    
                                    annotationList: [],
                                    dirImageList: []
        }

        //store.newNote(newNote, indexOfNewElement);
        */
        lvlStore.addNewNote(newNoteName);
        cancelNewNote();
    }   
    function updateLowerLevels(parentId:number) {
        //Nivel que esta mas abajo que el actual
        //la comrobacion si existe va despues.
        const lowerLevel = lvlStore.displayedLevel.levelNumber +1;
        //Ultimo nivel
        const lowestLevel = lvlStore.allLvls.length -1;

        for (let i= lowerLevel; i <= lowestLevel; i++) {

        }
    }
/*
    function updateSliderIndex(parentId:number) {
        const sliderArrayIndex = Helper.SearchIndexByParentId(parentId, store.parentSliderIndexArr[lvlStore.displayedLevel.levelNumber-2]);
        store.parentSliderIndexArr[lvlStore.displayedLevel.levelNumber-2][sliderArrayIndex].childIndexSup += 1;
        const indexOfNewElement =  store.parentSliderIndexArr[lvlStore.displayedLevel.levelNumber-2][sliderArrayIndex].childIndexSup;
        for (let i = sliderArrayIndex+1; i < store.parentSliderIndexArr[lvlStore.displayedLevel.levelNumber-2].length; i++){
            store.parentSliderIndexArr[lvlStore.displayedLevel.levelNumber-2][i].childIndexSup += 1;
            store.parentSliderIndexArr[lvlStore.displayedLevel.levelNumber-2][i].childIndexInf += 1;
        }
        return indexOfNewElement;
    }*/

    function cancelNewNote() {
        isOpenDialog.value = false;
        newNoteName = '';
    }
</script>