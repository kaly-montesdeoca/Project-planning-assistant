<template>  
    <v-row class="position-absolute top-0 pt-3">    
        <v-card width="550" class="pt-2">
            <template v-slot:text>
                <v-row>
                    <h2>{{ `Nivel actual: ${lvlStore.displayedLevel.levelNumber}` }}</h2>  
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
                    <h2>{{ lvlStore.displayesParentName }}</h2>  
                    <v-spacer></v-spacer>
                    <v-tooltip text="Ir al anterior">
                        <template v-slot:activator="{ props }">
                            <v-btn size="x-small" icon="mdi-chevron-double-left" class="mx-1" :disabled="brotherExist()" v-bind="props" @click="goToNextBrother(-1)"></v-btn>
                        </template>               
                    </v-tooltip>
                    <v-tooltip text="Ir al siguiente">
                        <template v-slot:activator="{ props }">
                            <v-btn size="x-small" icon="mdi-chevron-double-right" class="mx-1" :disabled="brotherExist()" v-bind="props" @click="goToNextBrother(1)"></v-btn>
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
    import { useLevelStore } from '../store/loadedLvl';
    import { LevelData, NoteData } from '../store/item.model';

    const store = useMainStore();
    const lvlStore = useLevelStore();

    function goToParent () {
        const parentNumber = lvlStore.displayedLevel.levelNumber -1;
        lvlStore.goToLevel(parentNumber);            
    };

    function goToChild () {
        const childNumber = lvlStore.displayedLevel.levelNumber +1;
        lvlStore.goToLevel(childNumber);
    };

    function goToNextBrother(direction:number) {
        const lvl = lvlStore.displayedLevel.levelNumber;        
        const nextBrotherIndex = lvlStore.getBrotherIndexArray(direction);
        lvlStore.changeNextSliderIndex(lvlStore.parentSliderIndexArr[lvl-2][nextBrotherIndex].childIndexInf, nextBrotherIndex, lvl);     
    }

    function brotherExist() {
        if (lvlStore.displayedLevel.levelNumber === 0 || lvlStore.displayedLevel.levelNumber === 1) {
            return true;
        }
        if (lvlStore.allLvls[lvlStore.displayedLevel.levelNumber -1].noteList.length > 1) {
            return false;
        }
    }

    function parentExist() {        
        return (lvlStore.displayedLevel.levelNumber === 0);
    }

    function childExist() {
        return (lvlStore.displayedLevel.levelNumber === lvlStore.allLvls.length-1);
    }

    async function addLvl() {  
        const newLvl =  lvlStore.generateNewLevel();
        if (await store.createNewLevelNecesaryFiles(newLvl, lvlStore.displayedLevel.levelNumber)) {
            
            store.updateConfigFile(lvlStore.displayedLevel.levelNumber+1);
            lvlStore.addNewLevel(newLvl);
        }
        /*//Necesito listado de todos los nodos del nivel actual
        // a cada nodo hay que generarle un hijo

        const nodosActuales = lvlStore.displayedLevel.noteList;
        const newLevlNumber =  (store.actualConfigProject.totalLevels); 
        let newNodes = [] as NoteData[];
        nodosActuales.forEach(e => {
            const newNote: NoteData = {id: lvlStore.getNewNoteID(), parentId: e.id, name:'son of ' + e.name, 
                                         annotationList: [], dirImageList: []};
            newNodes.push(newNote);
        });

        let emptyAnn = Helper.generateLvlAnnotationEmty();
        emptyAnn.noteList = newNodes;

        if (await createNecesaryFiles(emptyAnn, newLevlNumber)) {
            store.newLevelCreated(emptyAnn, newLevlNumber+1);
        }*/
    }

    /*async function createNecesaryFiles(emptyAnn:LevelData, newLevlNumber:number) {

        emptyAnn.levelNumber = newLevlNumber;
        const directoryName = Helper.GetProyectDirectory(store.actualConfigProject.name);   

        let level = await Helper.createFile(directoryName, 'level' + newLevlNumber +'.json', JSON.stringify(emptyAnn));
        if (!level) {     
            console.error("ERROR! Fallo al crear fichero")       
            return false;
        }
    
        let annotlvl = await Helper.createFile(directoryName, 'annot' + newLevlNumber +'.json', '');
        if (!annotlvl) {
            console.error("ERROR! Fallo al crear fichero")     
            return false;
        }
        console.log("Exito!");
        return true;
    }   */
</script>