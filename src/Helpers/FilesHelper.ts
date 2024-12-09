import { create, mkdir, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import { NotifType } from "../store/item.model";
import { useMainStore } from '../store/mainStore';

export default class FilesHelper {

    static baseDirectory ="ProjectsFiles/";

    static async createNewProeyctFolder(newProjectName:string) {        
        return await this.createDirectory('', this.getStringWithoutSpaces(newProjectName))
    }

    /*static async createConfigFile(newProjectName:string) {       
        const content = '['+ newProjectName +']\r\n['+ new Date() +']\r\n[1]';
        return await this.createFile(this.getStringWithoutSpaces(newProjectName), 'config.txt', content);
    }*/

    /*static async createNewLevelFiles(newLvl:LevelData) {
        

    }*/

    /*static getConfigProyect(projectName:String) {        
        return this.baseDirectory + this.getStringWithoutSpaces(projectName) + '/config.txt';
    }*/

    /*static updateConfigFile(data:Project) {
        const directoryName = this.getProyectDirectory(data.name);
        const fileData = this.generateConfigString(data);
        this.generateConfigString(data);
        this.createFile(directoryName, 'config.txt', fileData);
    }*/

    static async createFile(directoryName:string, fileName:string, data:string) {
        const completePath = this.baseDirectory + directoryName + '/' + fileName;
        const file = await create(completePath, { baseDir: BaseDirectory.AppLocalData });
        await file.write(new TextEncoder().encode(data));
        await file.close();
        const tokenExists = await exists(completePath, { baseDir: BaseDirectory.AppLocalData });
        if(!tokenExists) {
            useMainStore().notify("Ocurrio un error al intentar crear el archivo: " + fileName + '.', NotifType.error);            
            return false;
        }
        return true;
    }

    //direcoty solo debe ser distinto de '' cuando es una carpeta dentro de la carpeta del proyecto
    static async createDirectory(directory:string, folderName:string) {
        const directoryAux = this.baseDirectory + directory + folderName;
        let tokenExists = await exists(directoryAux, { baseDir: BaseDirectory.AppLocalData });
        if (tokenExists) {            
            useMainStore().notify("Ocurrio un error al intentar crear la carpeta: " + folderName + '.', NotifType.error);  
            return false;
        }
        await mkdir(directoryAux, { baseDir: BaseDirectory.AppLocalData });
        tokenExists = await exists(directoryAux, { baseDir: BaseDirectory.AppLocalData });
        if (!tokenExists) {   
            useMainStore().notify("Ocurrio un error al intentar crear la carpeta: " + folderName + '.', NotifType.error);  
        }
        return true;
    }

    /*static generateConfigString(data:Project):string {        
        let dataFile = '';
        Object.entries(data).forEach(([key, value]) => {
            dataFile += '[' + `${value}` + ']\r\n'                
        });
        return dataFile;
    }*/

    //Utils

    static getProyectDirectory(projectName:String):string {
        return this.baseDirectory + this.getStringWithoutSpaces(projectName);
    }

    static getStringWithoutSpaces(str:String):string {
        const arr = str.split(' ');
        let result = '';
        arr.forEach(element => {
            result += element;
        });
        return result;
    }

   /* static getConfigDir(projectName:String) {        
        return this.baseDirectory + this.getStringWithoutSpaces(projectName) + '/config.txt';
    } */
}