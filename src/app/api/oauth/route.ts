import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getUser, insertUser, updateUser } from "@/data/webData";
import { AccessLevel } from "@/data/types";
import assert from "assert";
import { generateSession, getActiveSession } from "@/lib/oauth";

export async function GET(
    request: NextRequest
) {
    const params = request.nextUrl.searchParams
    const code = params.get('code')

    const cookie = cookies()
    const currentSession = await getActiveSession(cookie)

    let redirectTo = '/'

    if (currentSession) return redirect(redirectTo)

    try {

        const oauthClient = new OAuth2Client(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        )

        if (!code) {
            // redirect this request to the google oauth page
            redirectTo = oauthClient.generateAuthUrl({
                access_type: 'offline',
                scope: process.env.GOOGLE_OAUTH_SCOPE,
                hd: process.env.GOOGLE_OAUTH_HD || '*',
            })
        } else {
            // get the token from google's servers
            const response = await oauthClient.getToken(code)
            const credentials = response.tokens
            oauthClient.setCredentials(credentials)

            // get the token payload, containing info such as the account's host domain, email, and name.
            const tokenPayload = await oauthClient.verifyIdToken({
                idToken: credentials.id_token || ''
            }).then(response => response.getPayload())

            // if the domain of the account doesn't match the required domain don't continue logging in
            if (!tokenPayload || tokenPayload.hd !== process.env.GOOGLE_OAUTH_HD) throw new Error('Attempted login attempt from an account with a domain outside of whitelisted one.')

            const email = tokenPayload.email
            const givenName = tokenPayload.given_name || ''
            const familyName = tokenPayload.family_name || ''
            const picture = tokenPayload.picture || ''

            // ensure that the email exists
            if (!email) throw new Error('No email found in Google Oauth2 token payload response.')

            // update or create account
            let user = await getUser(email)
            
            if (user) {
                // update the account
                user = await updateUser({
                    email: email,
                    givenName: givenName,
                    familyName: familyName,
                    picture: picture
                })
            } else {
                user = await insertUser({
                    email: email,
                    givenName: givenName,
                    familyName: familyName,
                    picture: picture,
                    accessLevel: AccessLevel.NON_MEMBER
                })
            }

            // create session
            await generateSession(cookie, credentials, user)
        }
    } catch (err: any) {
        console.log('Oauth2 Error', err.response, err.message, err.code)
    }
    
    return redirect(redirectTo)
}