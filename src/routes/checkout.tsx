'use client'

import { createFileRoute } from '@tanstack/react-router'
import { CheckoutPage } from '@/components/checkout/checkout-page'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

