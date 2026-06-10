import { db } from "../db"

export type ReportStats = {
    totalIssued: number
    totalValueIssued: number
    totalReceived: number
    totalAdjustments: number
}

export type TopIssuedItem = {
    name: string
    unit: string
    totalQty: number
    totalValue: number
}

export type DailyMovement = {
    date: string
    issued: number
    received: number
}

export default class ReportsRepository {
    public async getStats(from: Date, to: Date): Promise<ReportStats> {
        const [issues, orders, adjustments] = await Promise.all([
            db.stockIssue.findMany({
                where: { createdAt: { gte: from, lte: to } },
                include: { item: { select: { price: true } } },
            }),
            db.order.findMany({
                where: { status: 'received', updatedAt: { gte: from, lte: to } },
                include: { items: true },
            }),
            db.stockAdjustment.count({ where: { createdAt: { gte: from, lte: to } } }),
        ])

        const totalIssued = issues.reduce((s, i) => s + i.quantity, 0)
        const totalValueIssued = issues.reduce((s, i) => s + i.quantity * i.item.price, 0)
        const totalReceived = orders.reduce((s, o) => s + o.items.reduce((ss, oi) => ss + oi.quantity, 0), 0)

        return { totalIssued, totalValueIssued, totalReceived, totalAdjustments: adjustments }
    }

    public async getTopIssuedItems(from: Date, to: Date, limit = 5): Promise<TopIssuedItem[]> {
        const issues = await db.stockIssue.findMany({
            where: { createdAt: { gte: from, lte: to } },
            include: { item: { select: { name: true, unit: true, price: true } } },
        })

        const map = new Map<string, TopIssuedItem>()
        for (const issue of issues) {
            const key = issue.item.name
            const existing = map.get(key)
            if (existing) {
                existing.totalQty += issue.quantity
                existing.totalValue += issue.quantity * issue.item.price
            } else {
                map.set(key, {
                    name: issue.item.name,
                    unit: issue.item.unit,
                    totalQty: issue.quantity,
                    totalValue: issue.quantity * issue.item.price,
                })
            }
        }

        return [...map.values()]
            .sort((a, b) => b.totalQty - a.totalQty)
            .slice(0, limit)
    }

    public async getDailyMovement(from: Date, to: Date): Promise<DailyMovement[]> {
        const [issues, orders] = await Promise.all([
            db.stockIssue.findMany({
                where: { createdAt: { gte: from, lte: to } },
                select: { quantity: true, createdAt: true },
            }),
            db.order.findMany({
                where: { status: 'received', updatedAt: { gte: from, lte: to } },
                select: { updatedAt: true, items: { select: { quantity: true } } },
            }),
        ])

        const dayMap = new Map<string, DailyMovement>()

        const getOrCreate = (date: string) => {
            if (!dayMap.has(date)) dayMap.set(date, { date, issued: 0, received: 0 })
            return dayMap.get(date)!
        }

        for (const issue of issues) {
            const date = issue.createdAt.toISOString().slice(0, 10)
            getOrCreate(date).issued += issue.quantity
        }

        for (const order of orders) {
            const date = order.updatedAt.toISOString().slice(0, 10)
            const qty = order.items.reduce((s, oi) => s + oi.quantity, 0)
            getOrCreate(date).received += qty
        }

        return [...dayMap.values()].sort((a, b) => a.date.localeCompare(b.date))
    }
}
