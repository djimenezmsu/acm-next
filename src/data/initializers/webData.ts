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
    
    //news
    //[PK][INT] id | [STR] title | [STR] subject | [STR] body | [STR] delay_date | [STR] image_url
    database.prepare(`CREATE TABLE IF NOT EXISTS news(
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        subject TEXT,
        body TEXT NOT NULL,
        post_date TEXT NOT NULL,
        image_url TEXT
    )`).run()

    // event types
    database.prepare(`CREATE TABLE IF NOT EXISTS event_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        points INTEGER NOT NULL
    )`).run()

    // create default types
    if (!exists) {
        database.prepare(`INSERT INTO event_types (name, points) VALUES (?, ?)`).run('Normal', 1)
        database.prepare(`INSERT INTO event_types (name, points) VALUES (?, ?)`).run('Educational', 2)
        database.prepare(`INSERT INTO event_types (name, points) VALUES (?, ?)`).run('Officer', 0)
    }

    // events
    database.prepare(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        type INTEGER NOT NULL,
        access_level INTEGER NOT NULL,
        FOREIGN KEY (type) REFERENCES event_types (id)
    )`).run()

}