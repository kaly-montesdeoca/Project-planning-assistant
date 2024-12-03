export interface NoteData {
    id: number;
    parentId: number;
    name: string;
    levelNumber: number;
    annotationList: string[];
    dirImageList: string[];    
}

export interface LevelData {
    levelNumber: number;
    noteList: NoteData[];
}

export interface Project {
    name: string;    
    createDate: string;
    totalLevels: number;
}

export interface FileStringList {
    ownerId: number;
    stringList: string[];
}