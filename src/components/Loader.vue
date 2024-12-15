<template>
    
    <v-overlay z-index="900" :model-value="loader" scroll-strategy="block" location-strategy="connected" persistent class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate :size="128" :width="12"/>
    </v-overlay>

</template>
  
<script setup lang="ts">      
    import { useMainStore } from "../store/mainStore";
    import { storeToRefs } from 'pinia'

    const mainStore = useMainStore();
    const { loader } = storeToRefs(mainStore)  
</script>