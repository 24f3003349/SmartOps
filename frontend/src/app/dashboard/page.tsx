"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox, Activity, BarChart2, AlertCircle } from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts"

interface AnalyticsData {
  total_tickets: number
  resolved_tickets: number
  avg_confidence: number
  pending_triage: number
  category_distribution: Record<string, number>
  resolution_rate: number
}

export default function DashboardOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production this would be an env var
    fetch("http://localhost:8000/api/v1/analytics/overview")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to fetch analytics:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard metrics...</div>
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to connect to analytics service.</div>
  }

  const stats = [
    { title: "Total Volume", value: data.total_tickets, icon: Inbox, color: "text-blue-500" },
    { title: "Resolution Rate", value: `${data.resolution_rate}%`, icon: Activity, color: "text-green-500" },
    { title: "AI Accuracy", value: `${(data.avg_confidence * 100).toFixed(0)}%`, icon: BarChart2, color: "text-purple-500" },
    { title: "Pending Triage", value: data.pending_triage, icon: AlertCircle, color: "text-red-500" },
  ]

  const chartData = Object.entries(data.category_distribution).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ticket Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>AI Operations Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Your AI-powered service desk is active. The system is currently classifying 
                incoming tickets and suggesting resolutions using your knowledge base.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Resolved Tickets</span>
                  <span className="font-medium">{data.resolved_tickets}</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-500" 
                    style={{ width: `${data.resolution_rate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-xs text-muted-foreground">System Health</div>
                  <div className="text-sm font-medium text-green-500">Optimal</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-xs text-muted-foreground">Sync Status</div>
                  <div className="text-sm font-medium">Real-time</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
