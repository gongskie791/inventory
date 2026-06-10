"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/action/auth"
import { useActionState } from "react"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
    const [state, action, pending] = useActionState(login, null)

    return (
        <form className={cn("flex flex-col gap-6", className)} action={action} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>
                {state?.error && (
                    <p className="text-sm text-red-500 text-center">{state.error}</p>
                )}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="bg-background"
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="bg-background"
                    />
                </Field>
                <Field>
                    <Button type="submit" disabled={pending} className="w-full">
                        {pending ? 'Signing in…' : 'Sign in'}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
