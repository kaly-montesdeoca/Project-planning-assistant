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
}