<template>    
    <flicking :options="{ align: 'prev', circular: true }" @move-end="onMoveEnd">
        <div class="panel">1</div>
        <div class="panel">2</div>
        <div class="panel">3</div>
    </flicking>
</template>

<script lang="ts" setup>
    function onMoveEnd() {
        
    }
</script>