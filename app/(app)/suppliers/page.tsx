import AddSupplierDialog from "./AddSupplierdialog"
import SupplierService from "@/lib/service/supplier"
import { SuppliersTable } from "./SuppliersTable"
import { SupplierStats } from "./SupplierStats"
import { Pagination } from "@/components/pagination"
import { SearchInput } from "@/components/search-input"
import { Suspense } from "react"

const PAGE_SIZE = 10

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
    const { page: pageParam, search } = await searchParams
    const page = Math.max(1, parseInt(pageParam ?? '1') || 1)

    const service = new SupplierService()
    const [{ suppliers, total }, stats] = await Promise.all([
        service.getPaginated(page, PAGE_SIZE, search),
        service.getStats(),
    ])

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    return (
        <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
                <Suspense><SearchInput placeholder="Search supplier..." /></Suspense>
                <AddSupplierDialog />
            </div>
            <SupplierStats {...stats} />
            <div className="h-full rounded-lg overflow-hidden mt-2">
                <SuppliersTable suppliers={suppliers} />
            </div>
            <div className="flex justify-end mt-2">
                <Pagination page={page} totalPages={totalPages} basePath="/suppliers" />
            </div>
        </div>
    )
}
