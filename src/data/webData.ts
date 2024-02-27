import { randomBytes } from "crypto";
import getDatabase from ".";
import { AccessLevel, Databases, RawSession, RawUser, Session, User } from "./types";

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
        firstName: rawUser.first_name,
        lastName: rawUser.last_name,
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
    SELECT email, first_name, last_name, access_level
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
    INSERT INTO users (email, first_name, last_name, access_level)
    VALUES (?, ?, ?, ?)`).run(
        user.email,
        user.firstName,
        user.lastName,
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
        firstName: 'first_name',
        lastName: 'last_name',
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
        googleTokens: JSON.parse(rawSession.google_tokens)
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
    SELECT token, email, google_tokens
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

/**
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
    INSERT INTO sessions (token, email, google_tokens)
    VALUES (?, ?, ?)
    `).run(
        token,
        session.user.email,
        JSON.stringify(session.googleTokens)
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

/**
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
        googleTokens: 'google_tokens'
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
            values.push(field == 'google_tokens' ? JSON.stringify(value) : field == 'email' ? session.user?.email : value)
        }
    }

    const token = session.token

    // build the SQL query to update the desired values
    if (sets.length > 0) db.prepare(`
            UPDATE sessions
            SET ${sets.join(', ')}
            WHERE token = ?
            `).run([...values, token])

    console.log(token, sets, values)

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