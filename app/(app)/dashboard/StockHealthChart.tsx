"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { PieChart, Pie } from "recharts"

type Props = {
    inStock: number
    lowStock: number
    outOfStock: number
}

const chartConfig = {
    inStock:    { label: "In Stock",     color: "#16a34a" },
    lowStock:   { label: "Low Stock",    color: "#ca8a04" },
    outOfStock: { label: "Out of Stock", color: "#dc2626" },
} satisfies ChartConfig

export function StockHealthChart({ inStock, lowStock, outOfStock }: Props) {
    const data = [
        { name: "inStock",    value: inStock,    fill: "#16a34a" },
        { name: "lowStock",   value: lowStock,   fill: "#ca8a04" },
        { name: "outOfStock", value: outOfStock, fill: "#dc2626" },
    ].filter(d => d.value > 0)

    return (
        <div className="bg-white border rounded-xl p-4 flex flex-col h-full">
            <p className="text-sm font-medium text-black mb-2">Stock Health</p>
            <div className="flex flex-1 items-center justify-center gap-6">
                <ChartContainer config={chartConfig} className="w-32 h-32 shrink-0">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50} strokeWidth={0} />
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-col gap-2 text-sm">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600 inline-block" /><span className="text-gray-600">In Stock <span className="font-semibold text-black">{inStock}</span></span></span>
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-600 inline-block" /><span className="text-gray-600">Low Stock <span className="font-semibold text-black">{lowStock}</span></span></span>
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" /><span className="text-gray-600">Out of Stock <span className="font-semibold text-black">{outOfStock}</span></span></span>
                </div>
            </div>
        </div>
    )
}
