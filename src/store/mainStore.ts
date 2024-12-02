import { defineStore } from 'pinia';
import { NoteData, LevelData, Project } from './item.model';

interface State {
    appName: String;
    projectsBaseDir: String | '';
    proyectLevels: LevelData[];
    projects: Project[];
  }

export const useMainStore = defineStore('main', {
    state: (): State => {
        return {
            appName: 'ProjectPlanningAssistant',
            projectsBaseDir: '',
            proyectLevels: [] as LevelData[],
            projects: [] as Project[],
        }
      },
      actions: {
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