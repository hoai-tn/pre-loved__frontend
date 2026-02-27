'use client'

import { Suspense, lazy, useState } from 'react'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { selectIsAuthenticated, useAuthStore } from '@/store/auth'

const AuthModal = lazy(() =>
  import('@/components/auth/auth-modal').then((module) => ({
    default: module.AuthModal,
  })),
)

interface AuthButtonProps extends ComponentProps<typeof Button> {
  onAuthenticatedClick: () => void | Promise<void>
}

export function AuthButton({
  onAuthenticatedClick,
  onClick: _,
  ...buttonProps
}: AuthButtonProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    onAuthenticatedClick()
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    onAuthenticatedClick()
  }

  return (
    <>
      <Button onClick={handleClick} {...buttonProps} />

      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal
            open={showAuthModal}
            onOpenChange={setShowAuthModal}
            defaultTab="signin"
            onSignInSuccess={handleAuthSuccess}
          />
        </Suspense>
      )}
    </>
  )
}
