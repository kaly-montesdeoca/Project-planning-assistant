<template>
    <v-dialog v-model="isOpenDialogSearch">
        <v-card flat density="compact">
            <template v-slot:text>
                <v-text-field  v-model="search" label="Search" prepend-inner-icon="mdi-magnify"
                    variant="outlined" hide-details single-line density="compact"></v-text-field>
            </template>
            <v-data-table :headers="header" :search="search" :items="notes" :disable-sort="istrue" @click:row="goToNote"
            style="cursor:pointer" density="compact" hide-default-header hover></v-data-table>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useLevelStore } from '../store/loadedLvl';

    defineExpose({
        open,
    });

    const lvlStore = useLevelStore();
    const search = ref<string>('');
    const header = [{title: 'Name', sortable: false, key: 'name'}];

    let notes = useLevelStore().searchNotes;
    let istrue = true;
    let isOpenDialogSearch = ref(false);

    function open() {
        isOpenDialogSearch.value = !isOpenDialogSearch.value;
        notes = useLevelStore().searchNotes;
    }

    function goToNote(click:PointerEvent, row:any) {
        console.log(click);
       const iOnLevel = (lvlStore.getLevelByID(row.item.lvlID));
       const iOnIndex = (lvlStore.getSliderIndexByIDandLvl(row.item.id, iOnLevel));

       lvlStore.goToLevel(iOnLevel);
        setTimeout(function() {
            lvlStore.changeDisplaySliderIndex(iOnIndex);
        }, 500);
        isOpenDialogSearch.value = false;
    }

</script>
