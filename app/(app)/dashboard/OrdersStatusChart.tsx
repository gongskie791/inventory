"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

type Props = {
    pending: number
    approved: number
    received: number
    cancelled: number
}

const chartConfig = {
    count: { label: "Orders" },
} satisfies ChartConfig

export function OrdersStatusChart({ pending, approved, received, cancelled }: Props) {
    const data = [
        { status: "Pending",   count: pending,   fill: "#ca8a04" },
        { status: "Approved",  count: approved,  fill: "#3b82f6" },
        { status: "Received",  count: received,  fill: "#16a34a" },
        { status: "Cancelled", count: cancelled, fill: "#dc2626" },
    ]

    return (
        <div className="bg-white border rounded-xl p-4">
            <p className="text-sm font-medium text-black mb-4">Orders by Status</p>
            <ChartContainer config={chartConfig} className="h-48 w-full">
                <BarChart data={data} barSize={40}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
