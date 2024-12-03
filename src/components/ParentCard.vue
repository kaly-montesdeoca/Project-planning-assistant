<template>  
    <v-row class="position-absolute top-0">    
        <v-card width="350" >
            <template v-slot:text>
                <v-row>
                    <h2>{{ lvlTitle() }}</h2>  
                    <v-spacer></v-spacer>
                    <v-btn size="x-small" icon="mdi-plus" class="mx-1" @click="addLvl"></v-btn> 
                    <v-btn size="x-small" icon="mdi-chevron-double-up" class="mx-1" @click="goToParent"></v-btn>
                    <v-btn size="x-small" icon="mdi-chevron-double-down" class="mx-1" @click="goToChild"></v-btn>
                </v-row>            
            </template>        
        </v-card>
    </v-row>
</template>
<script setup lang="ts">  
    import Helper from '../Helper';
    import { useMainStore } from '../store/mainStore';
    import { LevelData, FileStringList, NoteData } from '../store/item.model';

   const store = useMainStore();

   function lvlTitle ()  {
    return 'Nivel actual: ' + store.actualLevel.levelNumber;
   }

   function goToParent () {
            console.log("Btn goToParent funcion");
    };
    function goToChild () {
            console.log("Btn goToChild funcion");
    };

    async function addLvl() {     
        //Necesito listado de todos los nodos del nivel actual
        // a cada nodo hay que generarle un hijo

        const nodosActuales = store.actualLevel.noteList;
        const newLevlNumber =  (store.lastLevel +1); 
        let newNodes = [] as NoteData[];
        nodosActuales.forEach(e => {
            const newNote: NoteData = {id:store.getNewNoteId(), parentId: e.id, name:'son of ' + e.name, 
                                        levelNumber: newLevlNumber, annotationList: [], dirImageList: []};
            newNodes.push(newNote);
        });

        let emptyAnn = Helper.generateLvlAnnotationEmty();
        emptyAnn.noteList = newNodes;
        //const emptyAnnlvl = [Helper.generateAnnotationEmty()];

        if (await createNecesaryFiles(emptyAnn, newLevlNumber)) {
            store.newLevelCreated(emptyAnn, newLevlNumber);
        }
    }

    async function createNecesaryFiles(emptyAnn:LevelData, newLevlNumber:number) {

        emptyAnn.levelNumber = newLevlNumber;
        const directoryName = Helper.GetProyectDirectory(store.actualConfigProject.name);   

        let level = await Helper.createFile(directoryName, 'level' + newLevlNumber +'.json', JSON.stringify(emptyAnn));
        if (!level) {            
            return false;
        }
    
        let annotlvl = await Helper.createFile(directoryName, 'annot' + newLevlNumber +'.json', '');
        if (!annotlvl) {
            return false;
        }
        console.log("Exito!");
        return true;
    }
   
</script>