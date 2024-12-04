<template>
    <v-dialog v-model="isOpenDialog">
        <v-card class="mx-auto" max-width="320" title="Nueva nota" >
            <template v-slot:text>
                <v-text-field v-model="newNoteName" messages="Nombre del proyecto" ></v-text-field>
            </template>
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn class="mb-2" color="primary" dark @click="newNote"> Aceptar</v-btn>
                <v-btn class="mb-2" color="primary" dark @click="CancelNewNote">Cancelar</v-btn>                        
            </template> 
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>

import { ref } from 'vue';
import { NoteData } from '../store/item.model';
import { useMainStore } from '../store/mainStore';

const store = useMainStore();
let isOpenDialog = ref(false);
let newNoteName = '';

function newNote() {
    const newNote:NoteData = { id: store.getNewNoteId(),
                                parentId: store.actualLevel.levelNumber,
                                name: newNoteName,
                                levelNumber: store.actualLevel.levelNumber,
                                annotationList: [],
                                dirImageList: []
    }

    CancelNewNote();
}

function CancelNewNote() {
    isOpenDialog.value = false;
    newNoteName = '';
}
</script>