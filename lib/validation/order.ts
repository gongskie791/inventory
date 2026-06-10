import z from "zod"

export const createOrderSchema = z.object({
    supplierId: z.string().min(1, "Supplier is required"),
    items: z.array(z.object({
        itemId:   z.string().min(1, "Item is required"),
        quantity: z.number({ message: "Quantity is required" }).min(1, "Must be at least 1"),
        price:    z.number({ message: "Price is required" }).min(0, "Must be 0 or more"),
    })).min(1, "At least one item is required"),
})


export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const updateOrderStatusSchema = z.object({
    id:                 z.string(),
    status:             z.enum(["pending", "approved", "received", "cancelled"]),
    cancellationReason: z.string().optional(),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
