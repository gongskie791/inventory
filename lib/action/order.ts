'use server'
import OrderService from "@/lib/service/order"
import { CreateOrderInput, UpdateOrderStatusInput } from "@/lib/validation/order"
import { revalidatePath } from "next/cache"

const service = new OrderService()

export async function createOrder(data: CreateOrderInput) {
    try {
        await service.create({
            supplier:    { connect: { id: data.supplierId } },
            totalAmount: data.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            items: {
                create: data.items.map(i => ({
                    quantity: i.quantity,
                    price:    i.price,
                    item:     { connect: { id: i.itemId } }
                }))
            }
        })

        revalidatePath('/orders')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}

export async function updateOrderStatus(data: UpdateOrderStatusInput) {
    try {
        await service.updateStatus(data.id, data.status, data.cancellationReason)
        revalidatePath('/orders')
        revalidatePath('/inventory')
        revalidatePath('/')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}

export async function deleteOrder(id: string) {
    try {
        await service.delete(id)
        revalidatePath('/orders')
        return { success: true }
    } catch {
        return { error: "Something went wrong. Please try again." }
    }
}
