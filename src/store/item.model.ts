

export interface NoteData {
    id: number;
    parentId: number;
    name: string;    //30 max
    annotationList: string[];
    dirImageList: string[];    
}

export interface LevelData {
    levelNumber: number;
    fragmented: boolean; //Borrar
    noteList: NoteData[];
}

//info en archivo config
export interface Project {
    name: string;    
    createDate: string;
    totalLevels: number;
}

//Para levantar el listado de 'tareas'
export interface FileStringList {
    ownerId: number;
    stringList: string[];
}

//relacion entre padre e indice del slider
export interface ParentChildIndex {
    parentId: number;
    childIndexInf: number;
    childIndexSup: number;
}

export interface FileNeedSave {
    prefix: string;
    fileNumber: number;
    needSave: boolean;
}
/*export interface ParentChildIndexArray {
    parentChildIndexArr: ParentChildIndex[];
}*/

export const Particionado = 10;

export enum NotifType {
    info = "info",
    success = "success",
    warning = "warning",
    error= "error",
  }