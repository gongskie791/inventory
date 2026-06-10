import { ShoppingCart, TrendingUp, Clock, CheckCheck } from "lucide-react"

type Props = {
    total: number
    pending: number
    approved: number
    received: number
    cancelled: number
    totalSpend: number
}

export function OrderStats({ total, pending, approved, received, cancelled, totalSpend }: Props) {
    return (
        <div className="grid grid-cols-4 gap-4 mt-2 mb-2">
            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold text-black">{total}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Total Spend</p>
                    <p className="text-2xl font-semibold text-orange-500">₱{totalSpend.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Pending / Approved</p>
                    <p className="text-2xl font-semibold text-black">
                        <span className="text-yellow-600">{pending}</span>
                        <span className="text-gray-300 mx-1">/</span>
                        <span className="text-blue-600">{approved}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                    <CheckCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Received / Cancelled</p>
                    <p className="text-2xl font-semibold text-black">
                        <span className="text-green-600">{received}</span>
                        <span className="text-gray-300 mx-1">/</span>
                        <span className="text-red-600">{cancelled}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
