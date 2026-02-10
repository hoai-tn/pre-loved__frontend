'use client'

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/user/purchase')({
  component: () => <Outlet />,
})
