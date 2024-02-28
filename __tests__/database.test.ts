import { AccessLevel, News } from "@/data/types";
import { deleteNews, deleteUser, getNews, getNewsfeed, getUser, insertNews, insertUser, updateNews, updateUser } from "@/data/webData";

describe('Database', () => {
    // users table tests
    test('can insert a user', () => insertUser({
        email: 'jdoe@murraystate.edu',
        firstName: 'John',
        lastName: 'Doe',
        accessLevel: AccessLevel.NON_MEMBER
    })
        .then(_ => true)
        .catch(_ => false)
    )

    test('can get a user', () => getUser('jdoe@murraystate.edu')
        .then(user => expect(user).toEqual({
            email: 'jdoe@murraystate.edu',
            firstName: 'John',
            lastName: 'Doe',
            accessLevel: AccessLevel.NON_MEMBER
        }))
        .catch(_ => false)
    )

    test('can update a user', () => updateUser({
        email: 'jdoe@murraystate.edu',
        firstName: 'Jane'
    })
        .then(user => expect(user).toEqual({
            email: 'jdoe@murraystate.edu',
            firstName: 'Jane',
            lastName: 'Doe',
            accessLevel: AccessLevel.NON_MEMBER
        }))
        .catch(_ => false)
    )

    test('can delete a user', () => deleteUser('jdoe@murraystate.edu')
        .then(_ => true)
        .catch(_ => false)
    )

    // news table tests
    let newsRecordId = 0
    let testDate = new Date()
    test('can insert an announcement', () => insertNews(
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
        .catch(_ => false)
    )

    test('can get an announcement', () => getNews(newsRecordId)
        .then(result => expect(result).toEqual({
        id: newsRecordId,
        title: "Test Title",
        subject: null,
        body: "Test Body",
        postDate: testDate,
        imageURL: null
        } as News))
        .catch(_ => false))
    
    test('can update an announcement', () => updateNews({
        id: newsRecordId,
        title: "Test Title",
        subject: "Test Subject",
        body: "Test Body",
        postDate: testDate,
        imageURL: null
        } as News
        )
        .then(result => expect(result).toBe(true))
        .catch(_ => false)
    )

    test('can get newsfeed', () => getNewsfeed(new Date(2000, 1, 1), 1, 0)
        .then(result => expect(result).toBeDefined())
        .catch(_ => false)
    )

    test('can delete an announcement', () => deleteNews(newsRecordId)
        .then(result => expect(result).toBe(true))
        .catch(_ => false))
})