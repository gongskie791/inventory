"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UpdateItemInput, updateItemSchema } from "@/lib/validation/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateItem } from "@/lib/action/item";
import { Supplier } from "@/lib/generated/prisma/client";

const UNITS = ["piece", "box", "pack", "ream", "kg", "gram", "liter", "bottle", "bag", "roll", "set", "pair", "dozen", "carton"]

type Props = UpdateItemInput & { suppliers: Supplier[] }

export default function UpdateInventoryItemDialog({ suppliers, ...data }: Props) {
    const [open, setOpen] = useState(false)

    const form = useForm<UpdateItemInput>({
        resolver: zodResolver(updateItemSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            category: data.category,
            unit: data.unit,
            supplierId: data.supplierId,
            quantity: data.quantity,
            price: data.price,
            stocks: data.stocks,
        }
    })

    async function onSubmit(formData: UpdateItemInput) {
        const result = await updateItem(formData)
        if (result?.success) {
            toast.success("Item updated successfully!")
            setOpen(false)
        }
        if (result?.error) toast.error(result.error)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full" size={"icon-sm"} variant={"secondary"}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-4 bg-white text-black sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-semibold">Update Item</DialogTitle>
                    <DialogDescription className="text-gray-400">Update item details</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <input type="hidden" {...form.register('id')} />
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
                    <input type="hidden" {...form.register('stocks', { valueAsNumber: true })} />
                    <Field orientation="responsive">
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
                        {form.formState.isSubmitting ? "Updating..." : "Update Item"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
