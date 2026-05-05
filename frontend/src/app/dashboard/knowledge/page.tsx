"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, FileText } from "lucide-react"

export default function KnowledgePage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/knowledge/files`)
      const data = await res.json()
      setFiles(data.files || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/knowledge/upload`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        toast.success("Document uploaded successfully!")
        setFile(null)
        fetchFiles()
      } else {
        toast.error("Upload failed.")
      }
    } catch (err) {
      toast.error("Error connecting to server.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Knowledge Base</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to select or drag and drop</p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer"></label>
              </div>
              {file && (
                <p className="text-sm font-medium">Selected: {file.name}</p>
              )}
              <Button type="submit" disabled={!file || uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload SOP / FAQ"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managed Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {files.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              ) : (
                files.map((f) => (
                  <li key={f} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
