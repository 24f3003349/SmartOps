"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, Inbox, Search, Plus, RefreshCw, Filter, Sparkles } from "lucide-react"
import { TicketDetailSheet } from "@/components/tickets/ticket-detail-sheet"
import { Input } from "@/components/ui/input"
import { useTicketEvents } from "@/hooks/useTicketEvents"
import { toast } from "sonner"

export type Ticket = {
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

// Robust mock fallback data for offline preview mode
const MOCK_TICKETS: Ticket[] = [
  {
    id: "101",
    title: "Database Connection Pool Exhausted",
    description: "Our API servers are reporting 504 gateway timeouts due to database connection exhaustion on the primary PostgreSQL cluster during peak load.",
    status: "new",
    priority: "high",
    category: "Technical",
    ai_confidence: 0.92,
    ai_suggestion: "Increase max_connections parameter in postgresql.conf and scale connection pool size in PgBouncer pool settings.",
    contact_email: "devops@acme.com",
    created_at: new Date().toISOString()
  },
  {
    id: "102",
    title: "Billing Invoice #4092 Refund Inquiry",
    description: "We were double billed for our monthly enterprise plan subscription on July 15th. Requesting immediate credit adjustment.",
    status: "waiting",
    priority: "urgent",
    category: "Billing",
    ai_confidence: 0.54,
    ai_suggestion: "Review invoice transaction ID #4092 in Stripe billing dashboard and issue partial refund credit.",
    contact_email: "finance@company.io",
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "103",
    title: "Feature Request: Webhook Payload Encryption",
    description: "Would like to request HMAC-SHA256 signature verification headers on outgoing webhook notification events for security auditing.",
    status: "new",
    priority: "medium",
    category: "Feature Request",
    ai_confidence: 0.88,
    ai_suggestion: "Logged request in product backlog under security integrations roadmap.",
    contact_email: "secops@techfirm.org",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "104",
    title: "SSO OAuth2 Provider Redirect Misconfiguration",
    description: "Users attempting Okta SAML login receive invalid redirect URI error when accessing dashboard subdomains.",
    status: "resolved",
    priority: "high",
    category: "Technical",
    ai_confidence: 0.95,
    ai_suggestion: "Updated domain callback URLs in auth provider configuration.",
    contact_email: "admin@globalcorp.net",
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
]

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filterTab, setFilterTab] = useState<"active" | "waiting" | "resolved" | "all">("active")
  const [isBackendConnected, setIsBackendConnected] = useState(true)
  const [loading, setLoading] = useState(true)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1"

  const fetchTickets = useCallback(() => {
    setLoading(true)
    fetch(`${apiBase}/tickets/`)
      .then((res) => {
        if (!res.ok) throw new Error("API network error")
        return res.json()
      })
      .then((data: Ticket[]) => {
        setTickets(data)
        setIsBackendConnected(true)
      })
      .catch(() => {
        setIsBackendConnected(false)
        setTickets(prev => prev.length > 0 ? prev : MOCK_TICKETS)
      })
      .finally(() => setLoading(false))
  }, [apiBase])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Real-time SSE Listener with fallback safety
  useTicketEvents(useCallback((eventType, data) => {
    fetchTickets()
    if (eventType === "triage_completed") {
      toast.info(`AI Triage completed for Ticket #${data.ticket_id}`, {
        description: `Category: ${data.category} | Priority: ${data.priority}`
      })
    }
  }, [fetchTickets]))

  const handleCreateDemoTicket = () => {
    const newDemo: Ticket = {
      id: String(Math.floor(100 + Math.random() * 900)),
      title: "New Incoming Support Query: API Rate Limits",
      description: "Getting 429 Too Many Requests error when executing bulk data import job.",
      status: "new",
      priority: "medium",
      category: "Technical",
      ai_confidence: 0.86,
      ai_suggestion: "Recommend optimizing batch chunk size and setting exponential backoff delay.",
      contact_email: "support@client.com",
      created_at: new Date().toISOString()
    }

    if (isBackendConnected) {
      fetch(`${apiBase}/tickets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDemo.title,
          description: newDemo.description,
          contact_email: newDemo.contact_email,
          status: "new",
          priority: "medium"
        })
      })
      .then(() => {
        toast.success("Demo ticket submitted to API!")
        fetchTickets()
      })
      .catch(() => {
        setTickets(prev => [newDemo, ...prev])
        toast.success("Demo ticket created in local preview mode.")
      })
    } else {
      setTickets(prev => [newDemo, ...prev])
      toast.success("Demo ticket created in local preview mode.")
    }
  }

  const filteredTickets = tickets.filter(t => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      String(t.title || "").toLowerCase().includes(searchLower) || 
      String(t.contact_email || "").toLowerCase().includes(searchLower) ||
      String(t.id || "").includes(search)

    if (!matchesSearch) return false

    if (filterTab === "active") return t.status !== "resolved"
    if (filterTab === "waiting") return t.status === "waiting" || (t.ai_confidence !== null && t.ai_confidence < 0.6)
    if (filterTab === "resolved") return t.status === "resolved"
    return true
  })


  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent": return "bg-red-500/15 text-red-400 border-red-500/30"
      case "high": return "bg-orange-500/15 text-orange-400 border-orange-500/30"
      case "medium": return "bg-blue-500/15 text-blue-400 border-blue-500/30"
      case "low": return "bg-slate-500/15 text-slate-400 border-slate-500/30"
      default: return "bg-slate-500/15 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return (
          <Badge variant="outline" className="text-[10px] font-mono border-blue-500/30 bg-blue-500/10 text-blue-400 gap-1">
            <Inbox className="w-3 h-3" /> NEW
          </Badge>
        )
      case "waiting":
        return (
          <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 bg-amber-500/10 text-amber-400 gap-1 animate-pulse-amber">
            <Clock className="w-3 h-3" /> REVIEW REQ
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1">
            <CheckCircle className="w-3 h-3" /> RESOLVED
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-mono border-slate-500/30 text-slate-400">
            {status.toUpperCase()}
          </Badge>
        )
    }
  }

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsSheetOpen(true)
  }

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t))
    fetchTickets()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Ticket Inbox</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Real-time ticket queue & human-in-the-loop triage desk
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isBackendConnected && (
            <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 bg-amber-500/10 text-amber-400">
              Offline Preview Mode
            </Badge>
          )}

          <Button 
            onClick={handleCreateDemoTicket}
            size="sm" 
            className="h-8 text-xs font-mono gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Ticket
          </Button>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search ID, title, email..." 
              className="pl-9 h-8 text-xs font-mono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border/30 pb-2">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1" />
          {[
            { id: "active", label: "Active Workstream" },
            { id: "waiting", label: "Review Required (<60% Conf)" },
            { id: "resolved", label: "Resolved" },
            { id: "all", label: "All Items" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                filterTab === tab.id
                  ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchTickets}
          className="h-7 text-[11px] font-mono text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin text-primary' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Main Table */}
      <Card className="border-border/40 shadow-none">
        <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/20">
          <CardTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Ticket Queue</span>
            <span>{filteredTickets.length} Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/30">
                <TableHead className="w-[120px] font-mono text-[11px]">ID & STATUS</TableHead>
                <TableHead className="font-mono text-[11px]">TICKET DETAILS</TableHead>
                <TableHead className="font-mono text-[11px]">CATEGORY</TableHead>
                <TableHead className="font-mono text-[11px]">PRIORITY</TableHead>
                <TableHead className="text-right font-mono text-[11px]">AI CONFIDENCE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-8 w-8 opacity-20" />
                      <p className="text-xs font-mono">No tickets found matching current view filter.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                    onClick={() => handleRowClick(ticket)}
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs font-bold text-muted-foreground">#{ticket.id}</span>
                        {getStatusBadge(ticket.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                          {ticket.title}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground truncate max-w-[320px]">
                          {ticket.contact_email} • {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.category ? (
                        <Badge variant="outline" className="text-[10px] font-mono tracking-tight bg-secondary/50">
                          {ticket.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[11px] font-mono italic animate-pulse">
                          Triage in progress...
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] font-mono font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {ticket.ai_confidence !== null ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={`text-xs font-mono font-bold ${
                            ticket.ai_confidence > 0.8 
                              ? 'text-emerald-400' 
                              : ticket.ai_confidence >= 0.6 
                                ? 'text-blue-400' 
                                : 'text-amber-400'
                          }`}>
                            {Math.round(ticket.ai_confidence * 100)}%
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground">
                            {ticket.ai_confidence >= 0.6 ? "High Precision" : "Human Review Req."}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-muted-foreground">-</span>
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
