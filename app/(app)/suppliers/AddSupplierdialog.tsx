"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createSupplier } from "@/lib/action/supplier"
import { createSupplierSchema, CreateSupplierInput } from "@/lib/validation/supplier"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function AddSupplierDialog() {
    const [open, setOpen] = useState(false)
    const form = useForm<CreateSupplierInput>({
        resolver: zodResolver(createSupplierSchema),
        defaultValues: { name: '', contact: '', email: '', phone: '', address: '' }
    })

    async function onSubmit(data: CreateSupplierInput) {
        const result = await createSupplier(data)
        if (result?.success === true) {
            toast.success("Supplier added successfully!")
            form.reset()
            setOpen(false)
        }
        if (result?.success === false) {
            toast.error(result.message)
        }
        if (result?.error) {
            toast.error(result.error)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-400"><Plus/> Add Supplier</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-4 bg-white text-black sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-semibold">Add Supplier</DialogTitle>
                    <DialogDescription className="text-gray-400">Add new supplier</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <Field orientation="responsive">
                        <FieldLabel>Name</FieldLabel>
                        <Input autoComplete="off" {...form.register('name')} />
                        {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Contact Person</FieldLabel>
                        <Input autoComplete="off" {...form.register('contact')} />
                        {form.formState.errors.contact && <p className="text-red-500 text-xs">{form.formState.errors.contact.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Email</FieldLabel>
                        <Input autoComplete="off" type="email" {...form.register('email')} />
                        {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                    </Field>
                    <Field orientation="responsive">
                        <FieldLabel>Phone</FieldLabel>
                        <Input autoComplete="off" {...form.register('phone')} />
                        {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                    </Field>
                    <Field orientation="responsive" className="col-span-2">
                        <FieldLabel>Address</FieldLabel>
                        <Input autoComplete="off" {...form.register('address')} />
                        {form.formState.errors.address && <p className="text-red-500 text-xs">{form.formState.errors.address.message}</p>}
                    </Field>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="col-span-2 bg-orange-400">
                        {form.formState.isSubmitting ? "Saving..." : "Save Supplier"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
