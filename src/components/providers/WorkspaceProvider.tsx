"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";

export interface Task {
  id: string;
  title: string;
  status: string;
  priority: "P1" | "P2" | "P3" | "P4";
  assignee: { name: string; fallback: string; src?: string };
  dueDate: string;
  project: string;
  comments: number;
  attachments: number;
  subtasks: { completed: number; total: number };
  description?: string;
  start?: number;
  duration?: number;
  dependencies?: string[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  tasks: number;
  status: string;
  statusColor: string;
}

export interface Lead {
  id: string;
  company: string;
  type: string;
  value: string;
  status: string;
  confidence: number;
  icon: string;
}

interface WorkspaceContextType {
  tasks: Task[];
  projects: Project[];
  leads: Lead[];
  addTask: (task: Omit<Task, "id" | "comments" | "attachments">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  convertLead: (leadId: string) => void;
  isLoading: boolean;
}

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: "AX-101", title: "User interview synthesis", status: "todo", priority: "P2", assignee: { name: "Solomon", fallback: "SK" }, dueDate: "Jan 25", project: "Axis Platform", comments: 4, attachments: 2, subtasks: { completed: 0, total: 5 } },
    { id: "AX-102", title: "Finalize brand guidelines", status: "in-progress", priority: "P1", assignee: { name: "Solomon", fallback: "SK" }, dueDate: "Today", project: "Axis Platform", comments: 0, attachments: 5, subtasks: { completed: 2, total: 3 } },
    { id: "AX-104", title: "Define design tokens", status: "todo", priority: "P1", assignee: { name: "Emma", fallback: "EM" }, dueDate: "Today", project: "Axis Platform", comments: 12, attachments: 1, subtasks: { completed: 3, total: 8 } },
    { id: "AX-98", title: "QA Mobile responsiveness", status: "review", priority: "P3", assignee: { name: "Jack", fallback: "JD" }, dueDate: "Jan 22", project: "Axis Platform", comments: 8, attachments: 0, subtasks: { completed: 5, total: 5 } },
  ]);

  const [projects, setProjects] = React.useState<Project[]>([
    { id: "axis-platform", name: "Axis Platform", client: "Internal", progress: 65, tasks: 24, status: "In Progress", statusColor: "text-status-progress-text bg-status-progress-bg" },
    { id: "regent-portal", name: "Regent Portal", client: "Regent CAD", progress: 92, tasks: 4, status: "In Review", statusColor: "text-status-review-text bg-status-review-bg" },
    { id: "forge-cms", name: "Forge CMS", client: "Forge Inc.", progress: 12, tasks: 45, status: "In Progress", statusColor: "text-status-progress-text bg-status-progress-bg" },
  ]);

  const [leads, setLeads] = React.useState<Lead[]>([
    { id: "lead-1", company: "Global Motors", type: "Manufacturing", value: "$45k", status: "Negotiation", confidence: 85, icon: "🏭" },
    { id: "lead-2", company: "Horizon Tech", type: "SaaS", value: "$120k", status: "Qualified", confidence: 60, icon: "☁️" },
    { id: "lead-3", company: "Lunar Optics", type: "R&D", value: "$28k", status: "Discovery", confidence: 45, icon: "🔭" },
  ]);

  const [isLoading, setIsLoading] = React.useState(false);

  // Load initial data from Supabase if configured
  React.useEffect(() => {
    const fetchInitialData = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

      setIsLoading(true);
      try {
        const { data: tasksData } = await supabase.from('tasks').select('*');
        const { data: projectsData } = await supabase.from('projects').select('*');
        const { data: leadsData } = await supabase.from('leads').select('*');

        if (tasksData) setTasks(tasksData);
        if (projectsData) setProjects(projectsData);
        if (leadsData) setLeads(leadsData);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const addTask = async (task: Omit<Task, "id" | "comments" | "attachments">) => {
    const newId = `AX-${Math.floor(100 + Math.random() * 900)}`;
    const newTask = { ...task, id: newId, comments: 0, attachments: 0 } as Task;

    setTasks([...tasks, newTask]);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('tasks').insert([newTask]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('tasks').update(updates).eq('id', id);
    }
  };

  const convertLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const newProject: Project = {
      id: lead.company.toLowerCase().replace(/\s+/g, "-"),
      name: lead.company,
      client: lead.company,
      progress: 0,
      tasks: 0,
      status: "In Progress",
      statusColor: "text-status-progress-text bg-status-progress-bg"
    };

    setProjects([...projects, newProject]);
    setLeads(leads.filter(l => l.id !== leadId));
  };

  return (
    <WorkspaceContext.Provider value={{ tasks, projects, leads, addTask, updateTask, convertLead, isLoading }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
