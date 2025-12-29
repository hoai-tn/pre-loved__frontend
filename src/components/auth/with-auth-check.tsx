'use client'

import { Suspense, lazy, useState } from 'react'
import { selectIsAuthenticated, useAuthStore } from '@/store/auth'

const AuthModal = lazy(() =>
  import('./auth-modal').then((module) => ({
    default: module.AuthModal,
  })),
)

/**
 * Higher Order Component that wraps a component and shows login modal
 * if user is not authenticated when a specific action is triggered
 */
export function withAuthCheck<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    onAuthRequired?: () => void
  },
) {
  return function AuthCheckedComponent(props: T) {
    const isAuthenticated = useAuthStore(selectIsAuthenticated)
    const [showAuthModal, setShowAuthModal] = useState(false)

    const handleAction = (originalHandler?: () => void) => {
      if (!isAuthenticated) {
        setShowAuthModal(true)
        options?.onAuthRequired?.()
        return
      }
      originalHandler?.()
    }

    return (
      <>
        <Component {...props} onAction={handleAction} />
        {showAuthModal && (
          <Suspense fallback={null}>
            <AuthModal
              open={showAuthModal}
              onOpenChange={setShowAuthModal}
              defaultTab="signin"
            />
          </Suspense>
        )}
      </>
    )
  }
}
