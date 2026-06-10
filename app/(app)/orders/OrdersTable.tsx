"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderWithDetails } from "@/lib/repository/order"
import { ChevronDown, ChevronRight, Printer } from "lucide-react"
import { Fragment, useState } from "react"
import Link from "next/link"
import { UpdateOrderStatus } from "./UpdateOrderStatus"
import { CancelOrderButton } from "./CancelOrderButton"

export function OrdersTable({ orders }: { orders: OrderWithDetails[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    function toggle(id: string) {
        setExpandedId(prev => prev === id ? null : id)
    }

    return (
        <Table>
            <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead className="w-6" />
                    <TableHead className="text-black">Order #</TableHead>
                    <TableHead className="text-black">Supplier</TableHead>
                    <TableHead className="text-black">Items</TableHead>
                    <TableHead className="text-black">Total</TableHead>
                    <TableHead className="text-black">Status</TableHead>
                    <TableHead className="text-black">Date</TableHead>
                    <TableHead className="text-black">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <Fragment key={order.id}>
                        <TableRow
                            key={order.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggle(order.id)}
                        >
                            <TableCell className="text-gray-400">
                                {expandedId === order.id
                                    ? <ChevronDown className="w-4 h-4" />
                                    : <ChevronRight className="w-4 h-4" />}
                            </TableCell>
                            <TableCell className="text-black font-medium font-mono text-xs">{`ORD-${order.id.slice(0, 8).toUpperCase()}`}</TableCell>
                            <TableCell className="text-black">{order.supplier.name}</TableCell>
                            <TableCell className="text-black">{order.items.length} item(s)</TableCell>
                            <TableCell className="text-black">₱{order.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell onClick={e => e.stopPropagation()}>
                                <UpdateOrderStatus id={order.id} status={order.status} />
                            </TableCell>
                            <TableCell className="text-black">{order.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell onClick={e => e.stopPropagation()}>
                                <div className="flex items-center gap-2">
                                    {(order.status === 'pending' || order.status === 'approved') && (
                                        <CancelOrderButton id={order.id} />
                                    )}
                                    {order.status === 'received' && (
                                        <Link href={`/receipt/order/${order.id}`} target="_blank">
                                            <button className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                                                <Printer className="w-3 h-3" /> Print
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                        {expandedId === order.id && (
                            <TableRow key={`${order.id}-expanded`} className="bg-gray-50">
                                <TableCell colSpan={8} className="px-8 pb-4">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-gray-500 border-b">
                                                <th className="text-left pb-1 font-medium">Item</th>
                                                <th className="text-left pb-1 font-medium">Unit</th>
                                                <th className="text-left pb-1 font-medium">Qty/Bundle</th>
                                                <th className="text-left pb-1 font-medium">Ordered</th>
                                                <th className="text-left pb-1 font-medium">Price</th>
                                                <th className="text-left pb-1 font-medium">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map(oi => (
                                                <tr key={oi.id} className="border-b last:border-0">
                                                    <td className="py-1">{oi.item.name}</td>
                                                    <td className="py-1">{oi.item.unit}</td>
                                                    <td className="py-1">{oi.item.quantity} pcs/unit</td>
                                                    <td className="py-1">{oi.quantity}</td>
                                                    <td className="py-1">₱{oi.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td className="py-1">₱{(oi.price * oi.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {order.status === 'cancelled' && order.cancellationReason && (
                                        <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                            <span className="font-medium shrink-0">Cancellation Reason:</span>
                                            <span>{order.cancellationReason}</span>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </Fragment>
                ))}
            </TableBody>
        </Table>
    )
}
