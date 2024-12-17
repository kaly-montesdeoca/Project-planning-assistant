<template>
    <v-btn @click="toClipboard"> copi :</v-btn>
    <v-btn @click="readData"> read :</v-btn>
    <v-btn @click="readImg"> read I :</v-btn>
    <v-img v-if="show" id="imgSel" :width="150" aspect-ratio="1" class="ma-2" max-height="120" cover :src="url"/>
</template>

<script setup lang="ts">
import { writeText, readText, readImage } from '@tauri-apps/plugin-clipboard-manager';
import { ref } from 'vue';


let blob =  ref();
let show = ref(true);
let url = ref();
async function toClipboard() {
    await writeText('Tauri is awesome!');

}

async function readData() {
    const content = await readText();
    console.log(content);
}
async function readImg() {
    const img = await readImage();
    const data = await img.rgba();
    console.log(data);
    blob.value = new Blob([data.buffer], { type: 'image/png' })
    console.log(data);
    //const content = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 5, 0, 0, 0, 5, 8, 6, 0, 0, 0, 141, 111, 38, 229, 0, 0, 0, 28, 73, 68, 65, 84, 8, 215, 99, 248, 255, 255, 63, 195, 127, 6, 32, 5, 195, 32, 18, 132, 208, 49, 241, 130, 88, 205, 4, 0, 14, 245, 53, 203, 209, 142, 14, 31, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
    url.value = URL.createObjectURL(
        new Blob([blob.value.buffer], { type: 'image/png' } /* (1) */)
    );
console.log(url.value);
    //url.value = URL.createObjectURL(blob.value)

    /*readFile(blob.value, function (e) {
        //console.log(e.target.result)
        str.value = e.target.result
    })*/
}
/*
function readFile (newBlob, onLoadCallback) {
        var reader = new FileReader()
        reader.onload = onLoadCallback
        reader.readAsDataURL(newBlob)       
      }*/
</script>

<!--'data:image;base64,iVBORw0KGgoAAAANSUhEUgAAAFkAAAAcCAYAAAAKnhNwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADI2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5OTZCQjhGQTc2MTYxMUU1QTg0RThGQjE2NDkxNjJEOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5OTZCQjhGOTc2MTYxMUU1QTg0RThGQjE2NDkxNjJEOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NTZBMTI3OTc2OTIxMUUzOTE4OThEOTBCRjhDRTQ3NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NTZBMTI3QTc2OTIxMUUzOTE4OThEOTBCRjhDRTQ3NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlYejCoAAALfSURBVGhD7ZlLSFRRGMf/59xXOvlq1MEihjQEswfUwkDUCkJ6LFq0ijBatIuCHqu2bnptLNr0EkIIkiBMi6BopdsUaVcWhCaVmm+de+/pOzMHY9JJN957FvfHXOZ+3yzu3N9893zfvcMEgYh1hav3iHUkkhwAkeQAiCQHQCQ5ACLJARBJDoBIcgBEkgMgkhwAkeQAiCQHALs1+FIMz46DM6ZSmmDS9xEM869H4I3Og8dM9UGIeAIwOK5eaEEykVDJ1WE3B7tEz7cPKtQIcswLLCy8GcXcqxHwEjudCxVyLFwfJ04dxrWzLSq5OvxK7XFU5JWoUCN8ei14sBvLYCZj8KdS4UuWx6ftRedbDI1+z+TWQHpNvlR7NB1ohTyheR+swIBzsBxMPvV2w3/0zUwOMeuh9d5jlVmdtOR98W20VaYTWkGi/YkUrD1FsHYVw/+9mJEfMszhGOj9iPcD/Srzf5amCy2rWULVK6iMnQNlYPkWxAKtI2HD5a8vcL2tHWv5Y2lJckVeMU4m61SkEXQ+YtKFsT0GZ3+c9jVYmwlmG/g59AMPu3tUJjdZc/K56kOImY6KNIKKV8x5cBpKYSTyIKbd8EXL49PY++B+J8ampzK5HGRJtriB8zXNKtIIWc0zHli5DaepDIIaohQfNszmcOnKutHeoTIrkyVZ0rx5NyoLylWkESTap2XDrtsEq7qQmqAmy4bF8a67F4Nfv6jMcpZJllyuPab2NEM2vQ2cRjpqgrL5pMIvZ0Z3prIZt7Y9UpnlrCi5pmgLmhI1KtIIWc0TizB3FsLaW6JPNdOy8an/M7r6+lQmmxUlSy7uOKLf8wyJl7m1lSMdL7LTDTF00fKqoknu9t0nSLnUlP8hp+RiOx9nqhpVpBHyfKZopEvmw64vzUwa4d8I0g2KgZmRSdx59lxl/pJTsuR0VQPizkYVaQRJFTMunPo4zK0x+DqMdBKD4WlHD4bHfqmEBPgDXRzIe6oTnkEAAAAASUVORK5CYII=' -->