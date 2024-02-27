import { Credentials } from "google-auth-library"

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

// sessions types
export interface RawSession {
    token: string,
    email: string,
    google_tokens: string
}

export interface Session {
    token: string,
    user: User,
    googleTokens: Credentials
}