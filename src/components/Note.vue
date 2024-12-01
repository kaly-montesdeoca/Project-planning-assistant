<template>
    <v-card variant="outlined" elevation="16" :title="noteName" class="text-center ma-4 ">
        <v-divider />
        <v-card-text class="text-left">
            <v-row v-for="(item, i) in annotationList" :key="`sub-group-${i}`">
                <v-col cols="8">
                    {{ item }}
                </v-col>
                <v-col cols="4" class="d-flex align-center">
                    <v-row class="d-flex flex-row-reverse">
                        <v-btn icon="mdi-delete" class="ml-2" size="x-small"/>
                        <v-btn icon="mdi-pencil" class="" size="x-small"/>
                    </v-row>
                </v-col>
                <v-divider />
            </v-row>
            <v-row>
                <v-slide-group class="pa-4" selected-class="bg-success" show-arrows>
                    <v-slide-group-item v-for="(img, n) in dirImageList" :key="n">                    
                        <v-img :width="162" aspect-ratio="1/1" class="ma-2"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" />
                        <!--<img src="image.jpeg">-->
                </v-slide-group-item>
                </v-slide-group>
            </v-row>
        </v-card-text>
        <template v-slot:actions>
            <v-row div class="d-flex justify-center">
                <v-tooltip text="Añadir imagen">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-image-plus" class="ml-2" size="small" elevation="4" v-bind="props"/>
                    </template>               
                </v-tooltip>
                <v-tooltip text="Ir a zona de hijos">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-file-replace" class="ml-2" size="small" elevation="4" v-bind="props"/>
                    </template>               
                </v-tooltip>
                <v-tooltip text="Añadir anotación">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-plus" class="ml-2" size="small" elevation="4" v-bind="props"/>
                    </template>               
                </v-tooltip>
            </v-row>
        </template>
    </v-card> 
</template>
<script setup lang="ts"> 
    const props = defineProps({
        noteName: String,
        annotationList: {type: Array,   default: function () { return [] }, required: true},
        dirImageList: {type: Array,   default: function () { return [] }, required: false},
    })
</script>
