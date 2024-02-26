import { Database } from "better-sqlite3";

export default function init(
    database: Database,
    exists: Boolean
) {

    database.prepare(`CREATE TABLE IF NOT EXISTS users(
        email TEXT PRIMARY KEY NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        access_level TEXT NOT NULL
    )`).run()

}