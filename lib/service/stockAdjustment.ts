import StockAdjustmentRepository from "../repository/stockAdjustment"

export default class StockAdjustmentService {
    private repo = new StockAdjustmentRepository()

    public async create(data: { itemId: string; previousStock: number; newStock: number; reason?: string }) {
        return this.repo.create(data)
    }

    public async getPaginated(page: number, pageSize: number) {
        return this.repo.getPaginated(page, pageSize)
    }
}
