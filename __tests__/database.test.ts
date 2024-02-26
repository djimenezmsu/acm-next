import { AccessLevel } from "@/data/types";
import { deleteUser, getUser, insertUser, updateUser } from "@/data/webData";

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
})