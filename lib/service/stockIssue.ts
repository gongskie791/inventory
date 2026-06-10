import StockIssueRepository from "../repository/stockIssue"
export type { StockIssueWithItem } from "../repository/stockIssue"

export default class StockIssueService {
    private repo = new StockIssueRepository()

    public async create(data: { itemId: string; quantity: number; issuedTo: string; reason?: string; bulkId?: string }) {
        return this.repo.create(data)
    }

    public async getByBulkId(bulkId: string) {
        return this.repo.getByBulkId(bulkId)
    }

    public async getById(id: string) {
        return this.repo.getById(id)
    }

    public async getPaginated(page: number, pageSize: number, filters?: { search?: string; issuedTo?: string; from?: string; to?: string }) {
        return this.repo.getPaginated(page, pageSize, filters)
    }

    public async getRecent(limit = 5) {
        return this.repo.getRecent(limit)
    }
}
