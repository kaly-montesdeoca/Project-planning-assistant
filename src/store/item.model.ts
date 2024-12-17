

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

export interface DirImg {
    dir: string;
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

export const DBName = "projectsDB.db";

export enum NotifType {
    info = "info",
    success = "success",
    warning = "warning",
    error= "error",
  }