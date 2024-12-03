import { defineStore } from 'pinia';
import { LevelData, Project, FileStringList } from './item.model';
import Helper from '../Helper';

interface State {
    appName: String;
    ldProjectsBaseDir: String | '';
    actualProjectLvls: LevelData[];
    actualConfigProject: Project;
    actualLevel: LevelData;
    actualNotesCount: number;
    projects: Project[];
  }

export const useMainStore = defineStore('main', {
    state: (): State => {
        return {
            appName: 'ProjectPlanningAssistant',
            ldProjectsBaseDir: '',
            actualProjectLvls: [] as LevelData[],
            projects: [] as Project[],
            actualConfigProject: {} as Project,
            actualLevel: {} as LevelData,
            actualNotesCount: 0,
        }
      },      
      actions: {
        newLevelCreated(emptyAnn:LevelData, newLevlNumber:number) {
          //actualizar config con el nuevo nivel
          //generar los hijos de cada nota
          //actualizar ldProyectLevel
          this.actualConfigProject.totalLevels = newLevlNumber;
          Helper.updateConfigFile(this.actualConfigProject);
          this.actualProjectLvls.push(emptyAnn);

        },

        loadLevlProjec(levels: LevelData[]) {   
          this.actualProjectLvls =levels; 
          this.actualLevel = this.actualProjectLvls[0];
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

        getNewNoteId() {
          this.actualNotesCount +=1;
          return this.actualNotesCount;
        },
      },

      getters: {
        lastLevel: (state) => (state.actualProjectLvls.length == 0) ? 0 : state.actualProjectLvls[state.actualProjectLvls.length-1].levelNumber,
      },
  })