'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import type { RegisterRequest } from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface SignUpFormProps {
  onSuccess?: () => void
  onSwitchToSignIn?: () => void
}

export function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const registerUser = useAuthStore((state) => state.register)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RegisterRequest>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      await registerUser(data)
      // Success - switch to sign in tab
      onSuccess?.()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Đăng ký thất bại. Vui lòng thử lại.',
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
            required: 'Tên đăng nhập là bắt buộc',
            minLength: {
              value: 3,
              message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
            },
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
          name="email"
          rules={{
            required: 'Email là bắt buộc',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email không hợp lệ',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Nhập email"
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
            required: 'Mật khẩu là bắt buộc',
            minLength: {
              value: 6,
              message: 'Mật khẩu phải có ít nhất 6 ký tự',
            },
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
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>

        <div className="text-sm text-center text-muted-foreground">
          Đã có tài khoản?{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={onSwitchToSignIn}
          >
            Đăng nhập ngay
          </Button>
        </div>
      </form>
    </Form>
  )
}
