"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { adjustStock } from "@/lib/action/item"
import { toast } from "sonner"
import { SlidersHorizontal } from "lucide-react"

type Props = { id: string; name: string; stocks: number }

export function StockAdjustmentDialog({ id, name, stocks }: Props) {
    const [open, setOpen] = useState(false)
    const [newStocks, setNewStocks] = useState(stocks)
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    function handleOpenChange(val: boolean) {
        setOpen(val)
        if (val) { setNewStocks(stocks); setReason("") }
    }

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault()
        if (newStocks < 0) { toast.error("Stock cannot be negative"); return }
        setLoading(true)
        const result = await adjustStock(id, newStocks, reason || undefined)
        setLoading(false)
        if (result?.success) {
            const diff = newStocks - stocks
            const msg = diff === 0 ? "No change" : diff > 0 ? `+${diff} added` : `${diff} removed`
            toast.success(`${name} adjusted (${msg})`)
            setOpen(false)
        }
        if (result?.error) toast.error(result.error)
    }

    const diff = newStocks - stocks

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="icon-sm" variant="outline" className="rounded-full" title="Adjust Stock">
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Adjust Stock — {name}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500">
                    Current stocks: <span className="font-medium text-black">{stocks}</span>
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel>Actual Stock Count</FieldLabel>
                        <Input
                            type="number"
                            min={0}
                            value={newStocks}
                            onChange={e => setNewStocks(Number(e.target.value))}
                            onKeyDown={e => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Reason <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
                        <Input
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g. Physical count, damaged goods..."
                        />
                    </Field>
                    {diff !== 0 && (
                        <p className={`text-sm font-medium ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {diff > 0 ? `+${diff} will be added` : `${Math.abs(diff)} will be removed`}
                        </p>
                    )}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading || diff === 0} className="bg-orange-400">
                            {loading ? "Adjusting..." : "Apply Adjustment"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
