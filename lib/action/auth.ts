'use server'

import { db } from '../db'
import bcrypt from 'bcryptjs'
import { setSession, clearSession } from '../auth'
import { redirect } from 'next/navigation'

export async function login(_: unknown, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) return { error: 'Email and password are required.' }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) return { error: 'Invalid email or password.' }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return { error: 'Invalid email or password.' }

    await setSession(user.id, user.email)
    redirect('/')
}

export async function logout() {
    await clearSession()
    redirect('/login')
}
