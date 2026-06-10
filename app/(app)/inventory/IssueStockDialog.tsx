"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { issueStock } from "@/lib/action/item"
import { toast } from "sonner"
import { ArrowUpFromLine, Printer } from "lucide-react"

type Props = {
    id: string
    name: string
    stocks: number
}

export function IssueStockDialog({ id, name, stocks }: Props) {
    const [open, setOpen] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [issuedTo, setIssuedTo] = useState("")
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [issueId, setIssueId] = useState<string | null>(null)

    function handleOpenChange(val: boolean) {
        setOpen(val)
        if (!val) {
            setQuantity(1)
            setIssuedTo("")
            setReason("")
            setIssueId(null)
        }
    }

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault()
        if (quantity < 1) return
        if (!issuedTo.trim()) { toast.error("Please enter who this is issued to"); return }
        if (quantity > stocks) { toast.error(`Only ${stocks} in stock`); return }

        setLoading(true)
        const result = await issueStock(id, quantity, issuedTo.trim(), reason.trim() || undefined)
        setLoading(false)

        if (result?.success && result.issueId) {
            toast.success(`Issued ${quantity} unit(s) of ${name} to ${issuedTo}`)
            setIssueId(result.issueId)
        }
        if (result?.error) toast.error(result.error)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="icon-sm" variant="outline" className="rounded-full" title="Issue Stock">
                    <ArrowUpFromLine className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Issue Stock — {name}</DialogTitle>
                </DialogHeader>

                {issueId ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <p className="text-sm text-gray-600 text-center">
                            Stock issued successfully. Print the receipt for the recipient's signature.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => window.open(`/receipt/${issueId}`, '_blank')}
                                className="bg-orange-400 gap-2"
                            >
                                <Printer className="w-4 h-4" /> Print Receipt
                            </Button>
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500">Available: <span className="font-medium text-black">{stocks}</span></p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Field>
                                <FieldLabel>Quantity</FieldLabel>
                                <Input
                                    type="number"
                                    min={1}
                                    max={stocks}
                                    value={quantity}
                                    onChange={e => setQuantity(Number(e.target.value))}
                                    onKeyDown={e => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Issued To <span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    placeholder="e.g. Marketing Dept, John Doe"
                                    value={issuedTo}
                                    onChange={e => setIssuedTo(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Reason <span className="text-gray-400 text-xs">(optional)</span></FieldLabel>
                                <Input
                                    placeholder="e.g. Monthly supply, Project use"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </Field>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={loading || stocks === 0} className="bg-orange-400">
                                    {loading ? "Issuing..." : "Issue Stock"}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
