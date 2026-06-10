import { Package, Building2, ShoppingCart, TrendingUp } from "lucide-react"

type Props = {
    totalItems: number
    totalSuppliers: number
    totalOrders: number
    totalSpend: number
}

const cards = [
    { key: "totalItems",     label: "Total Items",     icon: Package,      bg: "bg-blue-50",   color: "text-blue-500"   },
    { key: "totalSuppliers", label: "Total Suppliers", icon: Building2,    bg: "bg-purple-50", color: "text-purple-500" },
    { key: "totalOrders",    label: "Total Orders",    icon: ShoppingCart, bg: "bg-orange-50", color: "text-orange-500" },
    { key: "totalSpend",     label: "Total Spend",     icon: TrendingUp,   bg: "bg-green-50",  color: "text-green-500"  },
] as const

export function SummaryCards({ totalItems, totalSuppliers, totalOrders, totalSpend }: Props) {
    const values = { totalItems, totalSuppliers, totalOrders, totalSpend }

    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map(({ key, label, icon: Icon, bg, color }) => (
                <div key={key} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                    <div className={`${bg} p-3 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-2xl font-semibold text-black">
                            {key === "totalSpend"
                                ? `₱${values[key].toLocaleString()}`
                                : values[key]}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
