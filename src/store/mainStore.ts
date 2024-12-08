import { defineStore } from 'pinia';
import { LevelData, Project, FileNeedSave, NotifType } from './item.model';
import { useLevelStore } from './loadedLvl';
import Helper from '../Helpers/Helper';
import FilesHelper from '../Helpers/FilesHelper';
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

        saveProjectMetadataArray(metadata: string[]) {
          metadata.forEach(element => {
            this.saveProjectMetadata(element);
          });          
        },

        saveProjectMetadata(metadata: string) {
            const metaProjec = metadata.split(/\r?\n/);      
            const name = this.getDataFromConfigLine(metaProjec[0]);
            const cDate = this.getDataFromConfigLine(metaProjec[1]);
            const totalLvl = parseInt(this.getDataFromConfigLine(metaProjec[2]));
      
            this.projects.push({name: name, createDate: cDate, totalLevels: totalLvl});
        },
        
        deleteProjectMetadata(project:Project) {
          let index = this.projects.findIndex(d => d.name === project.name);
          this.projects.splice(index, 1);
        },

        getDataFromConfigLine(data:String) :string {
          return data.substring(1, data.length-1);          
        },

        /*
        async createNewLevelNecesaryFiles(newLvl:LevelData, newLevlNumber:number) {
          const directoryName = Helper.GetProyectDirectory(this.actualConfigProject.name); 

          let level = await Helper.createFile(directoryName, 'level' + newLevlNumber +'.json', JSON.stringify(newLvl));
          if (!level) {     
              console.error("ERROR! Fallo al crear fichero")       
              return false;
          }

          let annotlvl = await Helper.createFile(directoryName, 'annot' + newLevlNumber +'.json', '');
          if (!annotlvl) {
              console.error("ERROR! Fallo al crear fichero")     
              return false;
          }

          console.log("Exito!");
          return true;
        },
        */
        /*updateConfigFile(newLevlNumber:number) {
          //actualizar config con el nuevo nivel 
          this.actualConfigProject.totalNotes = newLevlNumber;
          FilesHelper.updateConfigFile(this.actualConfigProject);          
        },*/
      },

      getters: {
        
      },
  })