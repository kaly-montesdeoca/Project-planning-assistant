<template>
    <v-btn icon="mdi-menu" class="mr-2" @click="openMenu"></v-btn>
    <v-btn icon="mdi-magnify" class="mx-2" @click="openSearch"></v-btn>
    <v-btn icon="mdi-plus" class="mx-2" @click="openAddNote"></v-btn>
    <v-btn icon="mdi-chevron-double-up" class="mx-2" @click="goToParent"></v-btn>
    <v-btn icon="mdi-chevron-double-down" class="mx-2" @click="goToChild"></v-btn>
</template>

<script setup lang="ts">

    function openMenu () {
            console.log("Btn OpenMenu funcion");
    };
    function openSearch () {
            console.log("Btn OpenSearch funcion");
    };
    function openAddNote () {
            console.log("Btn OpenAddNote funcion");
    };
    function goToParent () {
            console.log("Btn goToParent funcion");
    };
    function goToChild () {
            console.log("Btn goToChild funcion");
    };
</script>