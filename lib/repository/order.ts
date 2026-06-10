import { db } from "../db";
import { Prisma, OrderStatus } from "../generated/prisma/client";
import { computeStatus } from "../helpers/status";

export type OrderWithDetails = Prisma.OrderGetPayload<{
    include: {
        supplier: true
        items: { include: { item: true } }
    }
}>

export default class OrderRepository {
    public async getAll(): Promise<OrderWithDetails[]>{
        return db.order.findMany({
            include: {supplier: true, items: {include:{item:true}}},
            orderBy: {createdAt:"desc"}
        })
    }

    public async getPaginated(page: number, pageSize: number, status?: OrderStatus): Promise<{ orders: OrderWithDetails[], total: number }> {
        const where = status ? { status } : {}
        const [orders, total] = await Promise.all([
            db.order.findMany({
                where,
                include: { supplier: true, items: { include: { item: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            db.order.count({ where })
        ])
        return { orders, total }
    }

    public async getReceived(page = 1, pageSize = 15): Promise<{ orders: OrderWithDetails[], total: number }> {
        const where = { status: 'received' as const }
        const [orders, total] = await Promise.all([
            db.order.findMany({
                where,
                include: { supplier: true, items: { include: { item: true } } },
                orderBy: { updatedAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            db.order.count({ where })
        ])
        return { orders, total }
    }

    public async getStats() {
        const [total, pending, approved, received, cancelled, spend] = await Promise.all([
            db.order.count(),
            db.order.count({ where: { status: 'pending' } }),
            db.order.count({ where: { status: 'approved' } }),
            db.order.count({ where: { status: 'received' } }),
            db.order.count({ where: { status: 'cancelled' } }),
            db.order.aggregate({ _sum: { totalAmount: true } }),
        ])
        return { total, pending, approved, received, cancelled, totalSpend: spend._sum.totalAmount ?? 0 }
    }

    public async getById(id: string): Promise<OrderWithDetails | null> {
        return db.order.findUnique({
            where: { id },
            include: { supplier: true, items: { include: { item: true } } },
        })
    }

    public async create(data: Prisma.OrderCreateInput): Promise<void> {
        await db.order.create({ data })
    }

    public async updateStatus(id: string, status: Prisma.OrderUpdateInput["status"], cancellationReason?: string): Promise<void> {
        if (status === 'received') {
            const order = await db.order.findUnique({
                where: { id },
                include: { items: { include: { item: { select: { stocks: true } } } } }
            })
            if (!order) return
            await db.$transaction([
                db.order.update({ where: { id }, data: { status } }),
                ...order.items.map(oi => {
                    const newStocks = oi.item.stocks + oi.quantity
                    return db.item.update({
                        where: { id: oi.itemId },
                        data:  { stocks: newStocks, status: computeStatus(newStocks) }
                    })
                })
            ])
            return
        }

        await db.order.update({
            where: { id },
            data: { status, ...(cancellationReason ? { cancellationReason } : {}) }
        })
    }

    public async delete(id: string): Promise<void> {
        const order = await db.order.findUnique({ where: { id }, include: { items: true } })
        if (!order) return

        if (order.status === 'received') {
            await db.$transaction([
                db.order.delete({ where: { id } }),
                ...order.items.map(oi =>
                    db.item.update({
                        where: { id: oi.itemId },
                        data:  { stocks: { decrement: oi.quantity } }
                    })
                )
            ])
        } else {
            await db.order.delete({ where: { id } })
        }
    }
}