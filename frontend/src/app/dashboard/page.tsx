import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox, BookOpen, AlertCircle, CheckCircle } from "lucide-react"

export default function DashboardOverview() {
  const stats = [
    { title: "Active Tickets", value: "0", icon: Inbox, color: "text-blue-500" },
    { title: "Docs Indexed", value: "0", icon: BookOpen, color: "text-green-500" },
    { title: "Critical Issues", value: "0", icon: AlertCircle, color: "text-red-500" },
    { title: "Auto-Resolved", value: "0", icon: CheckCircle, color: "text-purple-500" },
  ]

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

      <Card>
        <CardHeader>
          <CardTitle>Welcome to SmartOps AI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start by uploading company knowledge in the **Knowledge** tab or check incoming tickets in the **Tickets** inbox.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
