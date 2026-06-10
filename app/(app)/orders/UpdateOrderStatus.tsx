"use client"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { updateOrderStatus } from "@/lib/action/order"
import { toast } from "sonner"

const statusStyles: Record<string, string> = {
    pending:   "bg-yellow-100 text-yellow-800 border-yellow-300",
    approved:  "bg-blue-100 text-blue-800 border-blue-300",
    received:  "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
}

const statusLabels: Record<string, string> = {
    pending:   "Pending",
    approved:  "Approved",
    received:  "Received",
    cancelled: "Cancelled",
}

export function UpdateOrderStatus({ id, status }: { id: string, status: string }) {
    const badgeClass = `inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[status] ?? ""}`

    if (status === 'received' || status === 'cancelled') {
        return <span className={badgeClass}>{statusLabels[status]}</span>
    }

    async function handleChange(value: string) {
        const result = await updateOrderStatus({
            id,
            status: value as "pending" | "approved" | "received" | "cancelled"
        })
        if (result?.success) toast.success("Status updated!")
        if (result?.error) toast.error(result.error)
    }

    const nextOptions = status === 'pending'
        ? [{ value: 'approved', label: 'Approved' }]
        : [{ value: 'received', label: 'Received' }]

    return (
        <Select defaultValue={status} onValueChange={handleChange}>
            <SelectTrigger className={`w-28 h-6 rounded-full border px-2 text-xs font-medium ${statusStyles[status] ?? ""}`}>
                {statusLabels[status] ?? status}
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white text-black">
                {nextOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
