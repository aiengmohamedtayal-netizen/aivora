"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Edit2, FileText, Image as ImageIcon, Save, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react"

type ContentBlock = {
  id: string
  type: "p" | "h2" | "h3" | "code" | "quote" | "image"
  text: string
  codeLanguage?: string | null
}

export default function BlogCMSPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // Editor states
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDesc, setSeoDesc] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [category, setCategory] = useState("SaaS & Web")
  const [tags, setTags] = useState("")
  const [blocks, setBlocks] = useState<ContentBlock[]>([])

  const supabase = createClient()

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error || !data || data.length === 0) {
        // Fallback mock posts
        setPosts([
          {
            id: "p1",
            title_en: "Why Startups Should Choose Custom Software Over Templates",
            slug: "why-startups-should-choose-custom-software",
            status: "published",
            published_at: new Date().toISOString(),
            category: "SaaS & Web",
            tags: ["SaaS", "Startup"],
            cover_image: "/blog/custom-vs-templates.jpg"
          },
          {
            id: "p2",
            title_en: "How Practical AI is Transforming Customer Support Automation",
            slug: "practical-ai-customer-support-automation",
            status: "draft",
            published_at: null,
            category: "Artificial Intelligence",
            tags: ["AI", "Automation"],
            cover_image: "/blog/ai-support.jpg"
          }
        ])
      } else {
        setPosts(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const startEdit = (post: any) => {
    setEditingPost(post)
    setTitle(post.title_en || post.title || "")
    setSlug(post.slug || "")
    setStatus(post.status || "draft")
    setSeoTitle(post.seo_title_en || "")
    setSeoDesc(post.seo_description_en || "")
    setCoverImage(post.cover_image || "")
    setCategory(post.category || "SaaS & Web")
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "")
    setBlocks(post.content || [
      { id: "b1", type: "p", text: "Start writing your article here..." }
    ])
  }

  const startCreate = () => {
    startEdit({
      id: "new",
      title_en: "Untitled Article",
      slug: "untitled-article",
      status: "draft",
      category: "SaaS & Web",
      content: [
        { id: "b1", type: "p", text: "Start writing your article here..." }
      ]
    })
  }

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      text: type === "code" ? "// Type your code here" : "New block text",
      codeLanguage: type === "code" ? "typescript" : null
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlockText = (id: string, text: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, text } : b))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
  }

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === blocks.length - 1) return
    const nextIndex = direction === "up" ? index - 1 : index + 1
    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[nextIndex] as ContentBlock
    newBlocks[nextIndex] = temp!
    setBlocks(newBlocks)
  }

  const savePost = async () => {
    const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean)
    const payload = {
      title_en: title,
      title_ar: title,
      slug,
      status,
      seo_title_en: seoTitle,
      seo_description_en: seoDesc,
      cover_image: coverImage,
      category,
      tags: parsedTags,
      content: blocks,
      reading_time: Math.max(1, Math.ceil(blocks.reduce((acc, b) => acc + b.text.split(" ").length, 0) / 200)),
      published_at: status === "published" ? new Date().toISOString() : null
    }

    if (editingPost.id === "new") {
      const { error } = await supabase.from("blog_posts").insert([payload])
      if (error) {
        alert("Failed to insert: " + error.message)
      } else {
        alert("Post created successfully!")
        fetchPosts()
        setEditingPost(null)
      }
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingPost.id)
      if (error) {
        alert("Failed to update: " + error.message)
      } else {
        alert("Post updated successfully!")
        fetchPosts()
        setEditingPost(null)
      }
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return
    await supabase.from("blog_posts").delete().eq("id", id)
    setPosts(posts.filter(p => p.id !== id))
  }

  if (editingPost) {
    return (
      <div className="space-y-8 pb-16">
        {/* Editor Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <button 
            onClick={() => setEditingPost(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex gap-4">
            <button 
              onClick={savePost}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow-md"
            >
              <Save className="w-4 h-4" /> Save Post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Visual Editor */}
          <div className="col-span-2 space-y-6">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title..."
              className="w-full text-4xl font-extrabold bg-transparent border-none outline-none placeholder:text-muted-foreground/60 text-foreground"
            />
            
            {/* Notion-like Blocks Container */}
            <div className="space-y-4 pt-6 border-t border-border/40 min-h-[400px]">
              {blocks.map((b, idx) => (
                <div key={b.id} className="group relative flex items-start gap-3">
                  {/* Block Actions Menu (hover triggers) */}
                  <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-secondary/80 p-1 rounded-md border border-border/60">
                    <button onClick={() => moveBlock(idx, "up")} className="p-0.5 hover:bg-card rounded text-muted-foreground"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => moveBlock(idx, "down")} className="p-0.5 hover:bg-card rounded text-muted-foreground"><ArrowDown className="w-3 h-3" /></button>
                    <button onClick={() => deleteBlock(b.id)} className="p-0.5 hover:bg-card rounded text-destructive"><Trash2 className="w-3 h-3" /></button>
                  </div>

                  {/* Rendering different block types */}
                  {b.type === "p" && (
                    <textarea
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Start writing paragraph..."
                      className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed placeholder:text-muted-foreground text-foreground"
                    />
                  )}
                  {b.type === "h2" && (
                    <input
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Heading 2"
                      className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-foreground"
                    />
                  )}
                  {b.type === "h3" && (
                    <input
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Heading 3"
                      className="flex-1 bg-transparent border-none outline-none text-lg font-semibold text-foreground"
                    />
                  )}
                  {b.type === "code" && (
                    <textarea
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      className="flex-1 bg-secondary/30 p-4 rounded-lg font-mono text-xs text-emerald-400 outline-none border border-border/40 min-h-[100px]"
                    />
                  )}
                  {b.type === "quote" && (
                    <textarea
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Write quote..."
                      className="flex-1 border-l-4 border-primary pl-4 bg-transparent outline-none italic text-muted-foreground text-sm"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Block inserter menu */}
            <div className="pt-6 border-t border-border/30 flex gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground self-center mr-2">Insert:</span>
              {[
                { label: "Paragraph", type: "p" },
                { label: "H2 Header", type: "h2" },
                { label: "H3 Header", type: "h3" },
                { label: "Code Block", type: "code" },
                { label: "Blockquote", type: "quote" },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => addBlock(opt.type as any)}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs rounded-lg border border-border/60 transition-colors"
                >
                  + {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar configuration metadata settings */}
          <div className="bg-card border border-border/80 rounded-xl p-6 space-y-6 h-fit">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border/40 pb-2">Publish Settings</h3>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground block">Slug</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground block">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground block">Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground block">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="SaaS, Web, React"
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground block">Featured Image URL</label>
                <input 
                  type="text" 
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground"
                />
              </div>
            </div>

            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border/40 pb-2 pt-4">SEO Config</h3>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground block">SEO Title</label>
                <input 
                  type="text" 
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground block">SEO Description</label>
                <textarea 
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog CMS</h1>
          <p className="text-muted-foreground text-sm">Create, publish, edit, or delete articles on the Aivora website without code pushes.</p>
        </div>
        <button 
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow-md"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </button>
      </div>

      {/* Grid of posts */}
      <div className="border border-border/50 rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Title</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Slug</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-right text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {post.title_en || post.title}
                </td>
                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">/{post.slug}</td>
                <td className="px-6 py-4 text-muted-foreground capitalize">{post.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button 
                    onClick={() => startEdit(post)}
                    className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
