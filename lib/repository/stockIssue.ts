import { db } from "../db"
import { Prisma } from "../generated/prisma/client"

export type StockIssueWithItem = Prisma.StockIssueGetPayload<{
    include: { item: { select: { name: true; unit: true; price: true } } }
}>

export default class StockIssueRepository {
    public async create(data: { itemId: string; quantity: number; issuedTo: string; reason?: string; bulkId?: string }): Promise<string> {
        const issue = await db.stockIssue.create({ data })
        return issue.id
    }

    public async getByBulkId(bulkId: string): Promise<StockIssueWithItem[]> {
        return db.stockIssue.findMany({
            where: { bulkId },
            include: { item: { select: { name: true, unit: true, price: true } } },
            orderBy: { createdAt: 'asc' },
        })
    }

    public async getById(id: string): Promise<StockIssueWithItem | null> {
        return db.stockIssue.findUnique({
            where: { id },
            include: { item: { select: { name: true, unit: true, price: true } } }
        })
    }

    public async getPaginated(
        page: number,
        pageSize: number,
        filters?: { search?: string; issuedTo?: string; from?: string; to?: string }
    ): Promise<{ issues: StockIssueWithItem[], total: number }> {
        const where: Prisma.StockIssueWhereInput = {
            ...(filters?.search   ? { item:     { name:     { contains: filters.search,   mode: 'insensitive' } } } : {}),
            ...(filters?.issuedTo ? { issuedTo: { contains: filters.issuedTo, mode: 'insensitive' } } : {}),
            ...(filters?.from || filters?.to ? {
                createdAt: {
                    ...(filters.from ? { gte: new Date(filters.from) } : {}),
                    ...(filters.to   ? { lte: new Date(filters.to + 'T23:59:59') } : {}),
                }
            } : {}),
        }
        const [issues, total] = await Promise.all([
            db.stockIssue.findMany({
                where,
                include: { item: { select: { name: true, unit: true, price: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            db.stockIssue.count({ where })
        ])
        return { issues, total }
    }

    public async getRecent(limit = 5): Promise<StockIssueWithItem[]> {
        return db.stockIssue.findMany({
            include: { item: { select: { name: true, unit: true, price: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        })
    }
}
