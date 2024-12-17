import { defineStore } from 'pinia';
import { NoteData } from './item.model';

interface State { 
    noteNameDialog: boolean;
    noteName: string;
    isNoteNew: boolean;
    note: NoteData;
    newLevelSelectorDialog: boolean;   
 }

export const useComunicationStore = defineStore('comunication', {
    state: (): State => {
      return {
        noteNameDialog: false,
        noteName: '',
        isNoteNew: true,
        note: {} as NoteData,
        newLevelSelectorDialog: false,
      }
    },

    actions: {
        openEditNoteDialog(note:NoteData) {
            this.noteName = note.name;
            this.isNoteNew = false;
            this.note = note;
            this.noteNameDialog = true;
        },

        openNewNoteDialog() {
            this.resetNoteDialog();
            this.noteNameDialog = true;
        },

        resetNoteDialog() {
            this.noteName = '';
            this.isNoteNew = true;
            this.note = {} as NoteData;
        },

        openLevelSelectorDialog(note:NoteData) {
            this.newLevelSelectorDialog = true;
            this.note = note;
        },
    },

    getters: {},
})

//HAY QUE SACAREL NOTIFY DE MAIN Y PASARLO ACA