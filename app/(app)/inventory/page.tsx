import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";
import CreateInventoryDialog from "./CreateInvetoryItemDialog";
import { ItemService } from "@/lib/service/item";
import { StockBadge } from "./StockBadge";
import { DeleteButton } from "./DeleteButton";
import SupplierService from "@/lib/service/supplier";
import UpdateInventoryItemDialog from "./updateInventoryItemDialog";
import { Pagination } from "@/components/pagination"
import { InventoryStats } from "./InventoryStats"
import { IssueStockDialog } from "./IssueStockDialog"
import { StockAdjustmentDialog } from "./StockAdjustmentDialog"
import { BulkIssueDialog } from "./BulkIssueDialog";
import { SearchInput } from "@/components/search-input"
import { CategoryFilter } from "./CategoryFilter"
import { Suspense } from "react"

const PAGE_SIZE = 10

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; category?: string }> }) {
    const { page: pageParam, search, category } = await searchParams
    const page = Math.max(1, parseInt(pageParam ?? '1') || 1)

    const service = new ItemService()
    const [{ items, total }, stats, suppliers, itemsWithOrders, categories, allItems] = await Promise.all([
        service.getPaginated(page, PAGE_SIZE, search, category),
        service.getStats(),
        new SupplierService().getAllSupplier(),
        service.getItemIdsWithOrders(),
        service.getCategories(),
        service.getAllItems(),
    ])

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    return (
        <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
                <Suspense><SearchInput placeholder="Search item..." /></Suspense>
                <div className="flex items-center gap-2">
                    <BulkIssueDialog items={allItems} />
                    <CreateInventoryDialog suppliers={suppliers}/>
                </div>
            </div>
            <InventoryStats {...stats} />
            <Suspense>
                <CategoryFilter categories={categories} current={category ?? ''} />
            </Suspense>
            <div className="h-full rounded-lg overflow-x-auto mt-2">
                <Table className="h-full">
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="text-black">Item Name</TableHead>
                            <TableHead className="text-black">Category</TableHead>
                            <TableHead className="text-black">Qty/Bundle</TableHead>
                            <TableHead className="text-black">Unit</TableHead>
                            <TableHead className="text-black">Price</TableHead>
                            <TableHead className="text-black">Stocks</TableHead>
                            <TableHead className="text-black">Total Pcs</TableHead>
                            <TableHead className="text-black">Supplier</TableHead>
                            <TableHead className="text-black">Status</TableHead>
                            <TableHead className="text-black">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50">
                                <TableCell className="text-black">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-100 p-2 rounded-md">
                                            <Package className="w-4 h-4 text-gray-500" />
                                        </div>
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell className="text-black">{item.category}</TableCell>
                                <TableCell className="text-black">{item.quantity}</TableCell>
                                <TableCell className="text-black">{item.unit}</TableCell>
                                <TableCell className="text-black">₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-black">{item.stocks}</TableCell>
                                <TableCell className="text-black font-medium">{item.stocks * item.quantity}</TableCell>
                                <TableCell className="text-black">{item.supplier.name}</TableCell>
                                <TableCell><StockBadge stocks={item.stocks} /></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <IssueStockDialog id={item.id} name={item.name} stocks={item.stocks} />
                                        <StockAdjustmentDialog id={item.id} name={item.name} stocks={item.stocks} />
                                        <UpdateInventoryItemDialog {...item} supplierId={item.supplierId} suppliers={suppliers}/>
                                        {!itemsWithOrders.has(item.id) && <DeleteButton id={item.id} />}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end mt-2">
                <Pagination page={page} totalPages={totalPages} basePath="/inventory" />
            </div>
        </div>
    )
}
