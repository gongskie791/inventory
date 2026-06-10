import StockIssueService from "@/lib/service/stockIssue"
import { notFound } from "next/navigation"
import { PrintButton } from "./PrintButton"

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    )
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const issue = await new StockIssueService().getById(id)
    if (!issue) notFound()

    const refNumber = `SI-${issue.id.slice(0, 8).toUpperCase()}`

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

                    <p className="text-sm font-bold mb-6">Reference No: {refNumber}</p>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Issue Details</p>
                        <Row label="Date Issued" value={issue.createdAt.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })} />
                        <Row label="Time" value={issue.createdAt.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} />
                    </section>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Item Information</p>
                        <Row label="Item Name" value={issue.item.name} />
                        <Row label="Unit" value={issue.item.unit} />
                        <Row label="Quantity Issued" value={`${issue.quantity} ${issue.item.unit}(s)`} />
                        <Row label="Unit Price" value={`₱${issue.item.price.toLocaleString()}`} />
                        <div className="flex justify-between text-sm font-bold pt-2 mt-1 border-t border-gray-300">
                            <span>Total Value</span>
                            <span>₱{(issue.item.price * issue.quantity).toLocaleString()}</span>
                        </div>
                    </section>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Issued To</p>
                        <Row label="Recipient" value={issue.issuedTo} />
                        <Row label="Reason" value={issue.reason ?? "—"} />
                    </section>

                    <div className="grid grid-cols-2 gap-10 mt-auto pt-16">
                        <div>
                            <div className="h-12 border-b border-black" />
                            <p className="text-sm font-semibold mt-1">{issue.issuedTo}</p>
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
