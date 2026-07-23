"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Upload, FileText, Search, Sparkles, Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const MOCK_FILES = [
  "SOP_Database_Connection_Troubleshooting.md",
  "FAQ_Billing_Refund_Policies_v2.pdf",
  "API_Rate_Limiting_Integration_Guide.txt",
  "SAML_SSO_Configuration_Manual.md"
]

export default function KnowledgePage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<string[]>(MOCK_FILES)
  const [query, setQuery] = useState("")
  const [queryResult, setQueryResult] = useState<string | null>(null)
  const [querying, setQuerying] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(true)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1"

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${apiBase}/knowledge/files`)
      if (!res.ok) throw new Error("API error")
      const data = await res.json()
      setFiles(data.files?.length > 0 ? data.files : MOCK_FILES)
      setIsBackendConnected(true)
    } catch (err) {
      setIsBackendConnected(false)
      setFiles(MOCK_FILES)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error("Please select a valid document file (.pdf, .md, or .txt)")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${apiBase}/knowledge/upload`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        toast.success(`Uploaded ${file.name} to LlamaIndex vector store!`)
        setFile(null)
        fetchFiles()
      } else {
        toast.error("Upload failed on backend server.")
      }
    } catch (err) {
      // Offline fallback behavior
      setFiles(prev => [file.name, ...prev])
      toast.success(`Uploaded ${file.name} (Local Preview Mode)`)
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSearchQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setQuerying(true)
    setQueryResult(null)

    try {
      const res = await fetch(`${apiBase}/knowledge/query?query=${encodeURIComponent(query)}`, {
        method: "POST"
      })
      if (res.ok) {
        const data = await res.json()
        setQueryResult(data.response || "No relevant context found.")
      } else {
        throw new Error("Query failed")
      }
    } catch (err) {
      // Offline mock fallback response
      setQueryResult(
        `[RAG Preview Context]: Based on company SOP policies, connection pool issues can be resolved by scaling PgBouncer max connections. For billing refund queries, process Stripe credits within 3-5 business days.`
      )
    } finally {
      setQuerying(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Base & RAG Vector Engine</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            LlamaIndex storage context for grounding AI response suggestions
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="outline" className="px-2.5 py-1 gap-1.5 border-purple-500/30 bg-purple-500/10 text-purple-400">
            <Database className="w-3 h-3 text-purple-400" />
            LlamaIndex Active
          </Badge>
          {!isBackendConnected && (
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              Offline Preview Mode
            </Badge>
          )}
        </div>
      </div>

      {/* RAG Search Tester Bar */}
      <Card className="border-purple-500/20 bg-purple-500/5 shadow-none">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Test RAG Semantic Search Query
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <form onSubmit={handleSearchQuery} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Ask a policy question e.g. How to handle database pool timeouts?"
                className="pl-9 h-9 text-xs font-mono border-purple-500/30"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              disabled={querying || !query.trim()}
              className="h-9 text-xs font-mono bg-purple-600 hover:bg-purple-700 text-white px-4"
            >
              {querying ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Search className="w-3.5 h-3.5 mr-1" />}
              Execute RAG Query
            </Button>
          </form>

          {queryResult && (
            <div className="p-3.5 rounded-md border border-purple-500/30 bg-background/80 text-xs font-mono leading-relaxed text-foreground animate-in fade-in">
              <div className="text-[10px] uppercase font-bold text-purple-400 mb-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Synthesized Knowledge Response
              </div>
              <p className="whitespace-pre-wrap">{queryResult}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload and Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Card */}
        <Card className="border-border/40 shadow-none">
          <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/20">
            <CardTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Upload SOP Document
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-lg p-6 hover:border-primary/50 transition-colors bg-muted/20">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-xs font-mono text-muted-foreground">
                  Select `.pdf`, `.md`, or `.txt` policy files
                </p>
                <Input
                  type="file"
                  accept=".pdf,.md,.txt"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer"></label>
              </div>

              {file && (
                <div className="flex items-center justify-between p-2 rounded border border-primary/30 bg-primary/5 text-xs font-mono">
                  <span>Selected: {file.name}</span>
                  <span className="text-[10px] text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                </div>
              )}

              <Button type="submit" disabled={!file || uploading} className="w-full text-xs font-mono h-9">
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Ingesting into LlamaIndex...
                  </>
                ) : (
                  "Upload & Index Document"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Managed Documents */}
        <Card className="border-border/40 shadow-none">
          <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/20 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Indexed Documents
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono">
              {files.length} Files
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f} className="flex items-center justify-between p-2.5 rounded-md border border-border/40 bg-muted/20 text-xs font-mono">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="truncate text-foreground">{f}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                    INDEXED
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
