'use server'
import SupplierService from "@/lib/service/supplier"
import { CreateSupplierInput, UpdateSupplierInput } from "@/lib/validation/supplier"
import { revalidatePath } from "next/cache"

const service = new SupplierService()

export async function createSupplier(data: CreateSupplierInput) {
    try {
        const ressult = await service.createSupplier(data)
        if ("message" in ressult){
            return { success: false, message: ressult.message}
        }
        revalidatePath('/suppliers')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}

export async function updateSupplier(data: UpdateSupplierInput) {
    try {
        const { id, ...details } = data
        const result = await service.updateSupplier(id, details)
        if ("message" in result) {
            return { success: false, message: result.message }
        }
        revalidatePath('/suppliers')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}

export async function deleteSupplier(id: string) {
    try {
        const [hasOrders, hasItems] = await Promise.all([
            service.hasOrders(id),
            service.hasItems(id),
        ])
        if (hasItems)  return { error: "Cannot delete — this supplier has existing items." }
        if (hasOrders) return { error: "Cannot delete — this supplier has existing orders." }
        await service.deleteSupplier(id)
        revalidatePath('/suppliers')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}
