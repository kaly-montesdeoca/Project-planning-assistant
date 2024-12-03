import { LevelData, FileStringList, Project } from "./store/item.model";
import { create, mkdir, BaseDirectory, exists } from '@tauri-apps/plugin-fs';

export default class Helper {
    
    static baseDirectory ="ProjectsFiles/";

    static GetConfigDir(projectName:String) {        
        return this.baseDirectory + this.GetStringWithoutSpaces(projectName) + '/config.txt';
    }

    static GetProyectDirectory(projectName:String) {
        return this.baseDirectory + this.GetStringWithoutSpaces(projectName);
    }

    static GetStringWithoutSpaces(str:String) {
        const arr = str.split(' ');
        let result = '';
        arr.forEach(element => {
            result += element;
        });
        return result;
    }

    static generateLvlAnnotationEmty() {
        const emptyLevel: LevelData = {
            levelNumber: 0,
            noteList: []
        };

        return emptyLevel;
    }
    
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

    static generateAnnotationEmty() {
        const emptyStringList: FileStringList = {ownerId: 0, stringList: []};
        return emptyStringList;
    }

    static updateConfigFile(data:Project) {
        const directoryName = this.GetProyectDirectory(data.name);
        const fileData = this.generateConfigString(data);
        this.generateConfigString(data);
        this.createFile(directoryName, 'config.txt', fileData);
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
}