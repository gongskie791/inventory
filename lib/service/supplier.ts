import { Prisma, Supplier } from "../generated/prisma/client";
import SupplierRepository from "../repository/supplier";
export type { SupplierWithItems } from "../repository/supplier";

export default class SupplierService {
    private repo = new SupplierRepository()

    public getAllSupplier(): Promise<Supplier[]>{
        return this.repo.getAllSupplier()
    }

    public getAllWithItems() {
        return this.repo.getAllWithItems()
    }

    public getPaginated(page: number, pageSize: number, search?: string) {
        return this.repo.getPaginated(page, pageSize, search)
    }

    public getStats() {
        return this.repo.getStats()
    }

    public async createSupplier(data: Prisma.SupplierCreateInput): Promise<Supplier | {message:string}>{
        const findPhone = await this.repo.findPhone(data.phone);
        if(findPhone){
            return {message: "Phone number exist try another phone number"}
        }
        const findEmail = await this.repo.findEmail(data.email);
        if(findEmail){
            return {message: "Email exist try another email"}
        }
        return this.repo.createSupplier(data)
    }

    public async updateSupplier(id: string, data: Prisma.SupplierUpdateInput): Promise<Supplier | {message:string}>{
        const findPhone = await this.repo.findPhone(data.phone as string, id)
        if(findPhone){
            return {message: "Phone number exist try another phone number"}
        }
        const findEmail = await this.repo.findEmail(data.email as string, id)
        if(findEmail){
            return {message: "Email exist try another email"}
        }
        return this.repo.updateSupplier(id, data)
    }

    public async hasOrders(id: string) {
        return this.repo.hasOrders(id)
    }

    public async hasItems(id: string) {
        return this.repo.hasItems(id)
    }

    public async deleteSupplier(id: string): Promise<void>{
        return this.repo.deleteSupplier(id)
    }
}