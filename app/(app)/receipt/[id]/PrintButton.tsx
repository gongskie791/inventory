"use client"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
    return (
        <Button onClick={() => window.print()} className="bg-orange-400 gap-2 print:hidden">
            <Printer className="w-4 h-4" /> Print Receipt
        </Button>
    )
}
