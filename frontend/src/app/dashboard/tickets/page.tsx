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
import { AlertCircle, CheckCircle, Clock, Inbox, Search } from "lucide-react"
import { TicketDetailSheet } from "@/components/tickets/ticket-detail-sheet"
import { Input } from "@/components/ui/input"

type Ticket = {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string | null
  ai_confidence: number | null
  ai_suggestion: string | null
  contact_email: string
  created_at: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [search, setSearch] = useState("")

  const fetchTickets = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tickets/`)
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter(t => 
    t.status !== "resolved" && 
    (t.title.toLowerCase().includes(search.toLowerCase()) || 
     t.contact_email.toLowerCase().includes(search.toLowerCase()))
  )

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

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsSheetOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ticket Inbox</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tickets..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Active Workstream
            <Badge variant="secondary" className="font-normal">{filteredTickets.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead>Ticket Information</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">AI Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-8 w-8 opacity-20" />
                      <p>All caught up! No active tickets.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className="cursor-pointer transition-colors"
                    onClick={() => handleRowClick(ticket)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize text-xs font-medium">{ticket.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{ticket.title}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {ticket.contact_email} • {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.category ? (
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">
                          {ticket.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[10px] italic">Triage pending...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(ticket.priority)} text-white border-none text-[10px] h-5`}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {ticket.ai_confidence !== null ? (
                        <div className="flex flex-col items-end">
                          <span className={`text-xs font-bold ${ticket.ai_confidence > 0.8 ? 'text-green-600' : 'text-orange-600'}`}>
                            {Math.round(ticket.ai_confidence * 100)}%
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TicketDetailSheet 
        ticket={selectedTicket} 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        onResolved={fetchTickets}
      />
    </div>
  )
}
