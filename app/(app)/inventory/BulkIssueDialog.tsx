"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bulkIssueStock } from "@/lib/action/item"
import { toast } from "sonner"
import { ArrowUpFromLine, Plus, Trash2, Printer } from "lucide-react"
import { ItemWithSupplier } from "@/lib/repository/item"

type Props = { items: ItemWithSupplier[] }
type IssueRow = { itemId: string; quantity: number }
type FormValues = { issuedTo: string; reason: string; items: IssueRow[] }

export function BulkIssueDialog({ items }: Props) {
    const [open, setOpen] = useState(false)
    const [issueIds, setIssueIds] = useState<string[]>([])
    const [bulkId, setBulkId] = useState<string | null>(null)

    const form = useForm<FormValues>({
        defaultValues: {
            issuedTo: '',
            reason: '',
            items: [{ itemId: '', quantity: 1 }],
        }
    })

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' })
    const watchedItems = form.watch('items')

    function getAvailableItems(index: number) {
        const selectedIds = watchedItems.map(r => r.itemId).filter(Boolean)
        return items.filter(i => !selectedIds.includes(i.id) || i.id === watchedItems[index]?.itemId)
    }

    function getStock(itemId: string) {
        return items.find(i => i.id === itemId)?.stocks ?? 0
    }

    function handleOpenChange(val: boolean) {
        setOpen(val)
        if (!val) { form.reset(); setIssueIds([]); setBulkId(null) }
    }

    async function onSubmit(data: FormValues) {
        const validItems = data.items.filter(r => r.itemId)
        if (validItems.length === 0) { toast.error("Add at least one item."); return }

        const result = await bulkIssueStock(
            validItems.map(r => ({ itemId: r.itemId, quantity: r.quantity })),
            data.issuedTo,
            data.reason || undefined
        )

        if (result?.error) { toast.error(result.error); return }
        if (result?.success && result.issueIds) {
            toast.success(`${result.issueIds.length} item(s) issued to ${data.issuedTo}`)
            setIssueIds(result.issueIds)
            setBulkId(result.bulkId ?? null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-orange-400 gap-2">
                    <ArrowUpFromLine className="w-4 h-4" /> Bulk Issue
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-semibold">Bulk Stock Issue</DialogTitle>
                    <DialogDescription className="text-gray-400">Issue multiple items at once to a recipient.</DialogDescription>
                </DialogHeader>

                {issueIds.length > 0 ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <p className="text-sm text-gray-600 text-center">
                            Stock issued successfully. Print the receipt for the recipient's signature.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => window.open(`/receipt/bulk?bulkId=${bulkId}`, '_blank')}
                                className="bg-orange-400 gap-2"
                            >
                                <Printer className="w-4 h-4" /> Print Receipt
                            </Button>
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>Close</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Issued To <span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    placeholder="e.g. Marketing Dept, John Doe"
                                    {...form.register('issuedTo', { required: true })}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Reason <span className="text-gray-400 text-xs">(optional)</span></FieldLabel>
                                <Input
                                    placeholder="e.g. Monthly supply"
                                    {...form.register('reason')}
                                />
                            </Field>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-[1fr_120px_32px] gap-2 text-xs text-gray-500 px-1">
                                <span>Item</span>
                                <span>Quantity</span>
                                <span />
                            </div>
                            {fields.map((field, index) => {
                                const selectedItemId = watchedItems[index]?.itemId
                                const stock = getStock(selectedItemId)
                                return (
                                    <div key={field.id} className="grid grid-cols-[1fr_120px_32px] gap-2 items-center">
                                        <Controller
                                            control={form.control}
                                            name={`items.${index}.itemId`}
                                            render={({ field: f }) => (
                                                <Select onValueChange={f.onChange} value={f.value}>
                                                    <SelectTrigger className="h-8 text-sm">
                                                        <SelectValue placeholder="Select item..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white text-black">
                                                        {getAvailableItems(index).map(item => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name} <span className="text-gray-400 ml-1">({item.stocks} left)</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <Input
                                            type="number"
                                            min={1}
                                            max={stock || undefined}
                                            className="h-8 text-sm"
                                            {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                            onKeyDown={e => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
                                        />
                                        <Button
                                            type="button"
                                            size="icon-sm"
                                            variant="ghost"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )
                            })}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ itemId: '', quantity: 1 })}
                                disabled={fields.length >= items.length}
                                className="self-start gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Item
                            </Button>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange-400">
                                {form.formState.isSubmitting ? "Issuing..." : "Issue All"}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
