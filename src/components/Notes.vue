<template>    
    <note :note-name="msg" :annotationList="arr"/>
</template>
<script setup lang="ts">  

    import Note from "./Note.vue";
  
    const msg = 'Titulo de la tarjeta!'
    const arr = [] as String[];
    arr[0] = "Primer valor de position-static bg-blue rounded-lg pa-3 d-inline \
                position-static bg-blue rounded-lg pa-3 d-inline\
                position-static bg-blue rounded-lg pa-3 d-inline \
                position-static bg-blue rounded-lg pa-3 d-inline";
    arr[1] = "Segundo valor";
    arr[2] = "Tercer valor";
   
</script>