import { defineStore } from 'pinia';
import Helper from '../Helpers/Helper';
import { LevelData, Project, NoteData, ParentChildIndex, NotifType } from './item.model';
import { useMainStore } from './mainStore';
import SqlHelper from '../Helpers/SqlHelper';

interface State {  
    allLvls: LevelData[];    
    displayedLevel: LevelData;
    displayedParent: NoteData;
    searchNotes: NoteData[];
    notesCount: number;   
    parentSliderIndexArr: ParentChildIndex[][];
    displayedSliderIndexArray: ParentChildIndex[];
    sliderIndex: number;
    displayesParentName: string;
  }

  export const useLevelStore = defineStore('displayed', {
    state: (): State => {
      return {
          allLvls: [] as LevelData[],
          displayedLevel: {} as LevelData,
          displayedParent: {} as NoteData,
          searchNotes: [] as NoteData[],
          notesCount: 0,  
          parentSliderIndexArr: [],
          displayedSliderIndexArray: [],
          sliderIndex: 0,
          displayesParentName: 'INICIO',
      }
    },

    actions: {
      async generateNewLevel() {
        //Generamos todas las notas que va a tener el nuevo nivel
        const newLvlnumber = this.allLvls.length;
        const result = await SqlHelper.insertData(SqlHelper.INSERT_NIVEL_TABLE, [newLvlnumber, useMainStore().actualConfigProject.id]);

        const nodosActuales = this.displayedLevel.noteList;
        let newLvlNotes = [] as NoteData[];
        for (let i=0; i < nodosActuales.length; i++) {
          const resultNote = await SqlHelper.insertData(SqlHelper.INSERT_NOTE_TABLE, [nodosActuales[i].id, 'From: ' + nodosActuales[i].name, result.lastInsertId]);
          const newNote: NoteData = this.generateNote(resultNote.lastInsertId, nodosActuales[i].id, 'From: ' + nodosActuales[i].name, result.lastInsertId);
          newLvlNotes.push(newNote);
        }

        const newLevel:LevelData = {id: result.lastInsertId, levelNumber:newLvlnumber, noteList:newLvlNotes} as LevelData;
        this.allLvls.push(newLevel);

        //this.displayedLevel.levelNumber =+ 1;
        if (newLvlnumber >= 2) {
          this.addNewSliderIndex(this.allLvls[this.allLvls.length-1].noteList, this.allLvls.length-3);
        }
        return true;
      },

      async addNewNote(newNoteName:string) {
        const newID = await this.createChild(this.displayedParent.id, this.displayedLevel.levelNumber, newNoteName);       
        let thisLvl = this.displayedLevel.levelNumber;
        if (thisLvl < this.allLvls.length-1) {
          //Crear la descendencia
          //Primero agregar al sliderIndex
          this.addItemSilderIndex(thisLvl-1, newID);
          thisLvl += 1;
          for (thisLvl; thisLvl < this.allLvls.length; thisLvl++){
            this.createChild(newID, thisLvl, 'From: '+newNoteName);
          }
        }

      },

      addItemSilderIndex(lvlToAdd:number, IDToAdd:number) {
        const lastPos = this.parentSliderIndexArr[lvlToAdd].length-1;
        const indexValue = this.parentSliderIndexArr[lvlToAdd][lastPos].childIndexSup +1;
        this.parentSliderIndexArr[lvlToAdd].push({parentId: IDToAdd, childIndexInf:indexValue, childIndexSup:indexValue-1} as ParentChildIndex)
      },

      async createChild(parentId:number, lvl:number, name:string) {
        let indexOfNewElement;
        //Caso exepcional, Nivel 1 solo tiene un padre :. es mas simple
        if (lvl === 1 ) {
          indexOfNewElement = this.allLvls[1].noteList.length;
        } else {
          //En el resto de casos es necesaro actualizar el 
          //indice del slider, y de paso obtener la posicion
          //de la nueva nota en el arreglo de notas
          indexOfNewElement = this.updateSliderIndex(parentId, this.parentSliderIndexArr[lvl-2]);
        }
        const resultNote = await SqlHelper.insertData(SqlHelper.INSERT_NOTE_TABLE, [parentId, name, this.allLvls[lvl].id]);
        const newID = resultNote.lastInsertId;
        const newNote: NoteData = this.generateNote(newID, parentId, name, this.allLvls[lvl].id);
        this.allLvls[lvl].noteList.splice(indexOfNewElement, 0, newNote);
        return (newID === undefined) ? -1 : newID;
      },



      updateSliderIndex(parentId:number, sliderIndex:ParentChildIndex[]):number {
        //Primero necesito la posicion en el arreglo de IndexSlider
        // de la zona donde se inserta la nota (zona: cada padre tiene una zona, es 
        //donde estan las hijas)
        //sliderIndex es el arreglo de indices correspondiente al nivel de la nota
        const sliderArrayIndex = Helper.SearchIndexByParentId(parentId, sliderIndex);
        //Acomodamos el indice superior
        sliderIndex[sliderArrayIndex].childIndexSup +=1; //la nueva nota
        const indexOfNewElement =  sliderIndex[sliderArrayIndex].childIndexSup; //Ademas va a ser la pos en su propio arreglo

        //Ahora toca acomodar todos los indices a partir de sliderArrayIndex+1
        //los indices anteiores no se tocan
        for (let i = sliderArrayIndex+1; i < sliderIndex.length; i++) {
          sliderIndex[i].childIndexInf +1;
          sliderIndex[i].childIndexSup +1;
        }

        return indexOfNewElement;
      },

      generateNote(id:number | undefined, parentId:number | undefined, name:string, lvlID:number | undefined):NoteData {
        return {
          id: id,
          parentId: parentId,
          name: name,         
          lvlID: lvlID,
          annotationList: [],
          dirImageList: []
        } as NoteData;
      },

      goToLevel(level:number) {
        if (level >= 0 && level <this.allLvls.length) {
          this.displayedLevel = this.allLvls[level]; 
          this.displayedSliderIndexArray = this.parentSliderIndexArr[level-2]; 
          if (level === 0) {
            this.displayedParent =  {} as NoteData;//this.displayedLevel.noteList[0];
          } else {            
            this.displayedParent = this.allLvls[level-1].noteList[0];
          }
          this.updateParentName();
        }
      },

      changeDisplaySliderIndex(newIndex:number):void {
        this.sliderIndex = newIndex;

        if (this.displayedLevel.levelNumber-2 >= 0) {
          const parentId = Helper.binarySearchParentID(newIndex, this.parentSliderIndexArr[this.displayedLevel.levelNumber-2]);
          const parent = this.getNote(this.allLvls[this.displayedLevel.levelNumber-1].noteList, parentId);
          this.displayedParent = parent;
        }
        this.updateParentName();
      },

      updateParentName ():void {
        if (this.displayedLevel.levelNumber === 0) {
          this.displayesParentName = 'INICIO';
        } else if (this.displayedLevel.levelNumber === 1) {
          this.displayesParentName = useMainStore().actualConfigProject.name;
        } else {
          this.displayesParentName = this.displayedParent.name;
        }
      },

      changeNextSliderIndex(index:number, nextParent:number, lvl:number):void {  
        this.sliderIndex = index;
        if (lvl-1 === 0) {
          this.displayedParent = this.allLvls[0].noteList[0];
        } else {         
          this.displayedParent = this.allLvls[lvl-1].noteList[nextParent];
        }     
        this.updateParentName();    
      },

      getBrotherIndexArray(direction:number):number {
        const lvlF = this.displayedLevel.levelNumber -1;
        const idF = this.displayedParent.id;
        const myIndex = this.getIDIndexNotes(this.allLvls[lvlF].noteList, idF);
          
        const maxIndex = this.allLvls[this.displayedLevel.levelNumber-1].noteList.length;
        const result = myIndex + direction; 
       
        if (result === -1) {
          return maxIndex -1;
        } else if (result >= maxIndex) {
          return 0;
        }
        return result;
      },


      getNote(array:NoteData[], id:number):NoteData {
        for (let i = 0; i < array.length; i++){
          if (array[i].id === id) {
            return array[i];
          }
        }
        return {} as NoteData;
      },

      getIDIndexNotes(array:NoteData[], id:number):number {
        for (let i = 0; i < array.length; i++){
          if (array[i].id === id) {
            return i;
          }
        }
        return -1;
      },

      getLevelByID(idLvl:number) {
        for (let i = 0; i < this.allLvls.length; i++){
          if (this.allLvls[i].id === idLvl) {
            return i;
          }
        }
        return -1;
      },

      getSliderIndexByIDandLvl(noteID:number, lvlNumber:number){
        return this.getIDIndexNotes(this.allLvls[lvlNumber].noteList, noteID);
      },

      translateIndex (i:number):void {
        let idx = 0;
        let idxAnterior = 0;
        this.parentSliderIndexArr[i].forEach( e => {
          idxAnterior = e.childIndexInf;
          e.childIndexInf = idx;                           
          idx = idx + idxAnterior;
          e.childIndexSup = idx -1;
        })
      },

      //Carga del arreglo de arreglos de Parent/index
      //Cada nivel tiene un arreglo de 'ParentChildIndex'
      //Exepto nivel 0 y 1.
      generateChildrenIndex(levelsData: LevelData[]):void {
        let lvlCount = levelsData.length -2;
        if ( lvlCount <= 0 ) { return; }
        for (let i = 0; i <lvlCount; i++) {
          /*levelsData[i+2].noteList.forEach( note => {
            this.sumChildConcurrency(i, note.parentId);
          })*/
          this.addNewSliderIndex(levelsData[i+2].noteList, i);
        }
      },

      addNewSliderIndex(noteList:NoteData[], lvl:number) {
        //Si no existe el nivel, lo creamos
        if(!(lvl in this.parentSliderIndexArr)) {
          const emptyLvl: ParentChildIndex[] = [] as ParentChildIndex[];
          this.parentSliderIndexArr.push(emptyLvl);
        }
        noteList.forEach( note => {
          this.sumChildConcurrency(lvl, note.parentId);
        })   
           //Una vez aca, ya estan todas las notas contabilizadas
          //Ahora toca crear el indice 
          this.translateIndex(lvl);    
      },
      
      sumChildConcurrency(level:number, parentId:number) :void {
        let index = this.parentSliderIndexArr[level].findIndex(n => n.parentId === parentId);
           //Sí el parent/index ya existe, solo hay que sumar uno
        if (index >= 0) {
          this.parentSliderIndexArr[level][index].childIndexInf += 1;
        } else {
          //el parent/index no existe, se crea con index 1
          //childIndexInf temporalmente es un contador de ocurrencias
          const newChildCount:ParentChildIndex = {parentId: parentId, childIndexInf : 1, childIndexSup: 0} as ParentChildIndex;
          this.parentSliderIndexArr[level].push(newChildCount);
        }
      },

      loadProject (levelsData: LevelData[]):void {
        this.allLvls = levelsData;
        this.displayedLevel = this.allLvls[0];
        //this.displayedParent = this.displayedLevel.noteList[0];
        this.generateChildrenIndex(levelsData);
      },

      loadSearchNotes(notes: NoteData[]):void {
        this.searchNotes = notes;
      },

      getDisplayedParentName ():string {
        return this.displayedParent.name;
      },

      getSliderIndexByParentID(idParent:number, lvl:number):number {
        for (let i = 0; i < this.parentSliderIndexArr.length; i++){
          if (this.parentSliderIndexArr[lvl-2][i].parentId === idParent) {
            return this.parentSliderIndexArr[lvl-2][i].childIndexInf;
          }
        }
        return 0;
      },

      getParentName (idParent:number):string {
        for (let i = 0; i < this.allLvls.length; i++){
          for (let j = 0; j < this.allLvls[i].noteList.length; j++) {
            if (this.allLvls[i].noteList[j].id === idParent) {
              this.allLvls[i].noteList[j].name;
            }
          }
        }
        return 'ERROR!';
      },

      getParentNameWithLvl (lvl:number, idParent:number):string {
        for (let i=0; i < this.allLvls[lvl].noteList.length; i++){
          if (this.allLvls[lvl].noteList[i].id === idParent) {
            return this.allLvls[lvl].noteList[i].name;
          }
        }
        useMainStore().notify("Error al obtener nombre.", NotifType.error)
        return 'ERROR! (154)';
      },
    },
    getters: {},
  })