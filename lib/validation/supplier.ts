import z from "zod"

export const createSupplierSchema = z.object({
    name:    z.string().min(1, "Name is required"),
    contact: z.string().min(1, "Contact person is required"),
    email:   z.email("Invalid email"),
    phone:   z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
})

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>

export const updateSupplierSchema = createSupplierSchema.extend({
    id: z.string()
})

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
