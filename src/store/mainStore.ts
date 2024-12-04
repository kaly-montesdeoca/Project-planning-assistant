import { defineStore } from 'pinia';
import { LevelData, Project, FileStringList, ParentChildIndexArray, ParentChildIndex } from './item.model';
import Helper from '../Helper';

interface State {
    appName: string;
    ldProjectsBaseDir: string | '';
    actualProjectLvls: LevelData[];
    actualConfigProject: Project;
    actualLevel: LevelData;
    actualNotesCount: number;
    projects: Project[];
    parentSliderIndexArray: ParentChildIndexArray[];
    actualSliderIndex: number;
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
            parentSliderIndexArray: [] as ParentChildIndexArray[], 
            actualSliderIndex: 0, 
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

        //Carga todos los niveles de un proyecto 
        loadLevlProjec(levels: LevelData[]) {    
          this.actualProjectLvls = levels; 
          this.actualLevel = this.actualProjectLvls[0];
          this.loadParentIndex(levels);
        },

        //Aca se carga el arreglo de arreglos de Parent/index
        //Casa nivel tiene un arreglo de 'ParentChildIndex'
        //Esto se usa en la navegacion, tanto de  'ParentCard'
        //como el slider de notas
        loadParentIndex(levels: LevelData[]) {
          //El nivel 0 no se calcula: no tiene padre
          //El nivel 1 tampoco, porque todos son hijos el mismo pradre
          let lvlCount = levels.length;
          if ( lvlCount <= 2 ) {
            return;
          }
          for (let i = 2; i < lvlCount; i++) {
            let indexLevel = i - 2;
            levels[i].noteList.forEach( note => {
              this.summParentConcurrency(indexLevel, note.parentId)
            })
            //Una vez aca, ya estan todas las notas contabilizadas
            //Ahora toca crear el indice
            let idx = 0;
            let idxAnterior = 0;
            this.parentSliderIndexArray[indexLevel].parentChildIndexArr.forEach(e => {
              idxAnterior = e.childIndex;
              e.childIndex = idx;             
              idx = idx + idxAnterior;
            })
          }
        },

        summParentConcurrency(level:number, parentId:number) {
          
          //parentSliderIndex[0] CORRESPONDE AL NIVEL 2
          //const indexLevel = level - 2;
          if (!(level in this.parentSliderIndexArray)) {
            //Si no existe el nivel, lo creamos
            const newLevel:ParentChildIndexArray = {parentChildIndexArr: []} as ParentChildIndexArray ;
            this.parentSliderIndexArray.push(newLevel);            
            //console.log(this.parentSliderIndexArray);
          }
          let index = this.parentSliderIndexArray[level].parentChildIndexArr.findIndex(d => d.parentId === parentId);

          if (index >= 0) {
            //Entonces el parent/index ya existe, solo hay que sumar uno
            this.parentSliderIndexArray[level].parentChildIndexArr[index].childIndex = this.parentSliderIndexArray[level].parentChildIndexArr[index].childIndex+1;
          } else {
            //el parent/index no ya existe, hay que crearlo init con 1           
            const newParenIndex:ParentChildIndex = {parentId: parentId, childIndex : 1} as ParentChildIndex;
            this.parentSliderIndexArray[level].parentChildIndexArr.push(newParenIndex);
          }     
        },

       /* printArray(array:ParentChildIndex[]) {
          let result ='[';
          array.forEach((key, value) => {
              result += key.childIndex+ ': ' + key.parentId + ': ' + value.toString() + ', ';
          })
          result += ']';
          console.log(result);
        },*/

        goToLevel(level:number) {
          if (level >= 0 && level <this.actualProjectLvls.length) {
            this.actualLevel = this.actualProjectLvls[level];            
          }
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