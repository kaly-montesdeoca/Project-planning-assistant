<template>  
    <v-row class="position-absolute top-0 pt-3">    
        <v-card width="550" class="pt-2">
            <template v-slot:text>
                <v-row>
                    <h2>{{ lvlTitle() }}</h2>  
                    <v-spacer></v-spacer>
                    <v-tooltip text="Añadir nivel">
                        <template v-slot:activator="{ props }">
                            <v-btn size="x-small" icon="mdi-plus" class="mx-1" color="success" :disabled="!childExist()" v-bind="props" @click="addLvl"></v-btn> 
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Ir a nivel superior">
                        <template v-slot:activator="{ props }">
                            <v-btn size="x-small" icon="mdi-chevron-double-up" class="mx-1" :disabled="parentExist()" v-bind="props" @click="goToParent"></v-btn>
                        </template>               
                    </v-tooltip>
                    <v-tooltip text="Ir a nivel inferior">
                        <template v-slot:activator="{ props }">
                            <v-btn size="x-small" icon="mdi-chevron-double-down" class="mx-1" :disabled="childExist()" v-bind="props" @click="goToChild"></v-btn>
                        </template>               
                    </v-tooltip>  
                    <v-spacer></v-spacer>
                    <v-divider vertical></v-divider>    
                    <v-spacer></v-spacer>
                    <h2>{{ parentName() }}</h2>  
                    <v-spacer></v-spacer>
                    <v-tooltip text="Ir a siguiente">
                        <template v-slot:activator="{ props }">
                            <v-btn size="x-small" icon="mdi-chevron-double-left" class="mx-1" :disabled="parentExist()" v-bind="props" @click="goToParent"></v-btn>
                        </template>               
                    </v-tooltip>
                    <v-tooltip text="Ir a anterior">
                        <template v-slot:activator="{ props }">
                            <v-btn size="x-small" icon="mdi-chevron-double-right" class="mx-1" :disabled="childExist()" v-bind="props" @click="goToChild"></v-btn>
                        </template>               
                    </v-tooltip> 
                </v-row>            
            </template>        
        </v-card>
    </v-row>
</template>

<script setup lang="ts">  
    import Helper from '../Helper';
    import { useMainStore } from '../store/mainStore';
    import { LevelData, NoteData } from '../store/item.model';

    const store = useMainStore();

    function lvlTitle ()  {
        return 'Nivel actual: ' + store.actualLevel.levelNumber;
    }

    function parentName() {
        const lvl = store.actualLevel.levelNumber;
        if (lvl === 0) {
            return store.actualConfigProject.name;
        } else if (lvl === 1) {
            return store.actualLevel.noteList[0].name;
        }
        return 'NonNe';
    }

    function goToParent () {
        const parentNumber = store.actualLevel.levelNumber -1;
        store.goToLevel(parentNumber);
            console.log("Btn goToParent funcion");
    };
    function goToChild () {
        const childNumber = store.actualLevel.levelNumber +1;
        store.goToLevel(childNumber);
            console.log("Btn goToChild funcion");
    };

    function parentExist() {        
        return (store.actualLevel.levelNumber === 0);
    }

    function childExist() {
        return (store.actualLevel.levelNumber === store.actualProjectLvls.length-1);
    }

    async function addLvl() {     
        //Necesito listado de todos los nodos del nivel actual
        // a cada nodo hay que generarle un hijo

        const nodosActuales = store.actualLevel.noteList;
        const newLevlNumber =  (store.actualConfigProject.totalLevels); 
        let newNodes = [] as NoteData[];
        nodosActuales.forEach(e => {
            const newNote: NoteData = {id:store.getNewNoteId(), parentId: e.id, name:'son of ' + e.name, 
                                        levelNumber: newLevlNumber, annotationList: [], dirImageList: []};
            newNodes.push(newNote);
        });

        let emptyAnn = Helper.generateLvlAnnotationEmty();
        emptyAnn.noteList = newNodes;

        if (await createNecesaryFiles(emptyAnn, newLevlNumber)) {
            store.newLevelCreated(emptyAnn, newLevlNumber+1);
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