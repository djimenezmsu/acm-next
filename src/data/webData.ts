import getDatabase from ".";
import { AccessLevel, Databases, RawUser, User } from "./types";

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
): void {
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