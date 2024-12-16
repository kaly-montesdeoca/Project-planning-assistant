import { LevelData, ParentChildIndex, NoteData } from "../store/item.model";

export default class Helper {  

    static binarySearchParentID(value:number, list:ParentChildIndex[]) {
        let first = 0;    //left endpoint 
        let last = list.length - 1;   //right endpoint 
        let result = -1;
        let found = false;
        let middle:number;
        while (found === false && first <= last) {
            middle = Math.floor((first + last)/2);
            if (list[middle].childIndexInf <= value && list[middle].childIndexSup >= value) {
                found = true;
                result = list[middle].parentId;
            } else if (list[middle].childIndexInf > value) {  //if in lower half 
                last = middle - 1;
            } else {  //in in upper half 
                first = middle + 1;
            }
        }
        return result;
    }

    static binarySearchIndexByChildIndex(value:number, list:ParentChildIndex[]) {
        let first = 0;    //left endpoint 
        let last = list.length - 1;   //right endpoint 
        let result = -1;
        let found = false;
        let middle:number;
        while (found === false && first <= last) {
            middle = Math.floor((first + last)/2);
            if (list[middle].childIndexInf <= value && list[middle].childIndexSup >= value) {
                found = true;
                result = middle;
            } else if (list[middle].childIndexInf > value) {  //if in lower half 
                last = middle - 1;
            } else {  //in in upper half 
                first = middle + 1;
            }
        }
        return result;
    }

    static SearchIndexByParentId(value:number, list:ParentChildIndex[]) {
        for (let i = 0; i < list.length; i++){
            if (list[i].parentId === value) {
                return i;
            }
        }
        console.error("ERROR! No encontro ParentId: " + value);
        return 0;
    }

    static getAllChilds(parentId:number, noteList:NoteData[]):NoteData[] {
        let aux = [] as NoteData[];
        for (let i = 0; i < noteList.length; i++) {
            if (noteList[i].parentId === parentId) {
                aux.push(noteList[i]);
            }
        }
        return aux;
    }

    static getIndexNote(id:number, noteList:NoteData[]):number { 
        for (let i = 0; i < noteList.length; i++) {
            if (noteList[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    static SearchLvlNumberByID(id:number, list:LevelData[]) {
        for (let i = 0; i < list.length; i++){
            if (list[i].id === id) {
                return i;
            }
        }
        console.error("ERROR! No encontro ParentId: " + id);
        return 0;
    }

    /*static printArray(array:[]) {
        let result ='[';
        array.forEach((key, value) => {
            result += key + ' :' + value.toString() + ', ';
        })
        result += ']';
    }*/

/*
    //  VER DONDE SE USA
    static generateAnnotationEmty() {
        const emptyStringList: FileStringList = {ownerId: 0, stringList: []};
        return emptyStringList;
    }

    //Vuela??
    static mergeLvlNotesWithAnnotations(level: string, annot: string) {
        const levelObj:LevelData = JSON.parse(level);
        const annotObj:FileStringList[] = (annot != '') ? JSON.parse(annot) : [] as FileStringList[];
        
        levelObj.noteList.forEach( note => {
            let index = annotObj.findIndex(a => a.ownerId === note.id);
            if (index > 0) {
                note.annotationList = annotObj[index].stringList;
            }
        });
        return levelObj;
    }  
*/
    //Files
    /*
    static baseDirectory ="ProjectsFiles/";

    static GetConfigDir(projectName:String) {        
        return this.baseDirectory + this.GetStringWithoutSpaces(projectName) + '/config.txt';
    } 
    
    static updateConfigFile(data:Project) {
        const directoryName = this.GetProyectDirectory(data.name);
        const fileData = this.generateConfigString(data);
        this.generateConfigString(data);
        this.createFile(directoryName, 'config.txt', fileData);
    }

    static GetProyectDirectory(projectName:String) {
        return this.baseDirectory + this.GetStringWithoutSpaces(projectName);
    }

    static generateConfigString(data:Project) {        
        let dataFile = '';
        Object.entries(data).forEach(([key, value]) => {
            dataFile += '[' + `${value}` + ']\r\n'                
        });
        return dataFile;
    }

    static async createFile(directoryName:string, fileName:string, data:string) {
        const completePath = directoryName + '/' + fileName;
        const file = await create(completePath, { baseDir: BaseDirectory.AppLocalData });
        await file.write(new TextEncoder().encode(data));
        await file.close();
        const tokenExists = await exists(completePath, { baseDir: BaseDirectory.AppLocalData });
        if(!tokenExists) {
            console.error("ERROR! Ocurrio un error al intentar crear el archivo: " + fileName + '.');
            return false;
        }
        return true;
    }

    static async createDirectory(directory:string, folderName:string) {
        let tokenExists = await exists(directory + folderName, { baseDir: BaseDirectory.AppLocalData });
        if (tokenExists) {
            console.error("ERROR! Ocurrio un error al intentar crear la carpeta:" + folderName + ".");
            return false;
        }
        await mkdir(directory + folderName, { baseDir: BaseDirectory.AppLocalData });
        tokenExists = await exists(directory + folderName, { baseDir: BaseDirectory.AppLocalData });
        if (!tokenExists) {
            console.error("ERROR! Ocurrio un error al intentar crear la carpeta:" + folderName + ".");
        }
        return true;
    }

    static GetStringWithoutSpaces(str:String) {
        const arr = str.split(' ');
        let result = '';
        arr.forEach(element => {
            result += element;
        });
        return result;
    }
*/
}