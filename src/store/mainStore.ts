import { defineStore } from 'pinia';
import {  Project, FileNeedSave, NotifType } from './item.model';
import { toast, type ToastOptions } from 'vue3-toastify';

interface State {
    appName: string;
    ldProjectsBaseDir: string | '';    
    actualConfigProject: Project;
    projects: Project[];
    filesNeedSave: FileNeedSave[];
  }

export const useMainStore = defineStore('main', {
    state: (): State => {
        return {
            appName: 'ProjectPlanningAssistant',
            ldProjectsBaseDir: '',            
            projects: [] as Project[],
            actualConfigProject: {} as Project,
            filesNeedSave: []as FileNeedSave[],     
        }
      },      
      actions: {       

        notify(msg:string, tipe:NotifType) {
          toast(msg, {
            autoClose: 5500,
            position: toast.POSITION.BOTTOM_RIGHT,
            type: tipe,
          } as ToastOptions);
        },


        saveProjectMetadataArray(proyects:Project[]) {
          this.projects = proyects;
        },       
        
        deleteProjectMetadata(project:Project) {
          let index = this.projects.findIndex(d => d.name === project.name);
          this.projects.splice(index, 1);
        },

        getDataFromConfigLine(data:String) :string {
          return data.substring(1, data.length-1);          
        },       
      },

      getters: {
        
      },
  })