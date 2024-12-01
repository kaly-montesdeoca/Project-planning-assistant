import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
    state: () => ({         
        appName: 'Project Planning Assistant',
        projectsBaseDir: '',
    }),
  })