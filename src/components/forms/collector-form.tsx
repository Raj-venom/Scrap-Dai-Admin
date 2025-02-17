"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export function CollectorForm() {
    const [open, setOpen] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // print user input
        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData)
        console.log(data)

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Collector
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Collector</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="current_address">Current Address</Label>
                        <Textarea id="current_address" name="current_address" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profileImage">Profile Image</Label>
                        <Input id="profileImage" name="profileImage" type="file" required accept="image/*" />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Register Collector
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

