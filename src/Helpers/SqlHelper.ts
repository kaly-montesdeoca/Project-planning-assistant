import Database, { QueryResult } from '@tauri-apps/plugin-sql';
import { DBName, LevelData, Project, NoteData } from '../store/item.model';

export default class SqlHelper {

    static sqliteDirectory ="sqlite:C:/Users/Kaly/AppData/Local/com.ppa.app/ProjectsFiles/";

    static async createNewProject(name:string) {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);

            const result = await db.execute("INSERT into Proyecto (nombre, created_at) VALUES ($1, $2)", [name, new Date()]);
            const result2 = await db.execute(this.INSERT_NIVEL_TABLE, [0, result.lastInsertId]);
            await db.execute(this.INSERT_NOTE_TABLE, [0, name, result2.lastInsertId]);
            db.close();
            return result;
        }catch (e) {
            console.log(e);
            return {lastInsertId:-1} as QueryResult;
        }
        
    }

    static async insertData(query:string, data:any) {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);
            const result = await db.execute(query, data);
            db.close();
            return result;
         }catch (e) {
            console.log(e);
            return {lastInsertId:-1} as QueryResult;
        }
    }

    static async readProyectTable() {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);
            const result:Project[] = await db.select(this.READ_PROYECTO_TABLE);

            db.close();
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    static async readLevelTable(projectId:number) {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);
            const result:LevelData[] = await db.select("SELECT id, numero as levelNumber FROM Nivel WHERE proyecto_id = $1;", [projectId]);

            db.close();
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async readNoteTable(lvlId:number) {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);
            const result:NoteData[] = await db.select("SELECT id, name, parent_id as parentId, level_id as lvlID FROM Note WHERE level_id = $1 order by parent_id;", [lvlId]);

            db.close();
            return result;
        } catch (e) {
            console.log(e);
            return []        
        }
    }

    static async readAnnotationTable(noteId:number) {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);
            const result:string[] = await db.select("SELECT data FROM Annotation WHERE note_id = $1;", [noteId]);

            db.close();
            return result;
        } catch (e) { console.log(e); return [] }
    }

    static async readImgsTable(noteId:number) {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);
            const result:string[] = await db.select("SELECT dir FROM Images WHERE note_id = $1;", [noteId]);

            db.close();
            return result;
        } catch (e) { console.log(e); return [] }
    }

    static async createDBTables() {
        try {
            const db = await Database.load(this.sqliteDirectory + DBName);
            await db.execute(this.CREATE_PROYECTO_TABLE);
            await db.execute(this.CREATE_NIVEL_TABLE);
            await db.execute(this.CREATE_NOTE_TABLE);
            await db.execute(this.CREATE_ANNOTATION_TABLE);
            await db.execute(this.CREATE_IMAGES_TABLE);

           db.close();
        }catch (e) {
            console.log(e);
        }
    }

    static CREATE_PROYECTO_TABLE = 'CREATE TABLE "Proyecto" ( "id"	INTEGER NOT NULL UNIQUE, "nombre" TEXT NOT NULL, "niveles_count"	INTEGER NOT NULL DEFAULT 1, "created_at"	INTEGER, PRIMARY KEY("id" AUTOINCREMENT))';
    static CREATE_NIVEL_TABLE ='CREATE TABLE "Nivel" ("id"	INTEGER NOT NULL UNIQUE, "numero" INTEGER NOT NULL,	"proyecto_id"	INTEGER NOT NULL DEFAULT 0,	PRIMARY KEY("id" AUTOINCREMENT))';
    static CREATE_NOTE_TABLE = 'CREATE TABLE "Note" ("id"	INTEGER NOT NULL UNIQUE, "parent_id"	INTEGER NOT NULL,	"name"	TEXT NOT NULL,	PRIMARY KEY("id" AUTOINCREMENT))';
    static CREATE_ANNOTATION_TABLE = 'CREATE TABLE "Annotation" ("id"	INTEGER NOT NULL UNIQUE,"data"	TEXT,"note_id"	INTEGER NOT NULL);';
    static CREATE_IMAGES_TABLE = 'CREATE TABLE "Images" ("id"	INTEGER NOT NULL UNIQUE,"dir"	TEXT NOT NULL, "note_id"	INTEGER NOT NULL, PRIMARY KEY("id" AUTOINCREMENT));';
    
    static READ_PROYECTO_TABLE = 'SELECT id, nombre as name, niveles_count as totalLevels, created_at as createDate FROM Proyecto';

    static INSERT_NIVEL_TABLE = "INSERT INTO Nivel (numero, proyecto_id) VALUES ($1, $2)";
    static INSERT_NOTE_TABLE = "INSERT INTO Note (parent_id, name, level_id) VALUES ($1, $2, $3)";
}