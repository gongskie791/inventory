"use client"
import { Button } from "@/components/ui/button"
import { deleteOrder } from "@/lib/action/order"
import { Trash } from "lucide-react"
import { toast } from "sonner"

export function DeleteOrderButton({ id }: { id: string }) {
    async function handleDelete() {
        const result = await deleteOrder(id)
        if (result?.success) toast.success("Order deleted!")
        if (result?.error) toast.error(result.error)
    }

    return (
        <Button onClick={handleDelete} className="rounded-full" size={"icon-sm"} variant={"destructive"}>
            <Trash className="w-5 h-5" />
        </Button>
    )
}
