"use client"

import { Fragment, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, Printer } from "lucide-react"
import Link from "next/link"
import { StockIssueWithItem } from "@/lib/repository/stockIssue"

type Row =
    | { type: 'single'; issue: StockIssueWithItem }
    | { type: 'bulk'; bulkId: string; representative: StockIssueWithItem; items: StockIssueWithItem[] }

export function OutboundTable({ issues }: { issues: StockIssueWithItem[] }) {
    const [expandedBulkId, setExpandedBulkId] = useState<string | null>(null)

    const seen = new Set<string>()
    const rows: Row[] = []
    for (const issue of issues) {
        if (issue.bulkId) {
            if (!seen.has(issue.bulkId)) {
                seen.add(issue.bulkId)
                rows.push({
                    type: 'bulk',
                    bulkId: issue.bulkId,
                    representative: issue,
                    items: issues.filter(i => i.bulkId === issue.bulkId),
                })
            }
        } else {
            rows.push({ type: 'single', issue })
        }
    }

    return (
        <Table>
            <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead className="w-6" />
                    <TableHead className="text-black">Ref No</TableHead>
                    <TableHead className="text-black">Item</TableHead>
                    <TableHead className="text-black">Unit</TableHead>
                    <TableHead className="text-black">Qty Issued</TableHead>
                    <TableHead className="text-black">Issued To</TableHead>
                    <TableHead className="text-black">Reason</TableHead>
                    <TableHead className="text-black">Date</TableHead>
                    <TableHead className="text-black">Receipt</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                            No stock issues recorded yet.
                        </TableCell>
                    </TableRow>
                ) : rows.map(row => {
                    if (row.type === 'single') {
                        const { issue } = row
                        return (
                            <TableRow key={issue.id} className="hover:bg-gray-50">
                                <TableCell />
                                <TableCell className="text-black font-mono text-xs">{`SI-${issue.id.slice(0, 8).toUpperCase()}`}</TableCell>
                                <TableCell className="text-black font-medium">{issue.item.name}</TableCell>
                                <TableCell className="text-black">{issue.item.unit}</TableCell>
                                <TableCell className="text-black">{issue.quantity}</TableCell>
                                <TableCell className="text-black">{issue.issuedTo}</TableCell>
                                <TableCell className="text-gray-500">{issue.reason ?? "—"}</TableCell>
                                <TableCell className="text-black">{issue.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Link href={`/receipt/${issue.id}`} target="_blank">
                                        <button className="flex items-center gap-1 text-xs text-orange-500 hover:underline">
                                            <Printer className="w-3 h-3" /> Print
                                        </button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )
                    }

                    const { bulkId, representative: rep, items } = row
                    const isExpanded = expandedBulkId === bulkId
                    const totalQty = items.reduce((s, i) => s + i.quantity, 0)

                    return (
                        <Fragment key={bulkId}>
                            <TableRow
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => setExpandedBulkId(isExpanded ? null : bulkId)}
                            >
                                <TableCell className="text-gray-400">
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </TableCell>
                                <TableCell>
                                    <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-xs font-medium">BULK</span>
                                </TableCell>
                                <TableCell className="text-black font-medium">{items.length} items</TableCell>
                                <TableCell className="text-black">—</TableCell>
                                <TableCell className="text-black">{totalQty}</TableCell>
                                <TableCell className="text-black">{rep.issuedTo}</TableCell>
                                <TableCell className="text-gray-500">{rep.reason ?? "—"}</TableCell>
                                <TableCell className="text-black">{rep.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell onClick={e => e.stopPropagation()}>
                                    <Link href={`/receipt/bulk?bulkId=${bulkId}`} target="_blank">
                                        <button className="flex items-center gap-1 text-xs text-orange-500 hover:underline">
                                            <Printer className="w-3 h-3" /> Print
                                        </button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            {isExpanded && (
                                <TableRow className="bg-gray-50">
                                    <TableCell colSpan={9} className="px-8 pb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left pb-1 font-medium">Item</th>
                                                    <th className="text-left pb-1 font-medium">Unit</th>
                                                    <th className="text-left pb-1 font-medium">Qty</th>
                                                    <th className="text-left pb-1 font-medium">Unit Price</th>
                                                    <th className="text-left pb-1 font-medium">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map(item => (
                                                    <tr key={item.id} className="border-b last:border-0">
                                                        <td className="py-1 font-medium">{item.item.name}</td>
                                                        <td className="py-1">{item.item.unit}</td>
                                                        <td className="py-1">{item.quantity}</td>
                                                        <td className="py-1">₱{item.item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        <td className="py-1">₱{(item.item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </TableCell>
                                </TableRow>
                            )}
                        </Fragment>
                    )
                })}
            </TableBody>
        </Table>
    )
}
