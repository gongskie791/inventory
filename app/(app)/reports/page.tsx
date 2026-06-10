import ReportsService from "@/lib/service/reports"
import { ReportFilters } from "./ReportFilters"
import { MovementChart } from "./MovementChart"
import { Suspense } from "react"
import { ArrowUpFromLine, ArrowDownToLine, SlidersHorizontal, TrendingDown } from "lucide-react"

function StatCard({ label, value, sub, icon: Icon, color }: {
    label: string
    value: string
    sub?: string
    icon: React.ElementType
    color: string
}) {
    return (
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-black">{value}</p>
                {sub && <p className="text-xs text-gray-400">{sub}</p>}
            </div>
        </div>
    )
}

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
    const { from: fromParam, to: toParam } = await searchParams

    const today = new Date()
    const defaultFrom = new Date(today)
    defaultFrom.setDate(today.getDate() - 29)

    const from = fromParam ? new Date(fromParam) : defaultFrom
    const to = toParam ? new Date(toParam + 'T23:59:59') : new Date(today.toDateString() + ' 23:59:59')

    const fromStr = from.toISOString().slice(0, 10)
    const toStr = toParam ?? today.toISOString().slice(0, 10)

    const service = new ReportsService()
    const [stats, topItems, movement] = await Promise.all([
        service.getStats(from, to),
        service.getTopIssuedItems(from, to, 8),
        service.getDailyMovement(from, to),
    ])

    const maxQty = topItems[0]?.totalQty ?? 1

    return (
        <div className="flex flex-col gap-6 flex-1">

            <Suspense>
                <ReportFilters from={fromStr} to={toStr} />
            </Suspense>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Units Issued (Out)"
                    value={stats.totalIssued.toLocaleString()}
                    icon={ArrowUpFromLine}
                    color="bg-orange-50 text-orange-400"
                />
                <StatCard
                    label="Value Issued"
                    value={`₱${stats.totalValueIssued.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={TrendingDown}
                    color="bg-red-50 text-red-400"
                />
                <StatCard
                    label="Units Received (In)"
                    value={stats.totalReceived.toLocaleString()}
                    icon={ArrowDownToLine}
                    color="bg-green-50 text-green-500"
                />
                <StatCard
                    label="Stock Adjustments"
                    value={stats.totalAdjustments.toLocaleString()}
                    icon={SlidersHorizontal}
                    color="bg-blue-50 text-blue-400"
                />
            </div>

            {/* Chart + Top items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 border rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-black mb-4">Stock Movement</h2>
                    <MovementChart data={movement} />
                </div>

                <div className="border rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-black mb-4">Top Issued Items</h2>
                    {topItems.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center mt-8">No issues in this period.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {topItems.map(item => (
                                <div key={item.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-black font-medium truncate">{item.name}</span>
                                        <span className="text-gray-500 ml-2 shrink-0">{item.totalQty} {item.unit}(s)</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-400 rounded-full"
                                            style={{ width: `${(item.totalQty / maxQty) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
