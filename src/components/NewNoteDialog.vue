<template>
    <v-dialog v-model="isOpenDialog">
        <v-card class="mx-auto" min-width="150" max-width="320" title="Nueva nota" >
            <template v-slot:text>
                <v-text-field v-model="newNoteName" label="Nombre nota" :rules="[required, maxAndMin]"></v-text-field>
            </template>
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn class="mb-2" color="primary" dark @click="newNote" > Aceptar</v-btn>
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
    let newNoteName = ref('');

    defineExpose({
        open,
    });

    function open() {
        isOpenDialog.value = !isOpenDialog.value;
    }

    function newNote() {       
        if (required(newNoteName.value) && maxAndMin(newNoteName.value)) {
            lvlStore.addNewNote(newNoteName.value);
            cancelNewNote();
        }
    }

    function cancelNewNote() {
        isOpenDialog.value = false;
        newNoteName.value = '';
    }

    function required(v:string) {
        return (!!v || 'Requerido');
    }

    function maxAndMin(v:string) {
        return (v.length >= 3 && v.length <= 30 || 'Entre 3 y 30 caracteres');
    }

</script>