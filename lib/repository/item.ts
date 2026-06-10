import { db } from "../db";
import { Prisma } from "../generated/prisma/client";
import { computeStatus } from "../helpers/status";

export type ItemWithSupplier = Prisma.ItemGetPayload<{
    include: {
        supplier: { select: { name: true } }
    }
}>

export default class ItemRepository {

    public async getAllItems(): Promise<ItemWithSupplier[]>{
        return db.item.findMany({ include: { supplier: { select: { name: true } } } })
    }

    public async getPaginated(page: number, pageSize: number, search?: string, category?: string): Promise<{ items: ItemWithSupplier[], total: number }> {
        const where: Prisma.ItemWhereInput = {
            ...(search   ? { name:     { contains: search,   mode: 'insensitive' as const } } : {}),
            ...(category ? { category: { equals:   category, mode: 'insensitive' as const } } : {}),
        }
        const [items, total] = await Promise.all([
            db.item.findMany({
                where,
                include: { supplier: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            db.item.count({ where })
        ])
        return { items, total }
    }

    public async getCategories(): Promise<string[]> {
        const rows = await db.item.findMany({ select: { category: true }, distinct: ['category'], orderBy: { category: 'asc' } })
        return rows.map(r => r.category)
    }

    public async getLowStock(limit = 5): Promise<ItemWithSupplier[]> {
        return db.item.findMany({
            where: { stocks: { lte: 10 } },
            include: { supplier: { select: { name: true } } },
            orderBy: { stocks: 'asc' },
            take: limit,
        })
    }

    public async getStats() {
        const rows = await db.item.findMany({ select: { stocks: true, price: true } })
        return {
            total:      rows.length,
            inStock:    rows.filter(i => i.stocks > 10).length,
            lowStock:   rows.filter(i => i.stocks > 0 && i.stocks <= 10).length,
            outOfStock: rows.filter(i => i.stocks <= 0).length,
            totalValue: rows.reduce((sum, i) => sum + i.price * i.stocks, 0),
        }
    }

    public async getById(id: string): Promise<ItemWithSupplier | null> {
        return db.item.findUnique({ where: { id }, include: { supplier: { select: { name: true } } } })
    }

    public async createItem(data: Prisma.ItemCreateInput): Promise<void> {
        await db.item.create({ data })
    }

    public async updateItem(id: string, data: Prisma.ItemUpdateInput): Promise<void> {
        await db.item.update({ where: { id }, data })
    }

    public async hasOrderHistory(id: string): Promise<boolean> {
        const count = await db.orderItem.count({ where: { itemId: id } })
        return count > 0
    }

    public async getItemIdsWithOrders(): Promise<Set<string>> {
        const rows = await db.orderItem.findMany({ select: { itemId: true }, distinct: ['itemId'] })
        return new Set(rows.map(r => r.itemId))
    }

    public async deleteItem(id: string): Promise<void> {
        await db.item.delete({ where: { id } })
    }

    public async issueStock(id: string, quantity: number): Promise<void> {
        const item = await db.item.findUnique({ where: { id } })
        if (!item) throw new Error('Item not found')
        if (item.stocks < quantity) throw new Error('Insufficient stock')
        const newStocks = item.stocks - quantity
        await db.item.update({ where: { id }, data: { stocks: newStocks, status: computeStatus(newStocks) } })
    }

    public async adjustStock(id: string, newStocks: number): Promise<void> {
        await db.item.update({ where: { id }, data: { stocks: newStocks, status: computeStatus(newStocks) } })
    }

}