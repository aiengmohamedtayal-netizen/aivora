"use client"

import { useState, useEffect } from "react"
import { createClient } from "@aivora/lib/supabase/client"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { LoadingState } from "@/components/admin/LoadingState"
import { Plus, Trash2, Edit2, FileText, Image as ImageIcon, Save, ArrowLeft, ArrowUp, ArrowDown, Search } from "lucide-react"

type ContentBlock = {
  id: string
  type: "p" | "h2" | "h3" | "code" | "quote" | "image"
  text: string
  codeLanguage?: string | null
}

export default function BlogCMSPage() {
  const t = useTranslations("admin.Blog")
  const supabase = createClient()

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

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (e) {
      console.error("Failed to load blog posts", e)
      setPosts([])
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
      <div className="space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        {/* Editor Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <button 
            onClick={() => setEditingPost(null)}
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to CMS
          </button>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              status === 'published' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            }`}>
              {status.toUpperCase()}
            </span>
            <button 
              onClick={savePost}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Save className="w-4 h-4" /> Save Article
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Editor */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title..."
              className="w-full text-3xl md:text-4xl font-extrabold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground"
            />
            
            {/* Notion-like Blocks Container */}
            <div className="space-y-4 pt-6 border-t border-border/40 min-h-[400px]">
              {blocks.map((b, idx) => (
                <div key={b.id} className="group relative flex items-start gap-3">
                  {/* Block Actions Menu (hover triggers) */}
                  <div className="absolute -left-20 top-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-secondary/80 p-1 rounded-md border border-border/60 z-10 shadow-sm backdrop-blur-md">
                    <button onClick={() => moveBlock(idx, "up")} className="p-1 hover:bg-card rounded text-muted-foreground transition-colors"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveBlock(idx, "down")} className="p-1 hover:bg-card rounded text-muted-foreground transition-colors"><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteBlock(b.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>

                  {/* Rendering different block types */}
                  {b.type === "p" && (
                    <textarea
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Start writing paragraph..."
                      className="flex-1 bg-transparent border-none outline-none resize-none text-sm md:text-base leading-relaxed placeholder:text-muted-foreground/50 text-foreground min-h-[100px]"
                    />
                  )}
                  {b.type === "h2" && (
                    <input
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Heading 2"
                      className="flex-1 bg-transparent border-none outline-none text-2xl font-bold text-foreground mt-4"
                    />
                  )}
                  {b.type === "h3" && (
                    <input
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Heading 3"
                      className="flex-1 bg-transparent border-none outline-none text-xl font-semibold text-foreground mt-2"
                    />
                  )}
                  {b.type === "code" && (
                    <textarea
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      className="flex-1 bg-secondary/40 p-5 rounded-xl font-mono text-xs md:text-sm text-emerald-400 outline-none border border-border/60 min-h-[150px] custom-scrollbar shadow-inner"
                    />
                  )}
                  {b.type === "quote" && (
                    <textarea
                      value={b.text}
                      onChange={(e) => updateBlockText(b.id, e.target.value)}
                      placeholder="Write quote..."
                      className="flex-1 border-l-4 border-primary pl-5 py-2 bg-secondary/10 rounded-r-lg outline-none italic text-muted-foreground text-sm md:text-base leading-relaxed resize-none min-h-[80px]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Block inserter menu */}
            <div className="pt-8 pb-4 border-t border-border/30 flex gap-2 flex-wrap items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">Insert Block:</span>
              {[
                { label: "Paragraph", type: "p" },
                { label: "H2 Header", type: "h2" },
                { label: "H3 Header", type: "h3" },
                { label: "Code", type: "code" },
                { label: "Quote", type: "quote" },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => addBlock(opt.type as any)}
                  className="px-3.5 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs rounded-lg border border-border/60 transition-colors shadow-sm"
                >
                  + {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar configuration metadata settings */}
          <div className="col-span-1">
            <div className="bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-6 space-y-8 sticky top-24 shadow-sm">
              <div className="space-y-4">
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Post Metadata
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="space-y-1.5">
                    <label className="text-foreground font-medium">URL Slug</label>
                    <input 
                      type="text" 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full p-2.5 bg-background border border-border/80 rounded-lg outline-none text-foreground focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground font-medium">Visibility</label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-background border border-border/80 rounded-lg outline-none text-foreground cursor-pointer focus:border-primary transition-colors"
                    >
                      <option value="draft">Draft (Hidden)</option>
                      <option value="published">Published (Public)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground font-medium">Category</label>
                    <input 
                      type="text" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 bg-background border border-border/80 rounded-lg outline-none text-foreground focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground font-medium">Tags <span className="text-muted-foreground font-normal">(Comma separated)</span></label>
                    <input 
                      type="text" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="SaaS, Web, React"
                      className="w-full p-2.5 bg-background border border-border/80 rounded-lg outline-none text-foreground focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground font-medium">Cover Image Path/URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="/blog/image.jpg"
                        className="w-full pl-9 pr-4 py-2.5 bg-background border border-border/80 rounded-lg outline-none text-foreground focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/40">
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4" /> SEO Optimization
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="space-y-1.5">
                    <label className="text-foreground font-medium">Meta Title</label>
                    <input 
                      type="text" 
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Overrides default title"
                      className="w-full p-2.5 bg-background border border-border/80 rounded-lg outline-none text-foreground focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground font-medium">Meta Description</label>
                    <textarea 
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      placeholder="Brief summary for search engines..."
                      className="w-full p-2.5 bg-background border border-border/80 rounded-lg outline-none text-foreground min-h-[100px] resize-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader title={t("title")} description={t("subtitle")}>
        <button 
          onClick={startCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Article
        </button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Loading articles..." />
      ) : posts.length === 0 ? (
        <EmptyState 
          icon={FileText} 
          title="No Articles Published" 
          description="Your blog is empty. Start writing content to engage your audience and improve SEO." 
        />
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden bg-card/60 backdrop-blur-md shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 border-b border-border/60">
                <tr>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Title</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">URL Slug</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-medium text-right text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border/60 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      {post.title_en || post.title}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-[11px] bg-secondary/20 rounded">/{post.slug}</td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground text-xs font-medium capitalize border border-border/40 bg-secondary/50 px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border ${
                        post.status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => startEdit(post)}
                          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/60"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
