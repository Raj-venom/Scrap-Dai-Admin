"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Eye, EyeOff, Loader2, LogOut, Settings, User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import authService from "@/services/auth.api"
import { useRouter } from "next/navigation"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast"


export function AdminProfile() {
    const [showProfileDialog, setShowProfileDialog] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [admin, setAdmin] = useState<Admin | null>(null)
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const [isLoading, setIsLoading] = useState(false)


    // TODO: Use context API to manage user state
    useEffect(() => {
        try {
            ; (async () => {
                const response = await authService.getCurrentUser()
                setAdmin(response.data)
            })()
        } catch (error) {
            console.log("Error fetching admin data", error)
        }

    }, [])


    const handleLogout = async () => {
        try {
            await authService.logout()
            router.replace("/login")

        } catch (error) {
            console.log("Error logging out", error)
        }

    }

    const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // TODO: Implement profile update
        console.log("Updating profile...")
        setShowProfileDialog(false)
    }

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const formData = new FormData(e.currentTarget)
        const currentPassword = formData.get("currentPassword") as string
        const newPassword = formData.get("newPassword") as string
        const confirmPassword = formData.get("confirmPassword") as string
        
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        
        console.log({ currentPassword, newPassword, confirmPassword })

        try {
            setIsLoading(true)

            const response = await authService.changePassword({ currentPassword, newPassword })
            if (!response.success) {
                toast.error(response.message)
                return
            }

            toast.success(response.message)

            setShowPasswordDialog(false)

        } catch (error) {
            console.log("Error changing password", error)
            toast.error("Failed to change password")
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-16 w-full justify-start gap-2 px-4">
                        <Image
                            src={admin?.avatar || "/placeholder.svg"}
                            alt="admin avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{admin?.fullName}</span>
                            <span className="text-xs text-muted-foreground">{admin?.email}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" side="right">
                    <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Change Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Settings Dialog */}
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Profile</DialogTitle>
                        <DialogDescription>
                            {/* Manage your personal information */}
                        </DialogDescription>

                    </DialogHeader>
                    {/* <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={admin?.fullName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={admin?.email} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" type="tel" defaultValue={admin?.phone} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <Input id="avatar" type="file" accept="image/*" />
                        </div>
                        <Button type="submit" className="w-full">
                            Save Changes
                        </Button>
                    </form> */}

                    <Card className="shadow-lg rounded-xl p-4 space-y-4">
                        <CardContent className="flex items-center gap-4">
                            <Image
                                src={admin?.avatar || "/placeholder.svg"}
                                alt="Admin Avatar"
                                width={64}
                                height={64}
                                className="rounded-full border border-gray-300"
                            />
                            <div>
                                <h3 className="text-lg font-medium">{admin?.fullName}</h3>
                                <p className="text-sm text-gray-500">{admin?.email}</p>
                            </div>
                        </CardContent>
                        <CardContent className="space-y-2">
                            <div>
                                <Label className="text-sm font-semibold">Phone</Label>
                                <p className="text-gray-700">{admin?.phone}</p>
                            </div>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showPassword ? "text" : "password"}
                                    name="currentPassword"
                                    required
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>

                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

