"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OtpVerificationDialog } from "./otp-verification-dialog"
import { NewPasswordDialog } from "./new-password-dialog"

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("")
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Send reset instructions
    setShowOtpVerification(true)
    onOpenChange(false)
  }

  const handleOtpSuccess = () => {
    setShowOtpVerification(false)
    setShowNewPassword(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Enter your email address and we&apos;ll send you a verification code to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send reset instructions
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <OtpVerificationDialog
        open={showOtpVerification}
        onOpenChange={setShowOtpVerification}
        onSuccess={handleOtpSuccess}
        email={email}
      />
      <NewPasswordDialog
        open={showNewPassword}
        onOpenChange={setShowNewPassword}
        onSuccess={() => {
          setShowNewPassword(false)
          onOpenChange(false)
        }}
      />
    </>
  )
}

