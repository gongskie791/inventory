"use client"
import { Button } from "@/components/ui/button"
import { deleteItem } from "@/lib/action/item"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export function DeleteButton({ id }: { id: string }) {
    const [confirming, setConfirming] = useState(false)

    async function handleClick() {
        if (!confirming) {
            setConfirming(true)
            setTimeout(() => setConfirming(false), 3000)
            return
        }
        const result = await deleteItem(id)
        if (result?.success) toast.success("Item deleted successfully!")
        if (result?.error) toast.error(result.error)
        setConfirming(false)
    }

    return (
        <Button
            onClick={handleClick}
            className={`rounded-full text-xs px-2 h-7 transition-all ${confirming ? 'bg-red-600 hover:bg-red-700 w-16' : 'w-7'}`}
            size={"icon-sm"}
            variant={"destructive"}
        >
            {confirming ? "Sure?" : <Trash className="w-4 h-4" />}
        </Button>
    )
}
