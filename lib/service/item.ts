import { Prisma } from "../generated/prisma/client";
import ItemRepository, { ItemWithSupplier } from "../repository/item";


export class ItemService {
    private repo = new ItemRepository()
    
    public async getById(id: string) {
        return this.repo.getById(id)
    }

    public async createItem(data: Prisma.ItemCreateInput) {
        return this.repo.createItem(data)
    }
    public async getAllItems():Promise<ItemWithSupplier[]>{
        return this.repo.getAllItems()
    }

    public async getPaginated(page: number, pageSize: number, search?: string, category?: string) {
        return this.repo.getPaginated(page, pageSize, search, category)
    }

    public async getCategories() {
        return this.repo.getCategories()
    }

    public async getLowStock(limit = 5) {
        return this.repo.getLowStock(limit)
    }

    public async issueStock(id: string, quantity: number) {
        return this.repo.issueStock(id, quantity)
    }

    public async adjustStock(id: string, newStocks: number) {
        return this.repo.adjustStock(id, newStocks)
    }

    public async getStats() {
        return this.repo.getStats()
    }

    public async updateItem(id: string, data: Prisma.ItemUpdateInput) {
        return this.repo.updateItem(id, data)
    }

    public async hasOrderHistory(id: string) {
        return this.repo.hasOrderHistory(id)
    }

    public async getItemIdsWithOrders() {
        return this.repo.getItemIdsWithOrders()
    }

    public async deleteItem(id: string): Promise<void> {
        return this.repo.deleteItem(id)
    }
}