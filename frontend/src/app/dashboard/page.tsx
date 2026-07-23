"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox, Activity, BarChart2, AlertCircle, Sparkles, CheckCircle2, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  avg_draft_similarity?: number
}

export default function DashboardOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState<string>("")

  const fetchAnalytics = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1"
    fetch(`${apiBase}/analytics/overview`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLastRefreshed(new Date().toLocaleTimeString())
      })
      .catch(err => console.error("Failed to fetch analytics:", err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm font-mono">Initializing SmartOps Metrics Engine...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 text-center space-y-2">
        <AlertCircle className="w-8 h-8 mx-auto opacity-80" />
        <p className="font-semibold text-sm">Failed to connect to SmartOps Analytics API.</p>
        <p className="text-xs opacity-75">Ensure backend server is running on port 8000.</p>
      </div>
    )
  }

  const stats = [
    { 
      title: "Total Ticket Volume", 
      value: data.total_tickets, 
      sub: "Ingested items",
      icon: Inbox, 
      color: "text-blue-400" 
    },
    { 
      title: "Resolution Rate", 
      value: `${data.resolution_rate}%`, 
      sub: `${data.resolved_tickets} resolved`,
      icon: Activity, 
      color: "text-emerald-400" 
    },
    { 
      title: "Avg AI Confidence", 
      value: `${(data.avg_confidence * 100).toFixed(0)}%`, 
      sub: "Triage precision",
      icon: BarChart2, 
      color: "text-purple-400" 
    },
    { 
      title: "Draft Alignment", 
      value: `${((data.avg_draft_similarity ?? 1.0) * 100).toFixed(0)}%`, 
      sub: "Human vs AI similarity",
      icon: Sparkles, 
      color: "text-amber-400" 
    },
  ]

  const chartData = Object.entries(data.category_distribution).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Telemetry & Overview</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Real-time support operations engine • Last synced {lastRefreshed}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-2.5 py-1 text-xs font-mono gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
            SSE Stream Live
          </Badge>
          
          {data.pending_triage > 0 && (
            <Badge variant="outline" className="px-2.5 py-1 text-xs font-mono gap-1.5 border-amber-500/30 bg-amber-500/5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-amber" />
              {data.pending_triage} Pending Triage
            </Badge>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all hover:border-primary/40 hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight">{stat.value}</div>
              <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold tracking-tight flex items-center justify-between">
              Category Distribution
              <span className="text-xs font-normal text-muted-foreground font-mono">
                {chartData.length} Active Categories
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] pt-2">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-mono">
                No category metrics collected yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Runtime Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent-in-the-loop triage engine active. Classifying incoming tickets via Pydantic schema validation & RAG knowledge indices.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span>Resolved Progress</span>
                <span className="font-semibold text-emerald-400">{data.resolution_rate}%</span>
              </div>
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-700 ease-out" 
                  style={{ width: `${data.resolution_rate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-md border border-border/40 bg-muted/30">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">FastAPI Worker</div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">Operational</div>
              </div>
              <div className="p-2.5 rounded-md border border-border/40 bg-muted/30">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">RAG Storage</div>
                <div className="text-xs font-semibold text-purple-400 mt-0.5">LlamaIndex</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
