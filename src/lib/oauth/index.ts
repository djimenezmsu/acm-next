import { Session, User } from "@/data/types";
import { deleteSession, getSession, insertSession, updateSession } from "@/data/webData";
import { Credentials, OAuth2Client } from "google-auth-library";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const defaultCookieName = 'session'
const defaultSessionRefreshThreshold = 24 * 60 * 60 * 1000 // in milliseconds, when a session has this much time left before expiration, it will be refreshed automatically
const sessionCookieLifetime = 365 * 24 * 60 * 60 * 1000 // in milliseconds, how long a session cookie will last.
const sessionLifetime = 7 * 24 * 60 * 60 * 1000 // in milliseconds, how long a session will last.

/**
 * Gets an active session from cookies.
 * 
 * @param cookies The cookies to get the session token from.
 * @param cookieName The name of the cookie.
 * @param refreshThreshold When a session has this much time left before expiration, it will be refreshed automatically.
 * @returns A promise that resolves with the found Session or null.
 */
export async function getActiveSession(
    cookies: ReadonlyRequestCookies,
    cookieName: string = defaultCookieName,
    refreshThreshold: number = defaultSessionRefreshThreshold
): Promise<Session | null> {
    return new Promise(async (resolve, reject) => {
        try {
            const token = cookies.get(cookieName)
            if (token === undefined) return resolve(null) // the token doesn't exist, so the user isn't logged in.
    
            const session = await getSession(token.value)
            if (!session) return resolve(null) // the token isn't valid, so the user isn't logged in.
    
            // check if the session's lifetime needs to be extended
            const expires = session.expires
            const dateNow = new Date()
            const timeNow = dateNow.getTime()
    
            if (dateNow > expires) {
                // the session's lifetime has been exceeded, so the session sohuld be deleted
                deleteSession(session.token)
                return resolve(null)
            } else if (refreshThreshold >= (expires.getTime() - timeNow)) {
                // increase the session's lifetime and return it.
                return resolve(updateSession({
                    token: session.token,
                    expires: new Date(timeNow + sessionLifetime)
                }))
            }
    
            // the session is valid
            resolve(session)
        } catch (error) {
            reject(error)
        }
    })
    
}

export function getAuthenticatedClient(
    session: Session
): OAuth2Client {
    const token = session.token
    let credentials = session.googleTokens
    const client = new OAuth2Client(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    )
    client.setCredentials(credentials)

    client.on('tokens', async (tokens) => {
        const updated = await updateSession({
            token: token,
            googleTokens: {...credentials, ...tokens}
        })
        credentials = updated.googleTokens
    })

    return client
}

/**
 * Generates a new login session for a user.
 * 
 * @param cookies The cookies object to save the session token to.
 * @param credentials The credentials object from google-auth-library.
 * @param user The user to generate the session for.
 * @returns A promise that resolves with the generated session.
 */
export async function generateSession(
    cookies: ReadonlyRequestCookies,
    credentials: Credentials,
    user: User,
    cookieName: string = defaultCookieName
): Promise<Session> {

    const dateNow = new Date()

    const session = await insertSession({
        user: user,
        googleTokens: credentials,
        expires: new Date(dateNow.getTime() + sessionLifetime)
    })

    // set the cookie
    cookies.set(cookieName, session.token, {
        expires: new Date(new Date().getTime() + sessionCookieLifetime),
        sameSite: true
    })

    return session
}