

export interface NoteData {
    id: number;
    parentId: number;
    name: string;    //30 max   
    lvlID:number;
    annotationList: Annotation[];
    dirImageList: string[];    
}

export interface Annotation {
    id: number;
    data: string; 
    note_id: number;
}


export interface LevelData {
    id: number;
    levelNumber: number; 
    noteList: NoteData[];
}

//info en archivo config
export interface Project {
    id:number;
    name: string;    
    totalLevels: number;
    createDate: string;    
}

/*//Para levantar el listado de 'tareas'
export interface FileStringList {
    ownerId: number;
    stringList: string[];
}*/

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
export const DBName = "projectsDB.db";

export enum NotifType {
    info = "info",
    success = "success",
    warning = "warning",
    error= "error",
  }