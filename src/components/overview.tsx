"use client"

import dashboardService from "@/services/dashboard.api"
import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts"

interface DataItem {
    name: string;
    total: number;
}


export function Overview() {
    const [data, setData] = useState<DataItem[]>([])
    const [loading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        ; (async () => {
            try {
                setIsLoading(true)
                const response = await dashboardService.getCollectionOverview()
                if (response.success) {
                    setData(response.data)
                } else {
                    console.error("Error fetching dashboard stats:", response.message)
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    // custom tooltip
    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-lg rounded-md border border-green-100">
                    <p className="font-bold text-green-600">{`${payload[0].value} kg`}</p>
                </div>
            )
        }
        return null
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} kg`}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    wrapperStyle={{ outline: "none" }}
                    isAnimationActive={true}
                    position={{ y: -10 }}
                />
                <Bar
                    dataKey="total"
                    fill="#389936"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                    activeBar={{ fill: "#2d7a2a", stroke: "#389936", strokeWidth: 2 }}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}