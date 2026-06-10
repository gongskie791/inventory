"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateOrderStatus } from "@/lib/action/order"
import { toast } from "sonner"
import { X } from "lucide-react"

export function CancelOrderButton({ id }: { id: string }) {
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleCancel(e: { preventDefault: () => void }) {
        e.preventDefault()
        if (!reason.trim()) { toast.error("Please provide a reason for cancellation"); return }
        setLoading(true)
        const result = await updateOrderStatus({ id, status: "cancelled", cancellationReason: reason.trim() })
        setLoading(false)
        if (result?.success) {
            toast.success("Order cancelled.")
            setReason("")
            setOpen(false)
        }
        if (result?.error) toast.error(result.error)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon-sm" variant="outline"
                    className="rounded-full border-red-200 text-red-500 hover:bg-red-50"
                    title="Cancel Order">
                    <X className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Cancel Order</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500">Please provide a reason for cancelling this order.</p>
                <form onSubmit={handleCancel} className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel>Reason <span className="text-red-500">*</span></FieldLabel>
                        <Input
                            placeholder="e.g. Duplicate order, supplier unavailable..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                    </Field>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Back</Button>
                        <Button type="submit" disabled={loading} variant="destructive">
                            {loading ? "Cancelling..." : "Confirm Cancel"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
