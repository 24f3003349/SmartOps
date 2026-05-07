"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
}

interface TicketDetailSheetProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  onResolved: () => void
}

export function TicketDetailSheet({ ticket, isOpen, onClose, onResolved }: TicketDetailSheetProps) {
  const [draft, setDraft] = useState("")
  const [isDrafting, setIsDrafting] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  if (!ticket) return null

  const handleGenerateDraft = async () => {
    setIsDrafting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tickets/${ticket.id}/draft`, {
        method: "POST",
      })
      const data = await res.json()
      setDraft(data.draft)
      toast.success("AI draft generated!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate draft.")
    } finally {
      setIsDrafting(false)
    }
  }

  const handleResolve = async () => {
    setIsResolving(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tickets/${ticket.id}/resolve?resolution_text=${encodeURIComponent(draft)}`, {
        method: "POST",
      })
      if (res.ok) {
        toast.success("Ticket resolved and reply sent!")
        onResolved()
        onClose()
      } else {
        toast.error("Failed to resolve ticket.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error resolving ticket.")
    } finally {
      setIsResolving(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{ticket.status.toUpperCase()}</Badge>
            <Badge variant="secondary">{ticket.priority.toUpperCase()}</Badge>
          </div>
          <SheetTitle className="text-xl">{ticket.title}</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground mt-2">
            From: {ticket.contact_email}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <Label className="text-xs uppercase text-muted-foreground">Description</Label>
            <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md border border-border whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs uppercase text-muted-foreground">Resolution Draft</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGenerateDraft}
                disabled={isDrafting}
                className="text-primary hover:text-primary/80 h-7 text-[10px]"
              >
                {isDrafting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                GENERATE AI DRAFT
              </Button>
            </div>
            
            <Textarea 
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Draft your response here..."
              className="min-h-[200px] text-sm"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              className="flex-1" 
              onClick={handleResolve}
              disabled={!draft || isResolving}
            >
              {isResolving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send & Resolve
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
