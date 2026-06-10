import StockIssueService from "@/lib/service/stockIssue"
import { notFound } from "next/navigation"
import { PrintButton } from "../[id]/PrintButton"

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    )
}

export default async function Page({ searchParams }: { searchParams: Promise<{ bulkId?: string }> }) {
    const { bulkId } = await searchParams
    if (!bulkId) notFound()

    const issues = await new StockIssueService().getByBulkId(bulkId)
    if (issues.length === 0) notFound()

    const first = issues[0]
    const totalValue = issues.reduce((sum, i) => sum + i.item.price * i.quantity, 0)

    return (
        <>
            <style>{`
                @page { margin: 0; size: A4; }
                @media print {
                    body * { visibility: hidden; }
                    #receipt-wrapper, #receipt-wrapper * { visibility: visible; }
                    #receipt-wrapper {
                        position: absolute;
                        top: 0; left: 0;
                        width: 100%;
                        height: 297mm;
                        display: flex;
                        justify-content: center;
                        padding: 40px 0;
                    }
                    #receipt-inner {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }
                }
            `}</style>

            <div id="receipt-wrapper" className="flex justify-center w-full flex-1">
                <div id="receipt-inner" className="w-full max-w-xl px-8 font-sans text-black flex flex-col flex-1">

                    <div className="text-center border-b-2 border-black pb-4 mb-6">
                        <h1 className="text-2xl font-bold tracking-wide">STOCK ISSUE RECEIPT</h1>
                        <p className="text-sm text-gray-500 mt-1">Inventory Management System</p>
                    </div>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Issue Details</p>
                        <Row label="Date Issued" value={first.createdAt.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })} />
                        <Row label="Time" value={first.createdAt.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} />
                        <Row label="Issued To" value={first.issuedTo} />
                        <Row label="Reason" value={first.reason ?? "—"} />
                    </section>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Items Issued</p>
                        <div className="grid grid-cols-5 text-xs text-gray-500 pb-1 mb-1 border-b border-gray-100">
                            <span className="col-span-2">Item</span>
                            <span className="text-center">Qty</span>
                            <span className="text-right">Unit Price</span>
                            <span className="text-right">Subtotal</span>
                        </div>
                        {issues.map(issue => (
                            <div key={issue.id} className="grid grid-cols-5 text-sm py-1.5 border-b border-gray-50">
                                <span className="col-span-2 font-medium">{issue.item.name}</span>
                                <span className="text-center text-gray-500">{issue.quantity} {issue.item.unit}(s)</span>
                                <span className="text-right text-gray-500">₱{issue.item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span className="text-right font-semibold">₱{(issue.item.price * issue.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-2 mt-1 border-t border-gray-300">
                            <span>Total Value</span>
                            <span>₱{totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-10 mt-auto pt-16">
                        <div>
                            <div className="h-12 border-b border-black" />
                            <p className="text-sm font-semibold mt-1">{first.issuedTo}</p>
                            <p className="text-xs text-gray-500">Received by (Signature over Printed Name)</p>
                        </div>
                        <div>
                            <div className="h-12 border-b border-black" />
                            <p className="text-sm font-semibold mt-1">Authorized Personnel</p>
                            <p className="text-xs text-gray-500">Issued by (Signature over Printed Name)</p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8 print:hidden">
                        <PrintButton />
                    </div>

                </div>
            </div>
        </>
    )
}
