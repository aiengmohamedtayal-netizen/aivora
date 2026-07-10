"use client"

import { useState } from "react"
import { 
  FolderKanban, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  Trash2, 
  User, 
  Activity 
} from "lucide-react"

type Task = {
  id: string
  title: string
  project: string
  assignee: string
  status: "todo" | "in_progress" | "review" | "done"
}

export default function ProjectsTasksPage() {
  const [projects, setProjects] = useState<any[]>([
    { id: "p1", name: "AI CRM Platform", client: "Riyadh Tech", progress: 75, deadline: "July 24, 2026", budget: "$8,500" },
    { id: "p2", name: "E-Commerce Re-Architecture", client: "Dubai Retail", progress: 40, deadline: "Aug 12, 2026", budget: "$4,200" },
    { id: "p3", name: "Multi-tenant SaaS Core", client: "SaaS Startups", progress: 15, deadline: "Sept 5, 2026", budget: "$12,000" },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", title: "Setup PostgreSQL RLS migration", project: "AI CRM", assignee: "Khalid", status: "in_progress" },
    { id: "t2", title: "Verify news-sitemap against Google News schema", project: "E-Commerce", assignee: "Sarah", status: "todo" },
    { id: "t3", title: "Refactor Next 15 Dynamic parameters types", project: "SaaS Core", assignee: "Sarah", status: "done" },
    { id: "t4", title: "Implement Resend HTML template batch sender", project: "AI CRM", assignee: "Sarah", status: "review" },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskProject, setNewTaskProject] = useState("AI CRM")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      project: newTaskProject,
      assignee: "Sarah",
      status: "todo"
    }
    setTasks([...tasks, task])
    setNewTaskTitle("")
  }

  const updateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const stages: { id: Task["status"]; name: string; color: string }[] = [
    { id: "todo", name: "To Do", color: "border-t-orange-500 bg-orange-500/5" },
    { id: "in_progress", name: "In Progress", color: "border-t-blue-500 bg-blue-500/5" },
    { id: "review", name: "Code Review", color: "border-t-purple-500 bg-purple-500/5" },
    { id: "done", name: "Completed", color: "border-t-emerald-500 bg-emerald-500/5" },
  ]

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects & Tasks</h1>
        <p className="text-muted-foreground text-sm">Coordinate project milestones, client deliverables, and engineering tasks.</p>
      </div>

      {/* Active Projects Tracker */}
      <div className="bg-card border border-border/80 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-primary" /> Client Project Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="p-5 border border-border rounded-xl bg-secondary/15 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{proj.name}</h3>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{proj.client}</span>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{proj.budget}</span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                  <span>Progress</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {proj.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Kanban Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Operations Kanban Board
          </h2>

          <form onSubmit={handleAddTask} className="flex gap-2 items-center">
            <input 
              type="text" 
              placeholder="New Task Title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="px-3 py-1.5 bg-card border border-border/80 rounded-lg text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground w-48"
            />
            <select 
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(e.target.value)}
              className="bg-card text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="AI CRM">AI CRM</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="SaaS Core">SaaS Core</option>
            </select>
            <button 
              type="submit"
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {stages.map((stage) => {
            const stageTasks = tasks.filter(t => t.status === stage.id)
            return (
              <div key={stage.id} className={`border-t-4 rounded-xl border border-border p-4 flex flex-col max-h-[50vh] ${stage.color}`}>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/40">
                  <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">{stage.name}</h3>
                  <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">{stageTasks.length}</span>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1">
                  {stageTasks.map((t, index) => (
                    <div key={t.id} className="p-3 bg-card border border-border/80 rounded-lg shadow-sm space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium text-xs text-foreground leading-normal">{t.title}</span>
                        <button 
                          onClick={() => deleteTask(t.id)}
                          className="text-muted-foreground hover:text-destructive p-0.5 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-1 border-t border-border/30">
                        <span className="font-semibold uppercase bg-secondary px-1.5 py-0.5 rounded text-[8px]">{t.project}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {t.assignee}</span>
                      </div>

                      {/* Dropdown status selector */}
                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                        className="w-full bg-secondary/50 text-[9px] text-muted-foreground border border-border/60 rounded px-1 py-0.5 outline-none cursor-pointer"
                      >
                        {stages.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}

                  {stageTasks.length === 0 && (
                    <div className="py-8 text-center text-[10px] text-muted-foreground border border-dashed border-border/40 rounded-lg">
                      No tasks in stage
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
