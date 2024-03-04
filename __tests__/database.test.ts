import { AccessLevel, EventType, News, User } from "@/data/types";
import { 
  deleteNews, getNews, getNewsfeed, insertNews, updateNews,
  getUser, insertUser, deleteUser, updateUser, userExists,
  deleteSession, getSession, insertSession, updateSession, getEventType, getAllEventTypes, insertEventType, updateEventType, deleteEventType
       } from "@/data/webData";

describe('Database', () => {
    // users table tests

    const user = {
        email: 'jdoe@murraystate.edu',
        givenName: 'John',
        familyName: 'Doe',
        picture: '',
        accessLevel: AccessLevel.NON_MEMBER
    } as User

    const updatedUser = {
        email: 'jdoe@murraystate.edu',
        givenName: 'Jane',
        familyName: 'Doe',
        picture: '',
        accessLevel: AccessLevel.NON_MEMBER
    } as User

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
            givenName: 'Jane'
        })

        expect(updated).toEqual(updatedUser)
    })

    // sessions tests
    const toInsertSession = {
        user: updatedUser,
        googleTokens: { 'access_token': 'thisIsAnAccessToken' },
        expires: new Date()
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
            expires: toInsertSession.expires,
            googleTokens: { 'access_token': 'thisIsAnUpdatedAccessToken' }
        })

        expect(updated).toEqual({
            token: session.token,
            expires: toInsertSession.expires,
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

    // news table tests
    let newsRecordId = 0
    let testDate = new Date()
    test('can insert an announcement', async () => {
        await insertNews(
        "Test Title",
        null,
        "Test Body",
        testDate,
        null
    )
        .then(newsId => {
            newsRecordId = newsId
            expect(newsId).toBeGreaterThan(0)
        })
    })

    test('can get an announcement', async () => {
        await getNews(newsRecordId)
        .then(result => expect(result).toEqual({
        id: newsRecordId,
        title: "Test Title",
        subject: null,
        body: "Test Body",
        postDate: testDate,
        imageURL: null
        } as News))
    })
    
    test('can update an announcement', async () => {
        await updateNews({
        id: newsRecordId,
        title: "Test Title",
        subject: "Test Subject",
        body: "Test Body",
        postDate: testDate,
        imageURL: null
        } as News)
        .then(result => expect(result).toBe(true))
    })

    test('can get newsfeed', async () => {
        await getNewsfeed(new Date(2000, 1, 1), 1, 0)
        .then(result => expect(result).toBeDefined())
    })

    test('can delete an announcement', async () => {
        await deleteNews(newsRecordId)
        .then(result => expect(result).toBe(true))
    })

    // event types tests
    const defaultEventTypes: EventType[] = [
        {
            id: 1,
            name: 'Normal',
            points: 1
        },
        {
            id: 2,
            name: 'Educational',
            points: 2
        },
        {
            id: 3,
            name: 'Officer',
            points: 0
        },
    ]

    test('can get an EventType', async () => {
        await getEventType(1)
            .then(result => expect(result).toBeDefined())
    })

    test('initial "Normal" EventType exists', async () => {
        await getEventType(1)
            .then(result => expect(result).toEqual(defaultEventTypes[0]))
    })
    test('initial "Educational" EventType exists', async () => {
        await getEventType(2)
            .then(result => expect(result).toEqual(defaultEventTypes[1]))
    })
    test('initial "Officer" EventType exists', async () => {
        await getEventType(3)
            .then(result => expect(result).toEqual(defaultEventTypes[2]))
    })

    test('can get all EventTypes', async () => {
        await getAllEventTypes()
            .then(types => expect(types).toEqual(defaultEventTypes))
    })

    test('can insert an EventType', async () => {
        await insertEventType({
            name: 'Department',
            points: 0
        })
            .then(newType => expect(newType).toEqual({
                id: 4,
                name: 'Department',
                points: 0
            }))
    })

    test('can update an EventType', async () => {
        await updateEventType({
            id: 4,
            name: 'Department(s)'
        })
            .then(updatedType => expect(updatedType).toEqual({
                id: 4,
                name: 'Department(s)',
                points: 0
            }))
    })

    test('can delete an EventType', async () => {
        await deleteEventType(4).then(_ => true)
    })
})