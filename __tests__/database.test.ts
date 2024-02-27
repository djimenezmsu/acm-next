import { AccessLevel } from "@/data/types";
import { deleteSession, deleteUser, getSession, getUser, insertSession, insertUser, updateSession, updateUser, userExists } from "@/data/webData";

describe('Database', () => {
    // users table tests

    const user = {
        email: 'jdoe@murraystate.edu',
        firstName: 'John',
        lastName: 'Doe',
        accessLevel: AccessLevel.NON_MEMBER
    }

    const updatedUser = {
        email: 'jdoe@murraystate.edu',
        firstName: 'Jane',
        lastName: 'Doe',
        accessLevel: AccessLevel.NON_MEMBER
    }

    test('can insert a user', () => insertUser(user))

    test('can get a user', async () => {
        const fetched = await getUser(user.email)
        expect(fetched).toEqual(user)
    })

    test('can check if a user exists', async () => {
        const exists = await userExists(user.email)
        expect(exists).toBe(true)
    })

    test('can check if a user does not exist', async () => {
        const exists = await userExists('janedoe@murraystate.edu')
        expect(exists).toBe(false)
    })

    test('can update a user', async () => {
        const updated = await updateUser({
            email: 'jdoe@murraystate.edu',
            firstName: 'Jane'
        })

        expect(updated).toEqual(updatedUser)
    })

    // sessions tests
    const toInsertSession = {
        user: updatedUser,
        googleTokens: { 'access_token': 'thisIsAnAccessToken' }
    }

    test('can insert a session', () => insertSession(toInsertSession))

    test('can get a session', async () => {
        const session = await insertSession(toInsertSession)

        const fetched = await getSession(session.token)

        expect(fetched).toEqual(toInsertSession)
    })

    test('can update a session', async () => {
        const session = await insertSession(toInsertSession)

        const updated = await updateSession({
            token: session.token,
            googleTokens: { 'access_token': 'thisIsAnUpdatedAccessToken' }
        })

        expect(updated).toEqual({
            token: session.token,
            user: updatedUser,
            googleTokens: { 'access_token': 'thisIsAnUpdatedAccessToken' }
        })
    })

    test('can delete a session', async () => {
        const session = await insertSession(toInsertSession)

        await deleteSession(session.token)
    })

    test('can delete a user', () => deleteUser('jdoe@murraystate.edu')
        .then(_ => true)
        .catch(_ => false)
    )
})