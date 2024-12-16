<template>
    <v-dialog v-model="noteNameDialog">
        <v-card class="mx-auto" min-width="150" max-width="320" title="Nueva nota" >
            <template v-slot:text>
                <v-text-field v-model="noteName" label="Nombre nota" :rules="[required, maxAndMin]"></v-text-field>
            </template>
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn class="mb-2" color="primary" dark @click="submit" > Aceptar</v-btn>
                <v-btn class="mb-2" color="primary" dark @click="cancelNewNote">Cancelar</v-btn>                        
            </template> 
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>

    import { useLevelStore } from '../store/loadedLvl';
    import { NotifType } from '../store/item.model';
    import { useMainStore } from '../store/mainStore'; 
    import { useComunicationStore } from '../store/comunication';
    import { storeToRefs } from 'pinia'

    const lvlStore = useLevelStore();
    const mainStore = useMainStore();
    const comunicationStore = useComunicationStore();
    const { noteNameDialog, noteName, isNoteNew, note } = storeToRefs(comunicationStore);    

    function submit() {
        if (isNoteNew.value) {
            newNote();
        } else {
            editNote();
        }
    }

    async function editNote() {
        if (required(noteName.value) && maxAndMin(noteName.value)) {
            note.value.name = noteName.value   
            const result = await lvlStore.editNote(noteName.value, note.value.id);
            if (result) {
                mainStore.notify("Nota editada", NotifType.info);
            } else {
                mainStore.notify("Ocurrio un error al editar la nota", NotifType.error);
            }
            cancelNewNote();
        }
    }
    
    function newNote() {       
        if (required(noteName.value) && maxAndMin(noteName.value)) {
            lvlStore.addNewNote(noteName.value);
            cancelNewNote();
        }
    }

    function cancelNewNote() {
        noteNameDialog.value = false;
        noteName.value = '';
    }

    function required(v:string) {
        return (!!v || 'Requerido');
    }

    function maxAndMin(v:string) {
        return (v.length >= 3 && v.length <= 30 || 'Entre 3 y 30 caracteres');
    }

</script>