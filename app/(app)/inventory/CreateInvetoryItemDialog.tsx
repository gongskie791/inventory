"use client"
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { createItemSchema, CreateItemInput } from "@/lib/validation/item"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { createItem } from "@/lib/action/item";
import { Supplier } from "@/lib/generated/prisma/client";

const UNITS = ["piece", "box", "pack", "ream", "kg", "gram", "liter", "bottle", "bag", "roll", "set", "pair", "dozen", "carton"]

type Props = { suppliers: Supplier[] }

export default function CreateInventoryDialog({ suppliers }: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<CreateItemInput>({
        resolver: zodResolver(createItemSchema),
        defaultValues: {
            name: '', category: '', unit: '', supplierId: '',
            quantity: 1, price: 0, stocks: 0,
        }
    })

    async function onSubmit(data: CreateItemInput) {
        const result = await createItem(data)
        if (result?.success) {
            toast.success("Item created successfully!")
            form.reset()
            setOpen(false)
        }
        if (result?.error) toast.error(result.error)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-400"><Plus /> Add Item</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-4 bg-white text-black sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-semibold">Create New Item</DialogTitle>
                    <DialogDescription className="text-gray-400">Add item details</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <Field orientation="responsive">
                        <FieldLabel>Item Name</FieldLabel>
                        <Input autoComplete="off" {...form.register('name')} />
                        {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Category</FieldLabel>
                        <Input autoComplete="off" {...form.register('category')} />
                        {form.formState.errors.category && <p className="text-red-500 text-xs">{form.formState.errors.category.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Unit</FieldLabel>
                        <Controller
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                                    <SelectContent className="bg-white text-black">
                                        {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {form.formState.errors.unit && <p className="text-red-500 text-xs">{form.formState.errors.unit.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Qty per Bundle <span className="text-xs text-gray-400">(pcs per unit)</span></FieldLabel>
                        <Input type="number" autoComplete="off" min={1}
                            {...form.register('quantity', { valueAsNumber: true })}
                            onKeyDown={e => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()} />
                        {form.formState.errors.quantity && <p className="text-red-500 text-xs">{form.formState.errors.quantity.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Price</FieldLabel>
                        <Input type="number" autoComplete="off" min={0} step="0.01"
                            {...form.register('price', { valueAsNumber: true })}
                            onKeyDown={e => ["-", "+"].includes(e.key) && e.preventDefault()} />
                        {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Stocks <span className="text-xs text-gray-400">(no. of units)</span></FieldLabel>
                        <Input type="number" autoComplete="off" min={0}
                            {...form.register('stocks', { valueAsNumber: true })}
                            onKeyDown={e => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()} />
                        {form.formState.errors.stocks && <p className="text-red-500 text-xs">{form.formState.errors.stocks.message}</p>}
                    </Field>
                    <Field orientation="responsive" className="col-span-2">
                        <FieldLabel>Supplier</FieldLabel>
                        <Controller
                            control={form.control}
                            name="supplierId"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                                    <SelectContent className="bg-white text-black">
                                        {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {form.formState.errors.supplierId && <p className="text-red-500 text-xs">{form.formState.errors.supplierId.message}</p>}
                    </Field>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="col-span-2 bg-orange-400">
                        {form.formState.isSubmitting ? "Saving..." : "Save Item"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
