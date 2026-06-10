import { OrderStatus } from "@/lib/generated/prisma/client"
import OrderService from "@/lib/service/order"
import SupplierService from "@/lib/service/supplier"
import { ItemService } from "@/lib/service/item"
import CreateOrderDialog from "./CreateOrderDialog"
import { OrdersTable } from "./OrdersTable"
import { OrderStats } from "./OrderStats"
import { StatusFilter } from "./StatusFilter"
import { Pagination } from "@/components/pagination"
import { Suspense } from "react"

const PAGE_SIZE = 10
const VALID_STATUSES = ["pending", "approved", "received", "cancelled"]

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string, status?: string }> }) {
    const { page: pageParam, status: statusParam } = await searchParams
    const page   = Math.max(1, parseInt(pageParam ?? '1') || 1)
    const status = VALID_STATUSES.includes(statusParam ?? '') ? statusParam as OrderStatus : undefined

    const orderService = new OrderService()
    const [{ orders, total }, stats, suppliers, items] = await Promise.all([
        orderService.getPaginated(page, PAGE_SIZE, status),
        orderService.getStats(),
        new SupplierService().getAllSupplier(),
        new ItemService().getAllItems(),
    ])

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    return (
        <div className="flex flex-col flex-1">
            <div className="flex items-center justify-end">
                <CreateOrderDialog suppliers={suppliers} items={items} />
            </div>
            <OrderStats {...stats} />
            <Suspense>
                <StatusFilter current={statusParam ?? ''} />
            </Suspense>
            <div className="h-full rounded-lg overflow-x-auto">
                <OrdersTable orders={orders} />
            </div>
            <div className="flex justify-end mt-2">
                <Pagination page={page} totalPages={totalPages} basePath="/orders" />
            </div>
        </div>
    )
}
