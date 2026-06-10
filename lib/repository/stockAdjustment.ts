import { db } from "../db"
import { Prisma } from "../generated/prisma/client"

export type StockAdjustmentWithItem = Prisma.StockAdjustmentGetPayload<{
    include: { item: { select: { name: true; unit: true } } }
}>

export default class StockAdjustmentRepository {
    public async create(data: { itemId: string; previousStock: number; newStock: number; reason?: string }): Promise<void> {
        await db.stockAdjustment.create({ data })
    }

    public async getPaginated(page: number, pageSize: number): Promise<{ adjustments: StockAdjustmentWithItem[]; total: number }> {
        const [adjustments, total] = await Promise.all([
            db.stockAdjustment.findMany({
                include: { item: { select: { name: true, unit: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            db.stockAdjustment.count()
        ])
        return { adjustments, total }
    }
}
