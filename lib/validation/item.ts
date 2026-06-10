import z from "zod";

export const createItemSchema = z.object({
    name:       z.string().min(1, "Item name is required"),
    category:   z.string().min(1, "Category is required"),
    unit:       z.string().min(1, "Unit is required"),
    quantity:   z.number({ message: "Bundle size is required" }).min(1, "Must be at least 1"),
    price:      z.number({ message: "Price is required" }).min(0, "Must be 0 or more"),
    stocks:     z.number({ message: "Stocks is required" }).min(0, "Must be 0 or more"),
    supplierId: z.string().min(1, "Supplier is required"),
})

export type CreateItemInput = z.infer<typeof createItemSchema>

export const updateItemSchema = createItemSchema.extend({
    id: z.string()
})

export type UpdateItemInput = z.infer<typeof updateItemSchema>
