import { randomBytes } from "crypto";
import getDatabase from ".";
import { AccessLevel, Databases, RawUser, User, RawSession, Session, RawNews, News, EventType, Id } from "./types";


// import database
const db = getDatabase(Databases.WEB_DATA)

// ----- USERS -----

/**
 * Converts a raw database User into a User
 * 
 * @param rawUser The raw user to convert.
 * @returns The converted user.
 */
function buildUser(
    rawUser: RawUser
): User {
    return {
        email: rawUser.email,
        givenName: rawUser.given_name,
        familyName: rawUser.family_name,
        picture: rawUser.picture,
        accessLevel: rawUser.access_level
    }
}

/**
 * Synchronously finds the user associated with an email address.
 * 
 * @param email The email address of the user to find.
 * @returns The User associated with the provided email address or null.
 */
function getUserSync(
    email: string
): User | null {

    const rawUser = db.prepare(`
    SELECT email, given_name, family_name, picture, access_level
    FROM users
    WHERE email = ?`).get(email) as RawUser | null

    // Make sure that the user exists
    if (!rawUser) return null

    return buildUser(rawUser)
}

/**
 * Finds the user associated with an email address.
 * 
 * @param email The email address of the user to find.
 * @returns A Promise that resolves with the User associated with the provided email address or null.
 */
