"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Inbox } from "lucide-react"

type Ticket = {
  id: string
  title: string
  status: string
  priority: string
  category: string | null
  ai_confidence: number | null
  created_at: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tickets/`)
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error(err))
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent": return "bg-red-500 hover:bg-red-600"
      case "high": return "bg-orange-500 hover:bg-orange-600"
      case "medium": return "bg-blue-500 hover:bg-blue-600"
      case "low": return "bg-slate-500 hover:bg-slate-600"
      default: return "bg-slate-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return <Inbox className="w-4 h-4 text-blue-500" />
      case "waiting": return <Clock className="w-4 h-4 text-orange-500" />
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <AlertCircle className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ticket Inbox</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Workstream</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>AI Conf.</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize text-xs font-medium">{ticket.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {ticket.title}
                    </TableCell>
                    <TableCell>
                      {ticket.category ? (
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {ticket.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Pending AI...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(ticket.priority)} text-white border-none text-[10px]`}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.ai_confidence !== null ? (
                        <span className={`text-xs font-bold ${ticket.ai_confidence > 0.8 ? 'text-green-600' : 'text-orange-600'}`}>
                          {Math.round(ticket.ai_confidence * 100)}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
