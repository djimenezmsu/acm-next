import { Credentials } from "google-auth-library"

// general types
export enum Databases {
    WEB_DATA
}

export enum Pragma {
    DEFAULT
}

export type Id = number | bigint

export enum FilterDirection {
    DESCENDING,
    ASCENDING
}

export enum Semester {
    SPRING,
    FALL
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
    given_name: string
    family_name: string
    picture: string,
    access_level: number
}

export interface User {
    email: string
    givenName: string
    familyName: string
    picture: string,
    accessLevel: AccessLevel
}

// sessions types
export interface RawSession {
    token: string,
    email: string,
    google_tokens: string,
    expires: string
}

export interface Session {
    token: string,
    user: User,
    googleTokens: Credentials,
    expires: Date

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

// event types types
export interface EventType {
    id: Id
    name: string
    points: number
}

// event types
export interface RawEvent {
    id: Id
    title: string
    location: string
    start_date: string
    end_date: string
    type: number | null
    access_level: number
}

export interface RawFilterEvent extends RawEvent {
    total_count: number
}

export interface Event {
    id: Id
    title: string
    location: string
    startDate: Date
    endDate: Date
    type: EventType | null
    accessLevel: AccessLevel
}

export interface EventFilterParams {
    fromDate?: Date
    toDate?: Date
    offset?: number
    minAccessLevel?: AccessLevel
    maxEntries?: number
    direction?: FilterDirection
}

export interface EventFilterResult {
    totalCount: number,
    results: Event[]
}

/* Event Attendance */
export interface RawEventAttendance {
    event_id: Id,
    user_email: string
}