"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { PieChart, Pie } from "recharts"
import { Package, TrendingUp, AlertTriangle } from "lucide-react"

type Props = {
    total: number
    inStock: number
    lowStock: number
    outOfStock: number
    totalValue: number
}

const chartConfig = {
    inStock:    { label: "In Stock",     color: "#16a34a" },
    lowStock:   { label: "Low Stock",    color: "#ca8a04" },
    outOfStock: { label: "Out of Stock", color: "#dc2626" },
} satisfies ChartConfig

export function InventoryStats({ total, inStock, lowStock, outOfStock, totalValue }: Props) {
    const chartData = [
        { name: "inStock",    value: inStock,    fill: "#16a34a" },
        { name: "lowStock",   value: lowStock,   fill: "#ca8a04" },
        { name: "outOfStock", value: outOfStock, fill: "#dc2626" },
    ].filter(d => d.value > 0)

    return (
        <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Total Items</p>
                    <p className="text-2xl font-semibold text-black">{total}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="text-2xl font-semibold text-orange-500">₱{totalValue.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Low / Out of Stock</p>
                    <p className="text-2xl font-semibold text-black">
                        <span className="text-yellow-600">{lowStock}</span>
                        <span className="text-gray-300 mx-1">/</span>
                        <span className="text-red-600">{outOfStock}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <ChartContainer config={chartConfig} className="w-16 h-16 shrink-0">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={18} outerRadius={28} strokeWidth={0} />
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-col gap-1 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" /><span className="text-gray-600">{inStock} in stock</span></span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-600 inline-block" /><span className="text-gray-600">{lowStock} low</span></span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block" /><span className="text-gray-600">{outOfStock} out</span></span>
                </div>
            </div>
        </div>
    )
}
