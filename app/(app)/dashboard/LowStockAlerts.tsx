import Link from "next/link"
import { StockBadge } from "../inventory/StockBadge"
import { ItemWithSupplier } from "@/lib/repository/item"

export function LowStockAlerts({ items }: { items: ItemWithSupplier[] }) {
    return (
        <div className="bg-white border rounded-xl p-4 flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-black">Low Stock Alerts</p>
                <Link href="/inventory" className="text-xs text-orange-500 hover:underline">View all</Link>
            </div>
            {items.length === 0 ? (
                <p className="text-sm text-gray-400">All items are well stocked.</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="text-left pb-2 font-medium">Item</th>
                            <th className="text-left pb-2 font-medium">Supplier</th>
                            <th className="text-left pb-2 font-medium">Stocks</th>
                            <th className="text-left pb-2 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-b last:border-0">
                                <td className="py-2 font-medium text-black">{item.name}</td>
                                <td className="py-2 text-gray-500">{item.supplier.name}</td>
                                <td className="py-2 text-black">{item.stocks}</td>
                                <td className="py-2"><StockBadge stocks={item.stocks} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
