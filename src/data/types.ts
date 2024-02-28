// general types
export enum Databases {
    WEB_DATA
}

export enum Pragma {
    DEFAULT
}

// users types
export enum AccessLevel {
    NON_MEMBER,
    MEMBER,
    OFFICER,
    ADVISOR
}

export interface RawUser {
    email: string
    first_name: string
    last_name: string
    access_level: number
}

export interface User {
    email: string
    firstName: string
    lastName: string
    accessLevel: AccessLevel
}

//news types
export interface RawNews {
    id: number,
    title: string,
    subject: string | null,
    body: string,
    post_date: string,
    image_url: string | null
}

export interface News {
    id: number,
    title: string,
    subject: string | null,
    body: string,
    postDate: Date,
    imageURL: string | null
}