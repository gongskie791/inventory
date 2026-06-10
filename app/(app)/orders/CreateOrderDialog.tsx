"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrder } from "@/lib/action/order"
import { createOrderSchema, CreateOrderInput } from "@/lib/validation/order"
import { Supplier } from "@/lib/generated/prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash } from "lucide-react"
import { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

type ItemWithSupplier = { id: string; name: string; price: number; supplierId: string }
type Props = { suppliers: Supplier[]; items: ItemWithSupplier[] }

export default function CreateOrderDialog({ suppliers, items }: Props) {
    const [open, setOpen] = useState(false)

    const form = useForm<CreateOrderInput>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            supplierId: '',
            items: [{ itemId: '', quantity: 1, price: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    })

    function handleItemChange(index: number, itemId: string) {
        const selected = items.find(i => i.id === itemId)
        if (selected) {
            form.setValue(`items.${index}.price`, selected.price)
        }
    }

    const selectedSupplierId = form.watch("supplierId")
    const filteredItems = selectedSupplierId
        ? items.filter(i => i.supplierId === selectedSupplierId)
        : []

    const watchedItems = form.watch("items")
    const total = watchedItems.reduce((sum, i) => sum + (i.price * i.quantity || 0), 0)

    function getAvailableItems(index: number) {
        const selectedIds = watchedItems.map(i => i.itemId).filter(Boolean)
        return filteredItems.filter(i => !selectedIds.includes(i.id) || i.id === watchedItems[index]?.itemId)
    }

    async function onSubmit(data: CreateOrderInput) {
        const result = await createOrder(data)
        if (result?.success) {
            toast.success("Order created!")
            form.reset()
            setOpen(false)
        }
        if (result?.error) toast.error(result.error)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-400"><Plus /> Create Order</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-4 bg-white text-black sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-semibold">Create Order</DialogTitle>
                    <DialogDescription className="text-gray-400">Create a new purchase order</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field orientation="responsive">
                            <FieldLabel>Supplier</FieldLabel>
                            <Controller
                                control={form.control}
                                name="supplierId"
                                render={({ field }) => (
                                    <Select onValueChange={(val) => { field.onChange(val); form.setValue('items', [{ itemId: '', quantity: 1, price: 0 }]) }} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                                        <SelectContent className="bg-white text-black">
                                            {suppliers.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.supplierId && <p className="text-red-500 text-xs">{form.formState.errors.supplierId.message}</p>}
                        </Field>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Items</p>
                            <Button type="button" size="sm" variant="outline"
                                onClick={() => append({ itemId: '', quantity: 1, price: 0 })}>
                                <Plus className="w-4 h-4" /> Add Item
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-[1fr_80px_80px_40px] gap-2 items-end">
                                <Field>
                                    <FieldLabel>Item</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name={`items.${index}.itemId`}
                                        render={({ field: f }) => (
                                            <div className="relative">
                                                <Select onValueChange={(val) => { f.onChange(val); handleItemChange(index, val) }} value={f.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={selectedSupplierId ? "Select item" : "Select a supplier first"} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white text-black">
                                                        {getAvailableItems(index).map(i => (
                                                            <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {!selectedSupplierId && (
                                                    <div
                                                        className="absolute inset-0 cursor-not-allowed"
                                                        onClick={() => toast.warning("Please select a supplier first")}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Qty</FieldLabel>
                                    <Input type="number" min={1}
                                        {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                        onKeyDown={(e) => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()} />
                                </Field>
                                <Field>
                                    <FieldLabel>Price</FieldLabel>
                                    <Input type="number" min={0} step="0.01"
                                        {...form.register(`items.${index}.price`, { valueAsNumber: true })}
                                        onKeyDown={(e) => ["-", "+"].includes(e.key) && e.preventDefault()} />
                                </Field>
                                <Button type="button" size="icon-sm" variant="destructive"
                                    onClick={() => remove(index)} disabled={fields.length === 1}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {form.formState.errors.items && <p className="text-red-500 text-xs">{form.formState.errors.items.message}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="font-medium">Total: <span className="text-orange-500">₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                        <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange-400">
                            {form.formState.isSubmitting ? "Creating..." : "Create Order"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
