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
    import { useLevelStore } from '../store/loadedLvl';

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

        lvlStore.addNewNote(newNoteName);
        cancelNewNote();
    }

    function cancelNewNote() {
        isOpenDialog.value = false;
        newNoteName = '';
    }
</script>