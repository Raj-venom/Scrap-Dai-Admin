"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus } from "lucide-react"
import collectorService from "@/services/collector.api"
import toast from "react-hot-toast"

export function CollectorForm() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data: CollectorRegisterParams = {
            fullName: formData.get("fullName") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            current_address: formData.get("current_address") as string
        };

        try {
            const response = await collectorService.registerCollector(data)
            console.log(response)
            if (response.success) {
                toast.success(response.message)
                setOpen(false)
            } else {
                toast.error(`Error: ${response.message}`)
            }

        } catch (error: any) {
            toast.error(`Failed to register collector: ${error.message}`)
            console.error(error.message)
        } finally {
            setIsLoading(false)
        }
        
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
                    <DialogDescription>
                        Register a new collector
                    </DialogDescription>
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
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Register Collector
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

