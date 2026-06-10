import { Prisma, OrderStatus } from "../generated/prisma/client"
import OrderRepository from "../repository/order"

export default class OrderService {
    private repo = new OrderRepository()

    public async getAll() {
        return this.repo.getAll()
    }

    public async getById(id: string) {
        return this.repo.getById(id)
    }

    public async getReceived(page = 1, pageSize = 15) {
        return this.repo.getReceived(page, pageSize)
    }

    public async getPaginated(page: number, pageSize: number, status?: OrderStatus) {
        return this.repo.getPaginated(page, pageSize, status)
    }

    public async getStats() {
        return this.repo.getStats()
    }

    public async create(data: Prisma.OrderCreateInput): Promise<void> {
        return this.repo.create(data)
    }

    public async updateStatus(id: string, status: Prisma.OrderUpdateInput['status'], cancellationReason?: string): Promise<void> {
        return this.repo.updateStatus(id, status, cancellationReason)
    }

    public async delete(id: string): Promise<void> {
        return this.repo.delete(id)
    }
}
