import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { deleteSession, getUser, insertUser, updateUser } from "@/data/webData";
import { AccessLevel } from "@/data/types";
import { generateSession, getActiveSession, logout } from "@/lib/oauth";

export async function GET(
    request: NextRequest
) {
    const params = request.nextUrl.searchParams
    const referTo = params.get('refer') || "/"
    const cookie = cookies()
    
    const currentSession = await getActiveSession(cookie)
    // redirect if not logged in
    if (currentSession === null) return redirect(referTo)

    // logout
    await logout(
        currentSession.token,
        cookie
    )

    return redirect(referTo)
}