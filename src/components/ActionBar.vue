<template>
    <v-tooltip text="Nueva nota">
        <template v-slot:activator="{ props }">        
            <v-btn icon="mdi-plus" class="mx-2" @click="openAddNote" v-bind="props" :disabled="esRaiz()"></v-btn>
        </template>               
    </v-tooltip>

    <v-tooltip text="Buscar nota">
        <template v-slot:activator="{ props }">        
            <v-btn icon="mdi-magnify" class="mx-2" @click="openSearch" v-bind="props" :disabled="esRaiz()"></v-btn>
        </template>               
    </v-tooltip>

    <v-tooltip text="Menu">
        <template v-slot:activator="{ props }">        
            <v-btn icon="mdi-menu" class="mr-2" @click="openMenu" v-bind="props"></v-btn>
        </template>               
    </v-tooltip>
    <!--<v-btn icon="mdi-chevron-double-up" class="mx-2" @click="goToParent"></v-btn>
    <v-btn icon="mdi-chevron-double-down" class="mx-2" @click="goToChild"></v-btn>-->
</template>

<script setup lang="ts">
    import { useLevelStore } from '../store/loadedLvl';

    const lvlStore = useLevelStore();
    const emit = defineEmits(['oMenu', 'oNewNote'])

    function openMenu () {            
        emit('oMenu', '');
    };
    function openSearch () {
            console.log("Btn OpenSearch funcion");
    };
    function openAddNote () {
        emit('oNewNote', '');
    };

    function esRaiz() {
        return lvlStore.allLvls.length === 0 || lvlStore.displayedLevel.levelNumber === 0 ;
    }
</script>

