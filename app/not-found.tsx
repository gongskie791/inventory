import Link from "next/link"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
            <div className="bg-orange-50 p-6 rounded-full">
                <PackageSearch className="w-12 h-12 text-orange-400" />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-black">404</h1>
                <p className="text-gray-500 mt-1">Page not found</p>
            </div>
            <Link href="/">
                <Button className="bg-orange-400 hover:bg-orange-500">Go to Dashboard</Button>
            </Link>
        </div>
    )
}
