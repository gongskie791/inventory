import OrderService from "@/lib/service/order"
import { notFound } from "next/navigation"
import { PrintButton } from "../../[id]/PrintButton"

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
    const order = await new OrderService().getById(id)
    if (!order) notFound()

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
                        <h1 className="text-2xl font-bold tracking-wide">GOODS RECEIVED NOTE</h1>
                        <p className="text-sm text-gray-500 mt-1">Inventory Management System</p>
                    </div>

                    <p className="text-sm font-bold mb-6">Order No: {`ORD-${order.id.slice(0, 8).toUpperCase()}`}</p>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Supplier</p>
                        <Row label="Supplier Name" value={order.supplier.name} />
                    </section>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Receipt Details</p>
                        <Row label="Date Received" value={order.updatedAt.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })} />
                        <Row label="Time" value={order.updatedAt.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} />
                    </section>

                    <section className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3">Items Received</p>
                        <div className="grid grid-cols-5 text-xs text-gray-500 pb-1 mb-1 border-b border-gray-100">
                            <span className="col-span-2">Item</span>
                            <span className="text-center">Qty</span>
                            <span className="text-right">Unit Price</span>
                            <span className="text-right">Subtotal</span>
                        </div>
                        {order.items.map(oi => (
                            <div key={oi.id} className="grid grid-cols-5 text-sm py-1 border-b border-gray-50">
                                <span className="col-span-2 font-medium">{oi.item.name}</span>
                                <span className="text-center text-gray-500">{oi.quantity}</span>
                                <span className="text-right text-gray-500">₱{oi.price.toLocaleString()}</span>
                                <span className="text-right font-semibold">₱{(oi.price * oi.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-2 mt-1 border-t border-gray-300">
                            <span>Total Amount</span>
                            <span>₱{order.totalAmount.toLocaleString()}</span>
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-10 mt-auto pt-16">
                        <div>
                            <div className="h-12 border-b border-black" />
                            <p className="text-sm font-semibold mt-1">Receiving Personnel</p>
                            <p className="text-xs text-gray-500">Received by (Signature over Printed Name)</p>
                        </div>
                        <div>
                            <div className="h-12 border-b border-black" />
                            <p className="text-sm font-semibold mt-1">Authorized Personnel</p>
                            <p className="text-xs text-gray-500">Approved by (Signature over Printed Name)</p>
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
