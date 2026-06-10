import { ItemService } from "@/lib/service/item"
import SupplierService from "@/lib/service/supplier"
import OrderService from "@/lib/service/order"
import { SummaryCards } from "./dashboard/SummaryCards"
import { OrdersStatusChart } from "./dashboard/OrdersStatusChart"
import { StockHealthChart } from "./dashboard/StockHealthChart"
import { LowStockAlerts } from "./dashboard/LowStockAlerts"
import { PendingOrdersAlerts } from "./dashboard/PendingOrdersAlerts"

export default async function Page() {
    const [itemStats, supplierStats, orderStats, lowStockItems, pendingOrders] = await Promise.all([
        new ItemService().getStats(),
        new SupplierService().getStats(),
        new OrderService().getStats(),
        new ItemService().getLowStock(5),
        new OrderService().getPaginated(1, 5, "pending"),
    ])

    return (
        <div className="flex flex-col gap-4">
            <SummaryCards
                totalItems={itemStats.total}
                totalSuppliers={supplierStats.totalSuppliers}
                totalOrders={orderStats.total}
                totalSpend={orderStats.totalSpend}
            />

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <OrdersStatusChart
                        pending={orderStats.pending}
                        approved={orderStats.approved}
                        received={orderStats.received}
                        cancelled={orderStats.cancelled}
                    />
                </div>
                <StockHealthChart
                    inStock={itemStats.inStock}
                    lowStock={itemStats.lowStock}
                    outOfStock={itemStats.outOfStock}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 items-stretch">
                <LowStockAlerts items={lowStockItems} />
                <PendingOrdersAlerts orders={pendingOrders.orders} />
            </div>
        </div>
    )
}
