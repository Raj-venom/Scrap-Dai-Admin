"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, Scale, Truck, Banknote } from "lucide-react";
import { Overview } from "@/components/overview";
import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboard.api";

interface DashboardCard {
  title: string;
  icon: string;
  value: string;
  change: string;
}

const iconMap: Record<string, React.ElementType> = {
  Recycle,
  Truck,
  Scale,
  Leaf,
  Banknote,
};

function Dashboard() {
  const [loading, setIsLoading] = useState(false);
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([]);

  useEffect(() => {
    ; (async () => {
      try {
        const response = await dashboardService.getDashboardStats();
        if (response.success) {
          setDashboardCards(response.data);
        } else {
          console.error("Error fetching dashboard stats:", response.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => {
          const Icon = iconMap[card.icon] || Leaf;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Overview />
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
