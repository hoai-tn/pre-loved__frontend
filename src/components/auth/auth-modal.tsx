'use client'

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SignInForm } from './signin-form'
import { SignUpForm } from './signup-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'signin' | 'signup'
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = 'signin',
}: AuthModalProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab)

  const handleSignInSuccess = () => {
    onOpenChange(false)
    navigate({ to: '/' })
  }

  const handleSignUpSuccess = () => {
    // After successful signup, switch to signin tab
    setActiveTab('signin')
  }

  const handleSwitchToSignUp = () => {
    setActiveTab('signup')
  }

  const handleSwitchToSignIn = () => {
    setActiveTab('signin')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === 'signin'
              ? 'Nhập thông tin để đăng nhập vào tài khoản'
              : 'Tạo tài khoản mới để bắt đầu mua bán'}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
            <TabsTrigger value="signup">Đăng ký</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4">
            <SignInForm
              onSuccess={handleSignInSuccess}
              onSwitchToSignUp={handleSwitchToSignUp}
            />
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <SignUpForm
              onSuccess={handleSignUpSuccess}
              onSwitchToSignIn={handleSwitchToSignIn}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
