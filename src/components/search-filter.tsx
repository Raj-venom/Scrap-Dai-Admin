"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFilterProps {
    onSearch: (searchTerm: string) => void
    onFilter: (filterValue: string) => void
    filterOptions: { value: string; label: string }[]
}

export function SearchFilter({ onSearch, onFilter, filterOptions }: SearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        onSearch(newSearchTerm)
    }

    return (
        <div className="flex space-x-4">
            <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                    Search
                </Label>
                <Input id="search" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
            </div>
            <div>
                <Label htmlFor="filter" className="sr-only">
                    Filter
                </Label>
                <Select onValueChange={onFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter    " />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

