"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import type { LoginRequest } from "@/services/api"
import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface SignInFormProps {
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
}

export function SignInForm({ onSuccess, onSwitchToSignUp }: SignInFormProps) {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginRequest>({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  })

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data)
      // Success - close modal and redirect
      onSuccess?.()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng thử lại."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: "Tên đăng nhập là bắt buộc",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên đăng nhập"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{
            required: "Mật khẩu là bắt buộc",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        <div className="text-sm text-center text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={onSwitchToSignUp}
          >
            Đăng ký ngay
          </Button>
        </div>
      </form>
    </Form>
  )
}
