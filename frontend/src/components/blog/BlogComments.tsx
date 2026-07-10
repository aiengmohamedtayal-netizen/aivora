"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function BlogComments({ postId }: { postId: string }) {
  const t = useTranslations("common")
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [content, setContent] = useState("")
  const [message, setMessage] = useState("")

  const supabase = createClient()

  useEffect(() => {
    if (!postId || postId === "json-fallback") {
      setLoading(false)
      return
    }

    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .eq("status", "approved")
        .order("created_at", { ascending: true })

      if (data) setComments(data)
      setLoading(false)
    }

    fetchComments()
  }, [postId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || postId === "json-fallback") return

    setSubmitting(true)
    setMessage("")

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      guest_name: guestName || "Anonymous",
      content: content.trim(),
      status: "pending" // requires admin approval
    })

    if (error) {
      setMessage("Failed to post comment. Please try again.")
    } else {
      setMessage("Your comment has been submitted and is awaiting moderation.")
      setContent("")
      setGuestName("")
    }

    setSubmitting(false)
  }

  if (postId === "json-fallback") {
    return null // Comments disabled for static fallback posts
  }

  return (
    <div className="mt-16 pt-16 border-t border-border/50">
      <h3 className="text-2xl font-bold mb-8">Comments ({comments.length})</h3>

      <div className="space-y-8 mb-12">
        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-secondary h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-secondary rounded"></div>
              </div>
            </div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                {(c.guest_name || "A")[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-foreground">{c.guest_name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-muted-foreground leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-card p-6 rounded-xl border border-border/50">
        <h4 className="text-lg font-semibold mb-4">Leave a Reply</h4>
        
        {message && (
          <div className="p-3 bg-primary/10 text-primary rounded-md text-sm mb-4">
            {message}
          </div>
        )}

        <Input
          label="Name (optional)"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="John Doe"
        />
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Comment</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Share your thoughts on this article..."
          />
        </div>

        <Button type="submit" disabled={submitting || !content.trim()} loading={submitting}>
          Post Comment
        </Button>
      </form>
    </div>
  )
}
