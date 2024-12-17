<template>
    <v-dialog v-model="newLevelSelectorDialog" z-index="100" min-width="400" max-width="1000">
        <v-card>
            <v-card-title>
                <v-row >
                    <v-col>
                        <h4>Nombre</h4>
                    </v-col>
                    <v-col class="d-flex justify-center ">
                        <h4>Nivel actual</h4>
                    </v-col>
                    <v-col class="d-flex justify-center ">
                        <h4>Nivel siguiente</h4>
                    </v-col>
                    <v-col class="d-flex justify-center ">
                        <h4>Padre</h4>
                    </v-col>                    
                </v-row>
            </v-card-title>
            <v-divider />
            <v-card-text>
                <v-row >
                    <v-col>
                        <h5>nuevanotacon30caracteresdelarg</h5>
                    </v-col>
                    <v-col class="d-flex justify-center ">
                        <h5> {{ thisLevel }}</h5>
                    </v-col>
                    <v-col class="d-flex justify-center ">
                        <v-select v-model="levelSelected" variant="underlined" density="compact" hide-details max-width="50" :items="levelsAvailable" />
                    </v-col>
                    <v-col class="d-flex justify-center ">
                        <v-select v-model="parentSelected" variant="underlined" density="compact" hide-details max-width="100" :items="parent" item-title="name" item-value="id"/>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mb-2" color="primary" dark @click="submit" > Aceptar</v-btn>
                <v-btn class="mb-2" color="primary" dark @click="cancel">Cancelar</v-btn>    
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    import { watch, ref } from 'vue';
    import { storeToRefs } from 'pinia'
    import { useComunicationStore } from '../store/comunication';
    import { useLevelStore } from '../store/loadedLvl';
    import { NoteData } from '../store/item.model';

    const lvlStore = useLevelStore()

    const comunicationStore = useComunicationStore();
    const { newLevelSelectorDialog } = storeToRefs(comunicationStore); 
    const levelSelected = ref();
    let levelsAvailable = [] as number[];
    let thisLevel = 0;
    let parent = ref<NoteData[]>([]);
    let parentSelected:number;
    function submit() {}

    function cancel() {
        newLevelSelectorDialog.value = false;
    }

    function loadSelect() {        
        levelsAvailable = [];
        thisLevel = lvlStore.displayedLevel.levelNumber;      
        let lvl = 1;
        for (let i = 1; i < lvlStore.allLvls.length; i++) {
            if (lvl !== thisLevel) {
                levelsAvailable.push(lvl);
            }
            lvl +=1;
        }
    }

    watch(
    () => comunicationStore.newLevelSelectorDialog,
    () => {       
        if (comunicationStore.newLevelSelectorDialog) {
            loadSelect();
        }
    });

    watch(levelSelected, (newX) => {
        //Acomodar 
        //si se sube el padre es uno de los "PADRES"
        //si se baj puede ser una hija nueva de su mismo padre
        parent.value = lvlStore.allLvls[newX].noteList;
    });
</script>