import { LoginForm } from "@/components/login-form"
import { Package } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <div className="flex items-center gap-2 font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-orange-400 text-white">
                            <Package className="size-4" />
                        </div>
                        Inventory System
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:flex flex-col items-center justify-center bg-linear-to-br from-orange-400 to-orange-600 text-white p-12">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 mb-6">
                    <Package className="size-9 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-center">Inventory System</h2>
                <p className="text-orange-100 text-center max-w-sm mb-10 text-sm">
                    Manage your stock, orders, and suppliers in one place.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    {[
                        { label: "Real-time stock tracking" },
                        { label: "Order & supplier management" },
                        { label: "Analytics dashboard" },
                        { label: "Printable receipts" },
                    ].map(({ label }) => (
                        <div key={label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-sm">
                            <div className="size-2 rounded-full bg-white" />
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
