"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DailyMovement } from "@/lib/repository/reports"

export function MovementChart({ data }: { data: DailyMovement[] }) {
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No movement data for this period.</div>
    }

    const formatted = data.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }),
    }))

    return (
        <ResponsiveContainer width="100%" height={260}>
            <BarChart data={formatted} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="issued" name="Issued (Out)" fill="#fb923c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="received" name="Received (In)" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
