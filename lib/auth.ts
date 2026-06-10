import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set.')
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const COOKIE = 'auth_token'

export async function signToken(payload: { userId: string; email: string }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(SECRET)
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { userId: string; email: string }
}

export async function getSession() {
    const token = (await cookies()).get(COOKIE)?.value
    if (!token) return null
    try {
        return await verifyToken(token)
    } catch {
        return null
    }
}

export async function setSession(userId: string, email: string) {
    const token = await signToken({ userId, email })
    ;(await cookies()).set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
    })
}

export async function clearSession() {
    ;(await cookies()).delete(COOKIE)
}