export function getUser(
    email: string
): Promise<User | null> {
    return new Promise((resolve, reject) => {
        try {
            resolve(getUserSync(email))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously checks whether the provided user exists.
 * 
 * @param email The email of the user to check the existence of.
 * @returns A boolean determining if the user exists.
 */
function userExistsSync(
    email: string
): boolean {
    return db.prepare(`
    SELECT email
    FROM users
    WHERE email = ?`).get(email) ? true : false
}

/**
 * Checks whether the provided user exists.
 * 
 * @param email The email of the user to check the existence of.
 * @returns A promise that resolves with a boolean determining if the user exists.
 */
export function userExists(
    email: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            resolve(userExistsSync(email))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously inserts the provided user into the database.
 * 
 * @param user The user to insert into the database.
 * @returns The user that was added into the database.
 */
function insertUserSync(
    user: User
): User {
    db.prepare(`
    INSERT INTO users (email, given_name, family_name, picture, access_level)
    VALUES (?, ?, ?, ?, ?)`).run(
        user.email,
        user.givenName,
        user.familyName,
        user.picture,
        user.accessLevel
    )

    return user
}

/**
 * Inserts the provided user into the database.
 * 
 * @param user The user to insert into the database.
 * @returns A Promise that resolves with the user that was added into the database.
 */
export function insertUser(
    user: User
): Promise<User> {
    return new Promise((resolve, reject) => {
        try {
            resolve(insertUserSync(user))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously updates an existing user within the database.
 * 
 * @param user The values within a User to update.
 * @returns The updated User object.
 */
function updateUserSync(
    user: Partial<User> & Pick<User, 'email'>
): User {
    // maps the fields of the session object to their database counterparts
    const fields: Record<string, string> = {
        givenName: 'given_name',
        familyName: 'family_name',
        picture: 'picture',
        accessLevel: 'access_level'
    }

    const sets: string[] = [] // list of strings like '[field] = ?'
    const values: any[] = [] // the values that will replace "?" in the final query

    // iterate the entire session object
    for (const key in user) {
        const value = user[key as keyof typeof user]
        const field = fields[key]
        if (field && value !== undefined) {
            sets.push(`${field} = ?`) // create set value
            // convert value to a type storable in the database, and add it to the values array.
            values.push(value)
        }
    }

    const email = user.email

    // build the SQL query to update the desired values
    if (sets.length > 0) db.prepare(`
            UPDATE users
            SET ${sets.join(', ')}
            WHERE email = ?
            `).run([...values, email])

    return getUserSync(email) as User
}

/**
 * Synchronously updates an existing user within the database.
 * 
 * @param user The values within a User to update.
 * @returns The updated User object.
 */
export function updateUser(
    user: Partial<User> & Pick<User, 'email'>
): Promise<User> {
    return new Promise((resolve, reject) => {
        try {
            resolve(updateUserSync(user))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously deletes an existing user from the database. 
 * 
 * @param email The email of the user to delete.
 */
function deleteUserSync(
    email: string
) {
    db.prepare(`
    DELETE FROM users
    WHERE email = ?`).run(email)
}

/**
 * Deletes an existing user from the database. 
 * 
 * @param email The email of the user to delete.
 * @returns A promise that resolves when the user is deleted.
 */
export function deleteUser(
    email: string
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            resolve(deleteUserSync(email))
        } catch (error) {
            reject(error)
        }
    })
}

// ----- SESSIONS -----

/**
 * Randomly generates a session token.
 * 
 * @param [bytes=36] The number of bytes to generate.
 * @returns A randomly generated session token.
 */
function generateSessionToken(
    bytes: number = 36
): string {
    return randomBytes(bytes).toString('base64')
}

/**
 * Converts a RawSession into a Session.
 * 
 * @param rawSession The RawSession to convert into a Session.
 * @returns The converted Session.
 */
function buildSession(
    rawSession: RawSession
): Session | null {
    const user = getUserSync(rawSession.email)
    return user ? {
        token: rawSession.token,
        user: user,
        googleTokens: JSON.parse(rawSession.google_tokens),
        expires: new Date(rawSession.expires)
    } : null
}

/**
 * Synchronously gets the session associated with the provided token.
 * 
 * @param token The token of the session to get.
 * @returns The found session or null.
 */
function getSessionSync(
    token: string
): Session | null {
    const rawSession = db.prepare(`
    SELECT token, email, google_tokens, expires
    FROM sessions
    WHERE token = ?`).get(token) as RawSession | null

    return rawSession ? buildSession(rawSession) : null
}

/**
 * Gets the session associated with the provided token.
 * 
 * @param token The token of the session to get.
 * @returns A promise that resolves with the found session or null.
 */
export function getSession(
    token: string
): Promise<Session | null> {
    return new Promise((resolve, reject) => {
        try {
            resolve(getSessionSync(token))
        } catch (error) {
            reject(error)
        }
    })
}

/*
 * Synchronously inserts a new session into the database.
 * 
 * @param session A session with everything except its token.
 * @returns The inserted session with its token.
 */
function insertSessionSync(
    session: Omit<Session, 'token'>
): Session {
    const token = generateSessionToken()

    // insert values
    db.prepare(`
    INSERT INTO sessions (token, email, google_tokens, expires)
    VALUES (?, ?, ?, ?)
    `).run(
        token,
        session.user.email,
        JSON.stringify(session.googleTokens),
        session.expires.toISOString()
    )

    const sessionWithToken = session as Session
    sessionWithToken.token = token
    return sessionWithToken
}

/**
 * Inserts a new session into the database.
 * 
 * @param session A session with everything except its token.
 * @returns A promise that resolves with the inserted session with its token.
 */
export function insertSession(
    session: Omit<Session, 'token'>
): Promise<Session> {
    return new Promise((resolve, reject) => {
        try {
            resolve(insertSessionSync(session))
        } catch (error) {
            reject(error)
        }
    })
}

/*
 * Synchronously updates a session.
 * 
 * @param session The values within session to update.
 * @returns The updated session.
 */
function updateSessionSync(
    session: Partial<Session> & Pick<Session, 'token'>
): Session {
    // maps the fields of the session object to their database counterparts
    const fields: Record<string, string> = {
        email: 'email',
        googleTokens: 'google_tokens',
        expires: 'expires'
    }

    const sets: string[] = [] // list of strings like '[field] = ?'
    const values: any[] = [] // the values that will replace "?" in the final query

    // iterate the entire session object
    for (const key in session) {
        const value = session[key as keyof typeof session]
        const field = fields[key]
        if (field && value !== undefined) {
            sets.push(`${field} = ?`) // create set value
            // convert value to a type storable in the database, and add it to the values array.
            switch(field) {
                case 'google_tokens':
                    values.push(JSON.stringify(value))
                    break;
                case 'email':
                    values.push(session.user?.email)
                    break;
                default:
                    values.push(value instanceof Date ? value.toISOString() : value)
            }
        }
    }

    const token = session.token

    // build the SQL query to update the desired values
    if (sets.length > 0) db.prepare(`
            UPDATE sessions
            SET ${sets.join(', ')}
            WHERE token = ?
            `).run([...values, token])

    return getSessionSync(token) as Session
}

/**
 * Updates a session.
 * 
 * @param session The values within session to update.
 * @returns A promise that resolves with the updated session.
 */
export function updateSession(
    session: Partial<Session> & Pick<Session, 'token'>
): Promise<Session> {
    return new Promise((resolve, reject) => {
        try {
            resolve(updateSessionSync(session))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously deletes a session.
 * 
 * @param token The token of the session to delete.
 */
function deleteSessionSync(
    token: string
) {
    db.prepare(`
    DELETE FROM sessions
    WHERE token = ?
    `).run(token)
}

/**
 * Deletes a session.
 * 
 * @param token The token of the session to delete.
 * @returns A promise that resolves when the session is deleted.
 */
export function deleteSession(
    token: string
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            resolve(deleteSessionSync(token))
        } catch (error) {
            reject(error)
        }
    })
}

// ----- NEWS -----

/**
 * Converts a RawNews from the database into a News
 * 
 * @param rawNews
 * @returns News
 */
function buildNews(rawNews: RawNews): News {
    return {
        id: rawNews.id,
        title: rawNews.title,
        subject: rawNews.subject,
        body: rawNews.body,
        postDate: new Date(rawNews.post_date),
        imageURL: rawNews.image_url
    } as News
}

/**
 * Gets a single record from the News Table
 * 
 * @param id
 * @returns News on found; null on not found
 */
function getNewsSync(
    id: number
): News | null {
    let rawData = db.prepare(`
    SELECT id, title, subject, body, post_date, image_url FROM news 
    WHERE id = ?
    `)
    .get(id) as RawNews | null

    if (!rawData) return null
    
    return buildNews(rawData)
}

/**
 * Gets a single record from the News Table
 * 
 * @param id
 * @returns News on found; null on not found
 */
export function getNews(
    id: number
): Promise<News | null> {
    return new Promise<News | null>((resolve, reject) => {
        try {
            resolve(getNewsSync(id))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Gets a News[] from the database based on startDate
 * 
 * @param startDate
 * @param limit
 * @param offset
 * @returns News[] with all news for the given start date and offset
 */
function getNewsfeedSync(
    startDate: Date,
    limit: number,
    offset: number
): News[] {
    let rawData = db.prepare(`
    SELECT id, title, subject, body, post_date, image_url FROM news 
    WHERE post_date > ? 
    ORDER BY post_date DESC, Id DESC
    LIMIT ? OFFSET ? 
    `)
    .all(startDate.toISOString(), limit, offset) as RawNews[]

    return rawData.map(buildNews) as News[]
}

/**
 * Gets a News[] from the database based on startDate
 * 
 * @param startDate
 * @param limit
 * @param offset
 * @returns News[] with all news for the given start date and offset
 */
export function getNewsfeed(
    startDate: Date,
    limit: number,
    offset: number
): Promise<News[]> {
    return new Promise<News[]>((resolve, reject) => {
        try {
            resolve(getNewsfeedSync(startDate, limit, offset))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Creates a new announcement
 * 
 * @param title
 * @param subject
 * @param body
 * @param postDate
 * @param imageURL
 * @returns newsId
 */
function insertNewsSync(
    title: string,
    subject: string | null,
    body: string,
    postDate: Date,
    imageURL: string | null
): number {
    let newsId = db.prepare(`
    INSERT INTO news (title, subject, body, post_date, image_url)
    VALUES (?, ?, ?, ?, ?)
    `)
    .run(title, subject, body, postDate.toISOString(), imageURL)
    .lastInsertRowid

    return Number(newsId)
}

/**
 * Creates a new announcement
 * 
 * @param title
 * @param subject
 * @param body
 * @param postDate
 * @param imageURL
 * @returns newsId
 */
export function insertNews(
    title: string,
    subject: string | null,
    body: string,
    postDate: Date,
    imageURL: string | null
): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        try {
            resolve(insertNewsSync(title, subject, body, postDate, imageURL))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Updates an announcement
 * 
 * @param news
 * @returns true on success
 */
function updateNewsSync(
    news: News
): boolean {
    db.prepare(`
    UPDATE news SET title = ?, subject = ?, body = ?, post_date = ?, image_url = ?
    WHERE id = ?
    `)
    .run(news.title, news.subject, news.body, news.postDate.toISOString(), news.imageURL, news.id)

    return true
}

/**
 * Updates an announcement
 * 
 * @param news
 * @returns true on success
 */
export function updateNews (
    news: News
): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(updateNewsSync(news))
        } catch (error) {
            return false
        }
    })
}

/**
 * Deletes an announcement
 * 
 * @param id
 * @returns true on success
 */
function deleteNewsSync(
    id: number
): boolean {
    db.prepare(`
    DELETE FROM news 
    WHERE id = ?
    `)
    .run(id)

    return true
}

/**
 * Deletes an announcement
 * 
 * @param id
 * @returns true on success
 */
export function deleteNews(
    id: number
): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(deleteNewsSync(id))
        } catch (error) {
            reject(error)
        }
    })
}

// ----- EVENT TYPES -----

/**
 * Synchronously gets the event type associated with the provided id.
 * 
 * @param id The ID of the event type to get.
 * @returns The found EventType or null.
 */
function getEventTypeSync(
    id: Id
): EventType | null {
    return db.prepare(`
    SELECT id, name, points
    FROM event_types
    WHERE id = ?
    `).get(id) as EventType | null
}

/**
 * Gets the event type associated with the provided id.
 * 
 * @param id The ID of the event type to get.
 * @returns A promise that resolves with the found EventType or null.
 */
export function getEventType(
    id: Id
): Promise<EventType | null> {
    return new Promise((resolve, reject) => {
        try {
            resolve(getEventTypeSync(id))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously gets and returns every EventType in the database.
 * 
 * @returns An array of EventType objects.
 */
function getAllEventTypesSync(): EventType[] {
    return db.prepare(`
    SELECT id, name, points
    FROM event_types
    `).all() as EventType[]
}

/**
 * Gets and returns every EventType in the database.
 * 
 * @returns A promise that resolves with an array of EventType objects.
 */
export function getAllEventTypes(): Promise<EventType[]> {
    return new Promise((resolve, reject) => {
        try {
            resolve(getAllEventTypesSync())
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously creates a new event type in the database.
 * 
 * @param eventType The event type to insert without its ID.
 * @returns The newly created event type.
 */
function insertEventTypeSync(
    eventType: Omit<EventType, 'id'>
): EventType {

    const eventTypeId = db.prepare(`
    INSERT INTO event_types (name, points)
    VALUES (?, ?)
    `).run(
        eventType.name,
        eventType.points
    ).lastInsertRowid

    const returnEventType = eventType as EventType
    returnEventType.id = eventTypeId
    return returnEventType
}

/**
 * Creates a new event type in the database.
 * 
 * @param eventType The event type to insert without its ID.
 * @returns A promise that resolves with the newly created event type.
 */
export function insertEventType(
    eventType: Omit<EventType, 'id'>
): Promise<EventType> {
    return new Promise((resolve, reject) => {
        try {
            resolve(insertEventTypeSync(eventType))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously updates the values of an EventType according to what is provided.
 * 
 * @param eventType A partial that must include the EventType that's to be changed's ID.
 * @returns The updated EventType
 */
function updateEventTypeSync(
    eventType: Partial<EventType> & Pick<EventType, 'id'>
): EventType {

    const eventTypeId = eventType.id
    const sets: string[] = []
    const values: any[] = []

    // name
    if (eventType.name) {
        sets.push('name = ?')
        values.push(eventType.name)
    }

    // points
    if (eventType.points) {
        sets.push('points = ?')
        values.push(eventType.points)
    }

    // build the SQL query to update the desired values
    if (sets.length > 0) db.prepare(`
            UPDATE event_types
            SET ${sets.join(', ')}
            WHERE id = ?
            `).run([...values, eventTypeId])

    return getEventTypeSync(eventTypeId) as EventType
}

/**
 * Updates the values of an EventType according to what is provided.
 * 
 * @param eventType A partial that must include the EventType that's to be changed's ID.
 * @returns A promise that resolves with the updated EventType
 */
export function updateEventType(
    eventType: Partial<EventType> & Pick<EventType, 'id'>
): Promise<EventType> {
    return new Promise((resolve, reject) => {
        try {
            resolve(updateEventTypeSync(eventType))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Synchronously deletes a single EventType from the database.
 * 
 * @param id The id of the EventType to delete.
 */
function deleteEventTypeSync(
    id: Id
) {
    db.prepare(`
    DELETE FROM event_types
    WHERE id = ?
    `).run(id)
}

/**
 * Deletes a single EventType from the database.
 * 
 * @param id The id of the EventType to delete.
 * @returns A promise that resolves when the EventType is deleted.
 */
export function deleteEventType(
    id: Id
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            resolve(deleteEventTypeSync(id))
        } catch (error) {
            reject(error)
        }
    })
}