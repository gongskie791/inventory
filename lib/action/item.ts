'use server'
import { ItemService } from "@/lib/service/item"
import StockIssueService from "@/lib/service/stockIssue"
import StockAdjustmentService from "@/lib/service/stockAdjustment"
import { CreateItemInput, UpdateItemInput } from "@/lib/validation/item"
import { revalidatePath } from "next/cache"
import { computeStatus } from "@/lib/helpers/status"

const service = new ItemService()
const issueService = new StockIssueService()
const adjustmentService = new StockAdjustmentService()

export async function createItem(data: CreateItemInput) {
    try {
        const { supplierId, ...rest } = data
        await service.createItem({
            ...rest,
            status: computeStatus(data.stocks),
            supplier: { connect: { id: supplierId } }
        })
        revalidatePath('/inventory')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}

export async function updateItem(data: UpdateItemInput) {
    try {
        const { id, supplierId, ...rest } = data
        await service.updateItem(id, {
            ...rest,
            status: computeStatus(data.stocks),
            supplier: { connect: { id: supplierId } }
        })
        revalidatePath('/inventory')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}

export async function deleteItem(id: string) {
    try {
        const hasOrders = await service.hasOrderHistory(id)
        if (hasOrders) return { error: "Cannot delete — this item has existing order history." }
        await service.deleteItem(id)
        revalidatePath('/inventory')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}

export async function adjustStock(id: string, newStocks: number, reason?: string) {
    try {
        const item = await service.getById(id)
        const previousStock = item?.stocks ?? 0
        await service.adjustStock(id, newStocks)
        if (previousStock !== newStocks) {
            await adjustmentService.create({ itemId: id, previousStock, newStock: newStocks, reason })
        }
        revalidatePath('/inventory')
        revalidatePath('/')
        revalidatePath('/history')
        return { success: true }
    } catch (e) {
        return { error: e instanceof Error ? e.message : "Something went wrong." }
    }
}

export async function bulkIssueStock(
    items: { itemId: string; quantity: number }[],
    issuedTo: string,
    reason?: string
) {
    try {
        if (!issuedTo.trim()) return { error: "Issued To is required." }
        if (items.length === 0) return { error: "Add at least one item." }

        for (const { itemId, quantity } of items) {
            const item = await service.getById(itemId)
            if (!item) return { error: `Item not found.` }
            if (quantity < 1) return { error: `Quantity must be at least 1.` }
            if (quantity > item.stocks) return { error: `Insufficient stock for "${item.name}". Available: ${item.stocks}` }
        }

        const bulkId = crypto.randomUUID()
        const issueIds: string[] = []
        for (const { itemId, quantity } of items) {
            await service.issueStock(itemId, quantity)
            const issueId = await issueService.create({ itemId, quantity, issuedTo: issuedTo.trim(), reason: reason?.trim() || undefined, bulkId })
            issueIds.push(issueId)
        }

        revalidatePath('/inventory')
        revalidatePath('/history')
        revalidatePath('/')
        return { success: true, issueIds, bulkId }
    } catch (e) {
        return { error: e instanceof Error ? e.message : "Something went wrong." }
    }
}

export async function issueStock(id: string, quantity: number, issuedTo: string, reason?: string) {
    try {
        await service.issueStock(id, quantity)
        const issueId = await issueService.create({ itemId: id, quantity, issuedTo, reason })
        revalidatePath('/inventory')
        revalidatePath('/history')
        revalidatePath('/')
        return { success: true, issueId }
    } catch (e) {
        return { error: e instanceof Error ? e.message : "Something went wrong." }
    }
}
