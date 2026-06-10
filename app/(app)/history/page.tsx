import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StockIssueService from "@/lib/service/stockIssue"
import OrderService from "@/lib/service/order"
import StockAdjustmentService from "@/lib/service/stockAdjustment"
import { Pagination } from "@/components/pagination"
import { Printer } from "lucide-react"
import Link from "next/link"
import { HistoryFilters } from "./HistoryFilters"
import { HistoryTabs } from "./HistoryTabs"
import { OutboundTable } from "./OutboundTable"
import { Suspense } from "react"

const PAGE_SIZE = 15

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; ipage?: string; apage?: string; search?: string; issuedTo?: string; from?: string; to?: string; tab?: string }> }) {
    const { page: pageParam, ipage: ipageParam, apage: apageParam, search, issuedTo, from, to, tab } = await searchParams
    const activeTab = tab === "inbound" ? "inbound" : tab === "adjustments" ? "adjustments" : "outbound"
    const page  = Math.max(1, parseInt(pageParam  ?? '1') || 1)
    const ipage = Math.max(1, parseInt(ipageParam ?? '1') || 1)
    const apage = Math.max(1, parseInt(apageParam ?? '1') || 1)

    const [outboundResult, inboundResult, adjustmentResult] = await Promise.all([
        new StockIssueService().getPaginated(page, PAGE_SIZE, { search, issuedTo, from, to }),
        new OrderService().getReceived(ipage, PAGE_SIZE),
        new StockAdjustmentService().getPaginated(apage, PAGE_SIZE),
    ])
    const { issues, total } = outboundResult
    const { orders: receivedOrders, total: inboundTotal } = inboundResult
    const { adjustments, total: adjustmentTotal } = adjustmentResult
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const inboundTotalPages = Math.max(1, Math.ceil(inboundTotal / PAGE_SIZE))

    const outbound = (
        <div className="flex flex-col flex-1 mt-4">
            <Suspense>
                <HistoryFilters current={{ search: search ?? '', issuedTo: issuedTo ?? '', from: from ?? '', to: to ?? '' }} />
            </Suspense>
            <div className="h-full rounded-lg overflow-x-auto">
                <OutboundTable issues={issues} />
            </div>
            <div className="flex justify-end mt-2">
                <Pagination page={page} totalPages={totalPages} basePath="/history" />
            </div>
        </div>
    )

    const inbound = (
        <div className="flex flex-col flex-1 mt-4">
            <div className="h-full rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="text-black">Order #</TableHead>
                            <TableHead className="text-black">Item</TableHead>
                            <TableHead className="text-black">Unit</TableHead>
                            <TableHead className="text-black">Qty Received</TableHead>
                            <TableHead className="text-black">Supplier</TableHead>
                            <TableHead className="text-black">Date Received</TableHead>
                            <TableHead className="text-black">Receipt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {receivedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                                    No received orders yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            receivedOrders.flatMap(order =>
                                order.items.map(oi => (
                                    <TableRow key={`${order.id}-${oi.id}`} className="hover:bg-gray-50">
                                        <TableCell className="text-black font-medium font-mono text-xs">{`ORD-${order.id.slice(0, 8).toUpperCase()}`}</TableCell>
                                        <TableCell className="text-black">{oi.item.name}</TableCell>
                                        <TableCell className="text-black">{oi.item.unit}</TableCell>
                                        <TableCell className="text-green-600 font-medium">+{oi.quantity}</TableCell>
                                        <TableCell className="text-black">{order.supplier.name}</TableCell>
                                        <TableCell className="text-black">{order.updatedAt.toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Link href={`/receipt/order/${order.id}`} target="_blank">
                                                <button className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                                                    <Printer className="w-3 h-3" /> Print
                                                </button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end mt-2">
                <Pagination page={ipage} totalPages={inboundTotalPages} basePath="/history" paramName="ipage" extraParams={{ tab: 'inbound' }} />
            </div>
        </div>
    )

    const adjustmentTotalPages = Math.max(1, Math.ceil(adjustmentTotal / PAGE_SIZE))

    const adjustmentsTab = (
        <div className="flex flex-col flex-1 mt-4">
            <div className="h-full rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="text-black">Item</TableHead>
                            <TableHead className="text-black">Unit</TableHead>
                            <TableHead className="text-black">Before</TableHead>
                            <TableHead className="text-black">After</TableHead>
                            <TableHead className="text-black">Change</TableHead>
                            <TableHead className="text-black">Reason</TableHead>
                            <TableHead className="text-black">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {adjustments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                                    No stock adjustments recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            adjustments.map(adj => {
                                const diff = adj.newStock - adj.previousStock
                                return (
                                    <TableRow key={adj.id} className="hover:bg-gray-50">
                                        <TableCell className="text-black font-medium">{adj.item.name}</TableCell>
                                        <TableCell className="text-black">{adj.item.unit}</TableCell>
                                        <TableCell className="text-black">{adj.previousStock}</TableCell>
                                        <TableCell className="text-black">{adj.newStock}</TableCell>
                                        <TableCell className={diff > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                            {diff > 0 ? `+${diff}` : diff}
                                        </TableCell>
                                        <TableCell className="text-gray-500">{adj.reason ?? '—'}</TableCell>
                                        <TableCell className="text-black">{adj.createdAt.toLocaleDateString()}</TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end mt-2">
                <Pagination page={apage} totalPages={adjustmentTotalPages} basePath="/history" paramName="apage" extraParams={{ tab: 'adjustments' }} />
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 flex-1">
            <Suspense>
                <HistoryTabs activeTab={activeTab} outbound={outbound} inbound={inbound} adjustments={adjustmentsTab} />
            </Suspense>
        </div>
    )
}
