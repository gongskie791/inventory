function getStockStatus(stocks: number) {
    if (stocks <= 0)  return { label: "Out of Stock", style: "bg-red-100 text-red-800 border-red-300" }
    if (stocks <= 10) return { label: "Low Stock",    style: "bg-yellow-100 text-yellow-800 border-yellow-300" }
    return             { label: "In Stock",           style: "bg-green-100 text-green-800 border-green-300" }
}

export function StockBadge({ stocks }: { stocks: number }) {
    const { label, style } = getStockStatus(stocks)
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${style}`}>
            {label}
        </span>
    )
}
