import Link from "next/link"
import { OrderWithDetails } from "@/lib/repository/order"

const statusStyles: Record<string, string> = {
    pending:  "bg-yellow-100 text-yellow-800 border-yellow-300",
    approved: "bg-blue-100 text-blue-800 border-blue-300",
}

export function PendingOrdersAlerts({ orders }: { orders: OrderWithDetails[] }) {
    return (
        <div className="bg-white border rounded-xl p-4 flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-black">Pending Orders</p>
                <Link href="/orders?status=pending" className="text-xs text-orange-500 hover:underline">View all</Link>
            </div>
            {orders.length === 0 ? (
                <p className="text-sm text-gray-400">No pending orders.</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="text-left pb-2 font-medium">Order #</th>
                            <th className="text-left pb-2 font-medium">Supplier</th>
                            <th className="text-left pb-2 font-medium">Total</th>
                            <th className="text-left pb-2 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b last:border-0">
                                <td className="py-2 font-medium text-black">{`ORD-${order.id.slice(0, 8).toUpperCase()}`}</td>
                                <td className="py-2 text-gray-500">{order.supplier.name}</td>
                                <td className="py-2 text-black">₱{order.totalAmount.toLocaleString()}</td>
                                <td className="py-2">
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[order.status] ?? ""}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
