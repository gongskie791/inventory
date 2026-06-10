import { db } from "../db";
import { Prisma, Supplier } from "../generated/prisma/client";

export type SupplierWithItems = Prisma.SupplierGetPayload<{
    include: { items: true; _count: { select: { orders: true } } }
}>

export default class SupplierRepository{
    public async getAllSupplier(): Promise<Supplier[]>{
        return db.supplier.findMany()
    }

    public async getAllWithItems(): Promise<SupplierWithItems[]> {
        return db.supplier.findMany({ include: { items: true, _count: { select: { orders: true } } }, orderBy: { name: 'asc' } })
    }

    public async getPaginated(page: number, pageSize: number, search?: string): Promise<{ suppliers: SupplierWithItems[], total: number }> {
        const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {}
        const [suppliers, total] = await Promise.all([
            db.supplier.findMany({
                where,
                include: { items: true, _count: { select: { orders: true } } },
                orderBy: { name: 'asc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            db.supplier.count({ where })
        ])
        return { suppliers, total }
    }

    public async getStats() {
        const suppliers = await db.supplier.findMany({ include: { _count: { select: { items: true } } } })
        const totalItems = suppliers.reduce((sum, s) => sum + s._count.items, 0)
        return { totalSuppliers: suppliers.length, totalItems }
    }

    public async createSupplier(data: Prisma.SupplierCreateInput): Promise<Supplier>{
        return await db.supplier.create({ data })
    }

    public async updateSupplier(id: string, data: Prisma.SupplierUpdateInput): Promise<Supplier>{
        return await db.supplier.update({ where: { id }, data })
    }

    public async hasOrders(id: string): Promise<boolean> {
        const count = await db.order.count({ where: { supplierId: id } })
        return count > 0
    }

    public async hasItems(id: string): Promise<boolean> {
        const count = await db.item.count({ where: { supplierId: id } })
        return count > 0
    }

    public async deleteSupplier(id: string): Promise<void>{
        await db.supplier.delete({ where: { id } })
    }

    public async findEmail(email: string, excludeId?: string): Promise<Supplier | null>{
        return db.supplier.findFirst({
            where: { email, NOT: { id: excludeId } }
        })
    }

    public async findPhone(phone: string, excludeId?: string): Promise<Supplier | null>{
        return db.supplier.findFirst({
            where: { phone, NOT: { id: excludeId } }
        })
    }
}