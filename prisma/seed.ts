import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
    const email = process.env.SEED_EMAIL ?? 'admin@inventory.com'
    const password = process.env.SEED_PASSWORD ?? 'admin123'

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
        console.log('Admin user already exists.')
        return
    }

    const hashed = await bcrypt.hash(password, 10)
    await db.user.create({ data: { email, password: hashed } })
    console.log(`Admin user created — email: ${email} / password: ${password}`)
}

main().finally(() => db.$disconnect())
