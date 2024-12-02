import { defineStore } from 'pinia';
import { NoteData, LevelData, Project } from './item.model';

interface State {
    appName: String;
    ldProjectsBaseDir: String | '';
    ldProyectLevels: LevelData[];
    projects: Project[];
  }

export const useMainStore = defineStore('main', {
    state: (): State => {
        return {
            appName: 'ProjectPlanningAssistant',
            ldProjectsBaseDir: '',
            ldProyectLevels: [] as LevelData[],
            projects: [] as Project[],
        }
      },      
      actions: {
        loadAnnotationProjec(data: LevelData[]) {   
          this.ldProyectLevels = [];
          data.forEach(element => {
            let newLevel:LevelData = {levelNumber:element.levelNumber, noteList:element.noteList}
            this.ldProyectLevels.push(newLevel);
          });
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
            this.projects.push({name: name, createDate: cDate});
        },
        
        deleteProjectMetadata(project:Project) {
          let index = this.projects.findIndex(d => d.name === project.name);
          this.projects.splice(index, 1);
        },

        getDataFromConfigLine(data:String) :string {
          return data.substring(1, data.length-1);
        },
      },
  })