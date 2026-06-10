import ReportsRepository from "../repository/reports"

export default class ReportsService {
    private repo = new ReportsRepository()

    public async getStats(from: Date, to: Date) {
        return this.repo.getStats(from, to)
    }

    public async getTopIssuedItems(from: Date, to: Date, limit = 5) {
        return this.repo.getTopIssuedItems(from, to, limit)
    }

    public async getDailyMovement(from: Date, to: Date) {
        return this.repo.getDailyMovement(from, to)
    }
}
