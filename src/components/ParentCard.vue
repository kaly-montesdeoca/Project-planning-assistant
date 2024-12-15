<template>  
    <v-row class="position-absolute top-0 mt-3">    
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
    import { useMainStore } from '../store/mainStore';
    import { useLevelStore } from '../store/loadedLvl';
    import { NotifType } from '../store/item.model';

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
        const newLvl = await lvlStore.generateNewLevel();
        if (newLvl) {
            store.notify("Nivel añadido.", NotifType.success);
        } else {
            store.notify("Error al intentar añadir el nivel.", NotifType.error);
        }
    }
</script>