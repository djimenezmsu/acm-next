import { AccessLevel, Event, EventType, News, User } from "@/data/types";
import {
    deleteNews, getNews, getNewsfeed, insertNews, updateNews,
    getUser, insertUser, deleteUser, updateUser, userExists,
    deleteSession, getSession, insertSession, updateSession, getEventType, getAllEventTypes, insertEventType, updateEventType, deleteEventType, insertEvent, deleteEvent, updateEvent, getEvent, filterEvents, attendEvent, getEventAttendance, hasUserAttendedEvent, deleteEventAttendance
} from "@/data/webData";

describe('Database', () => {
    // users table tests

    const testUser = {
        email: 'jdoe@murraystate.edu',
        givenName: 'John',
        familyName: 'Doe',
        picture: '',
        accessLevel: AccessLevel.NON_MEMBER
    } as User

    const updatedTestUser = {
        email: 'jdoe@murraystate.edu',
        givenName: 'Jane',
        familyName: 'Doe',
        picture: '',
        accessLevel: AccessLevel.NON_MEMBER
    } as User

    test('can insert a user', () => insertUser(testUser))

    test('can get a user', async () => {
        const fetched = await getUser(testUser.email)
        expect(fetched).toEqual(testUser)
    })

    test('can check if a user exists', async () => {
        const exists = await userExists(testUser.email)
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

        expect(updated).toEqual(updatedTestUser)
    })

    // sessions tests
    const toInsertSession = {
        user: updatedTestUser,
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
            user: updatedTestUser,
            googleTokens: { 'access_token': 'thisIsAnUpdatedAccessToken' }
        })
    })

    test('can delete a session', async () => {
        const session = await insertSession(toInsertSession)

        await deleteSession(session.token)
    })

    test('can delete a user', async () => {
        await deleteUser(testUser.email)
        return true
    })

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
        await getNewsfeed(50, 0)
            .then(result => expect(result).toContainEqual({
                id: newsRecordId,
                title: "Test Title",
                subject: "Test Subject",
                body: "Test Body",
                postDate: testDate,
                imageURL: null
            }))
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
        const newEventType = await insertEventType({
            name: 'Department',
            points: 0
        })
        const id = newEventType.id

        // delete
        deleteEventType(id)

        expect(newEventType).toEqual({
            id: id,
            name: 'Department',
            points: 0
        })
    })

    test('can update an EventType', async () => {
        const newEventType = await insertEventType({
            name: 'Department',
            points: 0
        })
        const id = newEventType.id

        // update
        const updated = await updateEventType({
            id: id,
            name: 'Department(s)'
        })

        // delete
        deleteEventType(id)

        expect(updated).toEqual({
            id: id,
            name: 'Department(s)',
            points: 0
        })
    })

    test('can delete an EventType', async () => {
        const newEventType = await insertEventType({
            name: 'Department',
            points: 0
        })
        await deleteEventType(newEventType.id)
        return true
    })

    // events tests
    const dateNow = new Date()
    const testEvent = {
        title: 'Bear Cloud Urchin',
        location: 'Positive Zebra',
        startDate: dateNow,
        endDate: new Date(dateNow.getTime() + 100000),
        type: defaultEventTypes[0],
        accessLevel: AccessLevel.NON_MEMBER
    } as Event

    test('can insert an event', async () => {
        const newEvent = await insertEvent(testEvent)

        deleteEvent(newEvent.id)

        expect(newEvent).toEqual({
            ...testEvent,
            id: newEvent.id
        })
    })

    test('can get an event', async () => {
        const newEvent = await insertEvent(testEvent)
        const eventId = newEvent.id

        const fetched = await getEvent(eventId)

        deleteEvent(eventId)

        expect(fetched).toEqual({
            ...testEvent,
            id: eventId
        })
    })

    test('can update an event', async () => {
        const newEvent = await insertEvent(testEvent)
        const eventId = newEvent.id

        // update
        const updated = await updateEvent({
            id: eventId,
            title: 'Red Sea Shore',
            accessLevel: AccessLevel.OFFICER
        })

        // delete
        deleteEvent(eventId)

        expect(updated).toEqual({
            ...testEvent,
            id: eventId,
            title: 'Red Sea Shore',
            accessLevel: AccessLevel.OFFICER
        })
    })

    test('can delete an event', async () => {
        const newEvent = await insertEvent(testEvent)
        await deleteEvent(newEvent.id)
        return true
    })

    test('can filter events', async () => {
        const newEvent = await insertEvent(testEvent)

        const filtered = await filterEvents({
            fromDate: dateNow
        })

        // delete
        deleteEvent(newEvent.id)

        expect(filtered.results).toContainEqual(testEvent)
    })

    // events attendance
    test("can get attend event", async () => {
        const newEvent = await insertEvent(testEvent)
        const newUser = await insertUser(testUser)

        await attendEvent(newEvent.id, newUser.email)

        deleteEvent(newEvent.id)
        deleteUser(newUser.email)
        
        return true
    })

    test("can get event attendance", async () => {
        const newEvent = await insertEvent(testEvent)
        const newUser = await insertUser(testUser)

        await attendEvent(newEvent.id, newUser.email)

        const attendance = await getEventAttendance(newEvent.id)
        
        deleteEvent(newEvent.id)
        deleteUser(newUser.email)

        expect(attendance).toEqual([newUser])
    })

    test("can check event attendance", async () => {
        const newEvent = await insertEvent(testEvent)
        const newUser = await insertUser(testUser)

        await attendEvent(newEvent.id, newUser.email)

        const didAttend = await hasUserAttendedEvent(newEvent.id, newUser.email)
        
        deleteEvent(newEvent.id)
        deleteUser(newUser.email)

        expect(didAttend).toEqual(true)
    })

    test("can delete event attendance", async () => {
        const newEvent = await insertEvent(testEvent)
        const newUser = await insertUser(testUser)

        await attendEvent(newEvent.id, newUser.email)

        await deleteEventAttendance(newEvent.id, newUser.email)
        
        deleteEvent(newEvent.id)
        deleteUser(newUser.email)

        return true
    })

})