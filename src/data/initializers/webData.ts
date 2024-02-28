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
    
    //news
    //[PK][INT] id | [STR] title | [STR] subject | [STR] body | [STR] delay_date | [STR] image_url
    database.prepare(`CREATE TABLE IF NOT EXISTS news(
        id INT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        subject TEXT,
        body TEXT NOT NULL,
        post_date TEXT NOT NULL,
        image_url TEXT
    )`).run()

}