import { Building2, Package } from "lucide-react"

type Props = {
    totalSuppliers: number
    totalItems: number
}

export function SupplierStats({ totalSuppliers, totalItems }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Total Suppliers</p>
                    <p className="text-2xl font-semibold text-black">{totalSuppliers}</p>
                </div>
            </div>
            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                    <Package className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Total Items Supplied</p>
                    <p className="text-2xl font-semibold text-black">{totalItems}</p>
                </div>
            </div>
        </div>
    )
}
