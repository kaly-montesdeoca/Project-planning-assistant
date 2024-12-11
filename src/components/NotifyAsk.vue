
<template>
    <v-dialog v-model="dialog" :max-width="options.width" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
      <v-card>
        <v-toolbar dark :color="options.color" dense flat>
          <v-toolbar-title class="white--text">
            {{ title }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text v-show="!!message" class="pa-4">
          {{ message }}
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer />
          <v-btn color="primary darken-1" text @click.native="agree">
            Si
          </v-btn>
          <v-btn color="grey" text @click.native="cancel">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>

export default {
    data: () => ({
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: {
        color: 'principalColor',
        width: 290,
        zIndex: 200,
      },
    }),
    methods: {
      open (title, message, options) {
        this.dialog = true
        this.title = title
        this.message = message
        this.options = Object.assign(this.options, options)
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      agree () {
        this.resolve(true)
        this.dialog = false
      },
      cancel () {
        this.resolve(false)
        this.dialog = false
      },
    },
  }
</script>








<!--<template>
    <v-dialog v-model="isOpenDialog">
        <v-card max-width="320">
            <v-card-text>
                {{txt}}
            </v-card-text>
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn class="mb-2" color="primary" dark @click="response(true)"> Aceptar</v-btn>
                <v-btn class="mb-2" color="primary" dark @click="response(false)"> Cancelar</v-btn>    
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let isOpenDialog = ref(false);
const emit = defineEmits(['oClick']);
defineExpose({ open, });

    let txt = '';
    let resolve:boolean | null = null;
    let reject = null;

    function response (value:boolean) {            
        resolve = value;
        isOpenDialog.value = !isOpenDialog.value;
    };

    function open(msg:string) {
        txt = msg;
        return new Promise((resolve, reject) => {
          resolve = resolve
          reject = reject
        })
        //isOpenDialog.value = !isOpenDialog.value;
    }
</script>-->
