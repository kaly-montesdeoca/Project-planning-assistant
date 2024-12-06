export interface NoteData {
    id: number;
    parentId: number;
    name: string;    
    annotationList: string[];
    dirImageList: string[];    
}

export interface LevelData {
    levelNumber: number;
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

/*export interface ParentChildIndexArray {
    parentChildIndexArr: ParentChildIndex[];
}*/