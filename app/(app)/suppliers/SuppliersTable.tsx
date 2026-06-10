"use client"
import { Fragment, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight } from "lucide-react"
import { SupplierWithItems } from "@/lib/service/supplier"
import UpdateSupplierDialog from "./UpdateSupplierDialog"
import { DeleteSupplierButton } from "./DeleteSupplierButton"
import { StockBadge } from "../inventory/StockBadge"

export function SuppliersTable({ suppliers }: { suppliers: SupplierWithItems[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    function toggle(id: string) {
        setExpandedId(prev => prev === id ? null : id)
    }

    return (
        <Table>
            <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead className="w-6" />
                    <TableHead className="text-black">Name</TableHead>
                    <TableHead className="text-black">Contact</TableHead>
                    <TableHead className="text-black">Email</TableHead>
                    <TableHead className="text-black">Phone</TableHead>
                    <TableHead className="text-black">Address</TableHead>
                    <TableHead className="text-black">Items</TableHead>
                    <TableHead className="text-black">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {suppliers.map((sup) => (
                    <Fragment key={sup.id}>
                        <TableRow
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggle(sup.id)}
                        >
                            <TableCell className="text-gray-400">
                                {expandedId === sup.id
                                    ? <ChevronDown className="w-4 h-4" />
                                    : <ChevronRight className="w-4 h-4" />}
                            </TableCell>
                            <TableCell className="text-black font-medium">{sup.name}</TableCell>
                            <TableCell className="text-black">{sup.contact}</TableCell>
                            <TableCell className="text-black">{sup.email}</TableCell>
                            <TableCell className="text-black">{sup.phone}</TableCell>
                            <TableCell className="text-black">{sup.address}</TableCell>
                            <TableCell className="text-black">{sup.items.length} item(s)</TableCell>
                            <TableCell onClick={e => e.stopPropagation()}>
                                <div className="flex items-center gap-2">
                                    <UpdateSupplierDialog {...sup} />
                                    {sup._count.orders === 0 && sup.items.length === 0 && <DeleteSupplierButton id={sup.id} />}
                                </div>
                            </TableCell>
                        </TableRow>
                        {expandedId === sup.id && (
                            <TableRow key={`${sup.id}-expanded`} className="bg-gray-50">
                                <TableCell colSpan={8} className="px-8 pb-4">
                                    {sup.items.length === 0 ? (
                                        <p className="text-sm text-gray-400">No items for this supplier.</p>
                                    ) : (
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left pb-1 font-medium">Item</th>
                                                    <th className="text-left pb-1 font-medium">Category</th>
                                                    <th className="text-left pb-1 font-medium">Price</th>
                                                    <th className="text-left pb-1 font-medium">Stocks</th>
                                                    <th className="text-left pb-1 font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sup.items.map(item => (
                                                    <tr key={item.id} className="border-b last:border-0">
                                                        <td className="py-1">{item.name}</td>
                                                        <td className="py-1">{item.category}</td>
                                                        <td className="py-1">₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        <td className="py-1">{item.stocks}</td>
                                                        <td className="py-1"><StockBadge stocks={item.stocks} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
