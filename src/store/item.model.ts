export interface NoteData {
    id: Number;
    parentId: Number;
    name: string;
    levelNumber: Number;
    annotationList: string[];
    dirImageList: string[];    
}

export interface LevelData {
    levelNumber: Number;
    noteList: NoteData[];
}

export interface Project {
    name: String;
    //projectDir: String;
    createDate: String;
}
