<template>
    <div>
        <NotifyAsk ref="ask"></NotifyAsk> 
        <v-overlay z-index="900" :model-value="loader" scroll-strategy="block" location-strategy="connected" persistent class="align-center justify-center">
            <v-progress-circular :model-value="value" :rotate="360" :size="100" :width="15" color="teal">
                {{ value }} %
            </v-progress-circular>      
        </v-overlay>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import {  NotifType } from '../store/item.model';
    import { useMainStore } from '../store/mainStore'; 
    import { check } from '@tauri-apps/plugin-updater';
    import NotifyAsk from './NotifyAsk.vue';
    import { invoke } from '@tauri-apps/api/core';  

    const mainStore = useMainStore();
    const ask = ref();
    let loader = false;
    let value = 0
    async function checkForAppUpdates() {
        const update = await check();
       
        if (update === null) {
            mainStore.notify("El sistema se encuentra actualizado", NotifType.info);
            return;
        } else if (update?.available) {
            const res = ask.value.open('Atención', 'Actualizacion disponible', { color: 'green', width: 500, zIndex: 200 });

            if(res) {
                let downloaded = 0;                
                let contentLength:number = 0;
                loader = true;
                await update.downloadAndInstall((event) => {
                    switch (event.event) {
                        case 'Started':
                            contentLength = (event.data.contentLength !== undefined) ? event.data.contentLength : 0 ;
                            console.log(`started downloading ${event.data.contentLength} bytes`);
                            break;
                        case 'Progress':
                            downloaded += event.data.chunkLength;
                            value = (downloaded *100) / contentLength;
                            console.log(`downloaded ${downloaded} from ${contentLength}`);
                            break;
                        case 'Finished':
                            console.log('download finished');
                            break;
                    }
                });
                await invoke("graceful_restart");             
            }
        }
    };

    onMounted(() => {
        checkForAppUpdates();
    });

</script>