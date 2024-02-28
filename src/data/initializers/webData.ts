import { Database } from "better-sqlite3";

export default function init(
    database: Database,
    exists: Boolean
) {

    // users
    database.prepare(`CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY NOT NULL,
        given_name TEXT NOT NULL,
        family_name TEXT NOT NULL,
        picture TEXT NOT NULL,
        access_level INTEGER NOT NULL
    )`).run()

    // sessions
    database.prepare(`CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        google_tokens TEXT NOT NULL,
        expires TEXT NOT NULL,
        FOREIGN KEY (email) REFERENCES users (email) ON DELETE CASCADE
    )`).run()

}