# Regent Project Manager
### Product Plan & Development Roadmap
**Owner:** Regent Systems | **Status:** Pre-Development | **Last Updated:** April 2026

---

## Table of Contents
1. [Vision & Mission](#1-vision--mission)
2. [Target Users & Personas](#2-target-users--personas)
3. [Competitive Landscape](#3-competitive-landscape)
4. [System Architecture Overview](#4-system-architecture-overview)
5. [Core Concepts & Data Model](#5-core-concepts--data-model)
6. [Views & Navigation](#6-views--navigation)
7. [Feature Checklist by Module](#7-feature-checklist-by-module)
8. [Design & UX Principles](#8-design--ux-principles)
9. [Tech Stack](#9-tech-stack)
10. [Development Phases](#10-development-phases)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Integrations Roadmap](#12-integrations-roadmap)
13. [Monetisation & Plans](#13-monetisation--plans)
14. [Open Questions & Decisions](#14-open-questions--decisions)

---

## 1. Vision & Mission

**Vision:**  
Regent Project Manager is a modern, flexible project and work management platform for teams and organisations of every kind — from a two-person creative studio running a single campaign, to a 200-person engineering org shipping software across ten concurrent projects. It gives teams the views, workflows, and collaboration tools they need to plan, execute, and deliver, without getting in the way.

**Mission:**  
To make project management feel less like administration and more like clarity — giving every team member a single place to know what to do, when to do it, and how their work fits the bigger picture.

**Core Promise:**  
> Every project. Every team. Every view. One place.

**Positioning:**  
Regent PM sits between lightweight tools like Trello (too simple for complex orgs) and heavyweight tools like Jira (too rigid and developer-focused). It targets teams that have outgrown Trello but don't need Jira's complexity — the same space where Notion, Linear, and Asana compete, but with a cleaner, faster, more opinionated UX.

---

## 2. Target Users & Personas

| Segment | Description |
|---|---|
| **Primary** | SME teams (5–100 members) across industries: tech, marketing, construction, consulting, events |
| **Secondary** | Freelancers and agencies managing client projects |
| **Tertiary** | Larger organisations needing a PM layer that connects to Regent Axis (finance/HR) |

### Key Personas

**1. The Project Manager / Team Lead**  
Needs to see all tasks across all team members, track deadlines, spot blockers early, and report progress to stakeholders. Cares most about Timeline, Workload, and Reporting views.

**2. The Individual Contributor**  
Wants to know exactly what they need to do today and in what order. Cares about My Tasks, notifications, and a clean task detail view without noise.

**3. The Exec / Stakeholder**  
Checks in weekly for a high-level view of project health. Doesn't want to dig into tasks. Cares about portfolio dashboards, status reports, and milestone tracking.

**4. The Agency Account Manager**  
Manages multiple client projects simultaneously. Needs client-specific workspaces, guest access for clients, and the ability to generate clean progress reports.

**5. The Developer / Technical Lead**  
Wants Git-like workflows: sprint planning, ticket assignment, priority labels, and integration with their code tools. Cares about backlog management and sprint views.

---

## 3. Competitive Landscape

| Tool | Strength | Weakness | Our Edge |
|---|---|---|---|
| **Trello** | Simple Kanban, easy onboarding | No timeline, no dependencies, no reporting | More powerful without more complexity |
| **Asana** | Polished, multiple views, great for marketing teams | Expensive, can feel bloated | Cleaner, faster, better value |
| **Jira** | Excellent for dev teams, deep customisation | Steep learning curve, overwhelming for non-devs | Accessible to all team types |
| **Monday.com** | Flexible, good automations | Expensive, spreadsheet-heavy feel | More opinionated, better UX defaults |
| **Linear** | Beautiful, very fast, dev-focused | Too narrow for non-tech teams | Broader industry applicability |
| **Notion** | All-in-one docs + tasks | Weak project management, slow | Purpose-built PM experience |

**Our differentiators:**
- Native integration with Regent Axis (financial tracking per project, resource costs, payroll-aware workload)
- Built for both technical and non-technical teams from day one
- Africa/emerging-market-aware: offline-resilient, mobile-first on core flows, local payment gateways
- Clean, opinionated defaults with room to customise — not a blank canvas

---

## 4. System Architecture Overview

Regent PM is a **multi-tenant SaaS platform** where each organisation gets an isolated workspace. Within a workspace, teams manage multiple projects, and projects contain tasks, timelines, files, and conversations.

```
Regent PM Workspace (Org-level)
│
├── Portfolio Layer (cross-project views, org-wide dashboards)
│
├── Projects
│   ├── Views: Kanban / Timeline / List / Calendar / Table / Workload / Mind Map
│   ├── Tasks (with subtasks, assignees, dates, custom fields, dependencies)
│   ├── Docs & Files (project-level knowledge base and attachments)
│   ├── Conversations (threaded comments, @mentions, announcements)
│   └── Automations (rules engine per project)
│
├── My Work (personal task inbox, assigned tasks, upcoming deadlines)
│
├── People & Teams (members, roles, team groupings, workload)
│
├── Reporting & Analytics (cross-project, per-project, per-person)
│
├── Integrations Layer (Regent Axis, GitHub, Slack, etc.)
│
└── Settings (org, billing, roles, custom fields, templates)
```

---

## 5. Core Concepts & Data Model

Understanding the hierarchy is critical before any build begins.

### Hierarchy
```
Organisation
└── Workspace
    ├── Teams (groupings of members)
    └── Projects
        ├── Sections / Columns (Kanban columns or list groups)
        │   └── Tasks
        │       ├── Subtasks
        │       ├── Comments
        │       ├── Attachments
        │       ├── Activity log
        │       └── Custom fields
        ├── Milestones
        ├── Docs
        └── Project Members
```

### Key Entities

**Project**
- Name, description, status, colour/icon
- Start date, end date
- Project owner + members
- Project type (Software, Marketing, Operations, Client Work, Internal, etc.)
- Privacy (public to org / team-only / invite-only)
- Template origin (if created from a template)
- Linked to Axis org (for budget and resource cost tracking)

**Task**
- Title, description (rich text)
- Status (configurable per project: e.g. To Do → In Progress → In Review → Done)
- Assignee(s) — supports multiple
- Due date + start date
- Priority (Urgent, High, Medium, Low, None)
- Labels / tags (custom, colour-coded)
- Estimated time (hours)
- Logged time (actual)
- Parent task (for subtasks)
- Dependencies (blocks / is blocked by)
- Attachments
- Comments (threaded)
- Custom fields
- Recurring schedule

**Milestone**
- Name, due date
- Linked tasks (tasks that must be complete before milestone)
- Status: On Track / At Risk / Delayed / Completed
- Displayed prominently on Timeline view

**Section / Column**
- Organises tasks within a project
- On Kanban: columns (e.g. Backlog, In Progress, Done)
- On List/Table: grouping headers
- WIP limits (optional, for Kanban)

**Custom Fields**
- Text, Number, Date, Dropdown, Multi-select, Checkbox, URL, Person, Currency
- Defined at project or org level
- Can be made visible/hidden per view

---

## 6. Views & Navigation

This is the heart of Regent PM — multiple views over the same underlying data. Switching views never loses data.

### 6.1 Kanban Board
The default view for most projects. Tasks as cards, columns as statuses or custom groupings.

**Features:**
- [x] Drag-and-drop cards between columns
- [ ] Drag-and-drop to reorder within a column
- [ ] Configurable columns (add, rename, reorder, delete, set colour)
- [ ] WIP limits per column (optional — turns column red when exceeded)
- [ ] Card quick-edit (change assignee, due date, priority without opening task)
- [ ] Card colour coding by label, assignee, priority, or custom field
- [ ] Collapsed columns
- [ ] Card cover images (from attachments)
- [ ] Group by: Assignee / Priority / Label / Custom Field
- [ ] Filter by: Assignee / Due date / Priority / Label / Custom field value
- [x] Search within board
- [ ] Swimlanes (group rows by assignee, team, or epic)
- [x] Sub-task progress indicator on card
- [ ] Blocked task indicator (dependency not resolved)

### 6.2 Timeline (Gantt)
For project managers and stakeholders who need to see work over time and manage dependencies.

**Features:**
- [x] Tasks displayed as horizontal bars on a date axis
- [ ] Drag to move task dates
- [ ] Drag to extend/shorten task duration
- [ ] Dependency lines (arrows) between tasks (Finish-to-Start, Start-to-Start, etc.)
- [ ] Drag to create new dependencies
- [ ] Milestones as diamond markers on the timeline
- [ ] Group rows by: Section / Assignee / Priority / Label
- [ ] Zoom levels: Day / Week / Month / Quarter / Year
- [x] Today indicator line
- [ ] Baseline comparison (compare current schedule to original plan)
- [ ] Critical path highlighting (tasks that directly affect project end date)
- [ ] Colour coding by assignee or status
- [ ] Collapse/expand grouped rows
- [ ] Export timeline as image (PNG) or PDF
- [ ] Mini-map for long timelines (thumbnail scrubber)
- [ ] Unscheduled tasks sidebar (drag onto timeline to schedule)

### 6.3 List View
A flat, scannable, sortable task list — preferred by users who want spreadsheet-like density.

**Features:**
- [x] All tasks in a single scrollable list
- [ ] Inline editing of any field (title, date, assignee, priority, status, custom fields)
- [ ] Multi-select tasks for bulk actions
- [ ] Sort by: Name / Due Date / Priority / Assignee / Created / Custom field
- [ ] Group by: Section / Status / Assignee / Priority / Label / Due date / Custom field
- [ ] Filter panel (combine multiple filters with AND/OR logic)
- [ ] Show/hide columns (custom fields as columns)
- [x] Row density options (comfortable / compact)
- [ ] Subtask expansion inline
- [ ] Progress bar per section group
- [ ] Keyboard-friendly navigation and editing

### 6.4 Calendar View
For time-based planning and scheduling, especially useful for marketing, content, and events teams.

**Features:**
- [ ] Month, week, and day calendar layouts
- [ ] Tasks displayed on their due date
- [ ] Tasks with start + end dates shown as spanning events
- [ ] Drag task to reschedule (drag to new date on calendar)
- [ ] Colour by: Assignee / Priority / Label / Status
- [ ] Filter by assignee, label, project
- [ ] Quick-create task by clicking a date
- [ ] Milestones shown as distinct markers
- [ ] Week numbers
- [ ] "No date" tasks in a side panel

### 6.5 Table View
A fully editable spreadsheet-style grid over task data. Best for data-heavy projects and power users.

**Features:**
- [ ] All tasks as rows, fields as columns
- [ ] Add, remove, and reorder columns
- [ ] Inline cell editing for every field
- [ ] Column resizing
- [ ] Sort by any column
- [ ] Multi-column sorting
- [ ] Freeze columns (e.g. keep task name fixed while scrolling right)
- [ ] Row grouping with collapsible groups
- [ ] Formula-like rollup fields (sum hours, count tasks, average completion)
- [ ] Export to CSV / Excel
- [ ] Import tasks from CSV

### 6.6 Workload View
For resource management — understanding who is over-capacity and who has bandwidth.

**Features:**
- [ ] Team members as rows, dates as columns
- [ ] Task blocks showing each person's scheduled work per day/week
- [ ] Colour coding by capacity: Under / At capacity / Over capacity
- [ ] Drag tasks from one person's row to another's to reassign
- [ ] Filter by team, project, date range
- [ ] Set work hours per person (e.g. 8h/day) as capacity baseline
- [ ] Leave/holiday blocking (integrates with Axis HR leave records)
- [ ] Hover to see task detail
- [ ] Unassigned tasks panel for manual allocation

### 6.7 Mind Map View (Phase 2)
For brainstorming and planning project structure visually before committing to a task hierarchy.

**Features:**
- [ ] Free-form node-and-connection diagram
- [ ] Convert mind map nodes to tasks with one click
- [ ] Nest nodes as subtasks
- [ ] Drag to restructure hierarchy
- [ ] Colour nodes by type or priority
- [ ] Export as image
- [ ] Start from blank or from existing project structure

### 6.8 Dashboard / Portfolio View
Organisation-level or multi-project view for team leads and executives.

**Features:**
- [ ] Summary cards: total projects, tasks due today, overdue tasks, tasks completed this week
- [ ] Project health indicators (On Track / At Risk / Off Track — manually set or auto-calculated)
- [ ] Progress bars per project (% tasks complete)
- [ ] Milestone calendar across all projects
- [ ] Upcoming deadlines feed
- [ ] Team workload summary
- [ ] Configurable widget grid
- [ ] Filterable by team or project group

### 6.9 My Work (Personal View)
Each user's personal dashboard — the first thing they see on login.

**Features:**
- [ ] Inbox: tasks assigned to me, unseen comments/mentions
- [ ] My tasks section (grouped by project or due date)
- [ ] Today / This week / Upcoming tabs
- [ ] Overdue tasks highlighted
- [ ] Quick-add task from this view
- [ ] Recent activity feed (across all my projects)
- [ ] Pinned tasks
- [ ] Draft tasks (not yet added to a project)

---

## 7. Feature Checklist by Module

### 7.1 Task Management (Core)

- [x] Create task with title, description (rich text with formatting, checklists, embeds)
- [ ] Assign to one or multiple members
- [ ] Set due date and start date
- [ ] Set priority (Urgent / High / Medium / Low / None)
- [ ] Set status (per-project configurable statuses)
- [ ] Add labels / tags
- [ ] Add custom field values
- [x] Create subtasks (unlimited nesting depth, Phase 2)
- [ ] Set task dependencies (blocks / is blocked by / relates to)
- [ ] Attach files (upload or link from Google Drive, Dropbox, etc.)
- [ ] Link related tasks
- [ ] Set estimated time
- [x] Log time (manual entry or timer)
- [ ] Recurring tasks (daily, weekly, monthly, custom)
- [ ] Duplicate task
- [ ] Move task to another project or section
- [ ] Convert subtask to standalone task
- [ ] Convert task to project
- [ ] Task templates (save a configured task as reusable template)
- [ ] Archive and delete tasks
- [x] Full activity log on each task (who changed what, when)
- [ ] @mention team members in description or comments
- [ ] Emoji reactions on comments
- [ ] Resolve and reopen comments
- [ ] Pin important comments
- [ ] Task permalink (shareable URL)
- [ ] Print task detail

### 7.2 Project Management

- [ ] Create project (name, description, icon, colour, type, privacy)
- [ ] Project templates (create from scratch or use preset template)
- [ ] Preset templates: Software Sprint, Marketing Campaign, Event Planning, Client Onboarding, Product Launch, Construction Project, Content Calendar
- [ ] Set project start and end dates
- [ ] Set project status manually (On Track / At Risk / Delayed / On Hold / Completed)
- [ ] Project brief / overview section (rich text document pinned to project)
- [ ] Add and remove project members
- [ ] Set per-member role in project (Lead, Contributor, Viewer)
- [ ] Create and manage sections/columns within project
- [ ] Set default view per project
- [ ] Archive and delete projects
- [ ] Duplicate project (with or without tasks)
- [ ] Project-level custom fields
- [ ] Project-level automations
- [ ] Project activity feed
- [ ] Link project to Regent Axis budget/client (Phase 2)
- [ ] Project tags (for portfolio filtering)
- [ ] Project colour and cover image

### 7.3 Milestones

- [ ] Create milestone with name and due date
- [ ] Link tasks to milestone
- [ ] Auto-calculate milestone completion % from linked tasks
- [ ] Set milestone status (On Track / At Risk / Delayed / Completed)
- [ ] Milestones visible in Timeline, Calendar, and Portfolio views
- [ ] Milestone notification to project members when due date is near
- [ ] Milestone completion celebration (micro-animation)
- [ ] Milestone history and log

### 7.4 Collaboration & Communication

- [ ] Per-task threaded comments
- [ ] Project-level announcements (pinned messages visible to all project members)
- [ ] @mention anyone in the org
- [ ] Rich text in comments (bold, links, code, bullet lists)
- [ ] File attachments in comments
- [ ] Emoji reactions
- [ ] Unread comment indicators
- [ ] Notification centre (in-app) — all mentions, assignments, status changes
- [ ] Email notifications (configurable per event type per user)
- [ ] Daily/weekly digest email option
- [ ] Mute notifications per project
- [ ] Real-time presence indicators (who else is viewing this task/project right now)
- [ ] Guest access (invite external stakeholders or clients as view-only or comment-only)

### 7.5 Automations

A no-code rules engine: **WHEN [trigger] → IF [condition] → THEN [action]**

**Triggers:**
- [ ] Task status changes
- [ ] Task created
- [ ] Due date arrives / is approaching
- [ ] Task assigned to someone
- [ ] Custom field value changes
- [ ] Task moved to a section
- [ ] Subtask completed
- [ ] Comment added
- [ ] Milestone status changes

**Conditions:**
- [ ] Task priority equals X
- [ ] Assignee is X
- [ ] Label includes X
- [ ] Due date is overdue
- [ ] Custom field value matches

**Actions:**
- [ ] Change task status
- [ ] Assign to a member
- [ ] Set due date (relative: +3 days from trigger)
- [ ] Add label
- [ ] Move to section
- [ ] Create a new task (from template)
- [ ] Send notification to a member or channel
- [ ] Post comment on task
- [ ] Trigger Webhook (for external integrations)
- [ ] Mark task complete

**Preset automation templates:**
- [ ] "When task is moved to Done → mark complete and notify assignee"
- [ ] "When due date passes → change priority to Urgent"
- [ ] "When task is created in Backlog → assign to project lead"
- [ ] "When all subtasks complete → mark parent complete"

### 7.6 Reporting & Analytics

- [ ] Project progress report (% complete, tasks by status, tasks by assignee)
- [ ] Time tracking report (estimated vs actual per project, per person)
- [ ] Workload report (tasks per person per period)
- [ ] Overdue tasks report
- [ ] Completed tasks report (by date range)
- [ ] Velocity chart (tasks completed per week over time)
- [ ] Burndown chart (for sprint-based projects)
- [ ] Cumulative flow diagram (Kanban health)
- [ ] Custom report builder (choose metrics, group by, date range)
- [ ] Cross-project portfolio report
- [ ] Export reports as PDF or CSV
- [ ] Scheduled report delivery (email a report every Monday, etc.)
- [ ] Report sharing (public link or to specific members)

### 7.7 Time Tracking

- [ ] Start/stop timer on any task
- [ ] Manual time log entry (date, duration, notes)
- [ ] View total logged time per task, project, and member
- [ ] Set time estimates on tasks
- [ ] Time tracking report with estimated vs actual comparison
- [ ] Billable / non-billable time toggle
- [ ] Export time logs (CSV)
- [ ] Integration with Axis invoicing (billable hours → invoice line item)

### 7.8 Documents & Knowledge Base

- [ ] Per-project wiki/docs section
- [ ] Rich text document editor (headings, tables, code blocks, images, embeds, checklists)
- [ ] Nested pages (parent/child doc hierarchy)
- [ ] Link documents to tasks
- [ ] Version history (restore previous versions)
- [ ] Document-level access control
- [ ] Full-text search across all project docs
- [ ] Real-time collaborative editing (Phase 2)
- [ ] Embed external links, YouTube, Figma, etc.
- [ ] Export doc as PDF or Markdown

### 7.9 Search & Navigation

- [ ] Global search (tasks, projects, docs, members, comments)
- [ ] Filter search by type, project, date, assignee
- [ ] Search history / recent items
- [ ] Keyboard shortcut to open search (Cmd/Ctrl + K)
- [ ] Deep-link URLs for every task, project, doc, and view
- [ ] Recently visited pages section in sidebar
- [ ] Pinned/starred projects in sidebar
- [ ] Quick task creation from anywhere (keyboard shortcut)
- [ ] Command palette (keyboard-first power user navigation)

### 7.10 Notifications & Inbox

- [ ] Notification for: assignment, mention, due date approaching, comment, status change, milestone update, automation trigger
- [ ] In-app notification inbox with read/unread states
- [ ] Mark all as read
- [ ] Notification grouping (batch "5 updates in Project X")
- [ ] Browser push notifications (opt-in)
- [ ] Email notification preferences per event type
- [ ] Slack / WhatsApp notification forwarding (Phase 2)
- [ ] Snooze notifications

### 7.11 People & Teams

- [ ] Org-level member directory
- [ ] Create teams (groups of members: e.g. "Engineering", "Creative", "Sales")
- [ ] Assign teams to projects
- [ ] Member profiles (name, role, avatar, contact, active projects)
- [ ] Org-wide roles: Owner, Admin, Member, Guest
- [ ] Project-level roles: Lead, Contributor, Viewer, Commenter
- [ ] Invite via email with role assignment
- [ ] Deactivate members without losing their task history
- [ ] Transfer ownership of tasks/projects on member deactivation
- [ ] Activity summary per member

### 7.12 Templates Library

- [ ] Org-level custom templates (save any project or task as template)
- [ ] Regent-provided starter templates:
  - [ ] Software Development Sprint
  - [ ] Product Roadmap
  - [ ] Marketing Campaign
  - [ ] Event Planning
  - [ ] Client Onboarding
  - [ ] Content Calendar
  - [ ] Construction / Renovation Project
  - [ ] Go-to-Market Launch
  - [ ] Sales Pipeline
  - [ ] Bug Tracker
  - [ ] Employee Onboarding
  - [ ] Quarterly Goals (OKRs)
- [ ] Template preview before applying
- [ ] Community template library (Phase 3)

### 7.13 Guest & Client Access

- [ ] Invite external users (guests) to specific projects
- [ ] Guest roles: View only / Comment only / Edit tasks (no access to org settings)
- [ ] Guest access does not count towards seat limit (or counts at reduced rate)
- [ ] Branded client portal link (share project progress without login, Phase 2)
- [ ] Approval workflows (guest can approve/reject deliverables on tasks)
- [ ] NDA/acceptance gating before guest sees project (Phase 3)

### 7.14 Import & Export

- [ ] Import tasks from CSV (with column mapping)
- [ ] Import from Trello (JSON export)
- [ ] Import from Asana (CSV/JSON export)
- [ ] Import from Jira (CSV export)
- [ ] Export project tasks as CSV or Excel
- [ ] Export project as PDF (overview report)
- [ ] Export timeline as image or PDF
- [ ] Full workspace data export (JSON) for offboarding

---

## 8. Design & UX Principles

| Principle | Detail |
|---|---|
| **Speed above all** | The app should feel instant. Optimistic UI updates — don't wait for server confirmation to update the interface. |
| **Keyboard-first** | Power users should rarely need a mouse. Full keyboard navigation, command palette, global shortcuts. |
| **Views are the product** | Switching between Kanban, Timeline, List, Calendar should be seamless and feel like looking at the same data through different lenses. Never jarring. |
| **Progressive complexity** | New users see a simple, clean interface. Advanced features (automations, custom fields, dependencies) are there when you need them, invisible when you don't. |
| **Opinionated defaults** | Ship with sensible defaults (statuses, columns, priorities, templates). Don't force users to configure everything before they can start. |
| **Contextual actions** | Right-click context menus, hover actions, and inline edits everywhere. Minimal navigation away from the current view. |
| **Density toggle** | Users work differently. Support comfortable (spacious) and compact (dense) layout modes, especially in List and Table views. |
| **Dark mode** | Full dark mode from day one. Not an afterthought. |
| **Mobile core** | The full desktop experience isn't feasible on mobile, but the core flows must work: view my tasks, update task status, add a comment, check due dates. |
| **Delight in the details** | Micro-animations on drag-and-drop, milestone completions, confetti on project completion. Small moments of joy matter for daily-use tools. |

### Colour & Visual Language
- Dark-capable, with Regent brand palette applied across all UI
- Tasks and projects have colour-coding that is consistent across all views
- Status colours are globally consistent (Done = green, Overdue = red, In Progress = blue, etc.) with user-customisable overrides

---

## 9. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | React + TypeScript + Vite | Consistent with Regent ecosystem |
| **Styling** | Tailwind CSS + shadcn/ui | Shared design system |
| **State Management** | Zustand + TanStack Query | Local UI state + server state |
| **Drag and Drop** | `dnd-kit` | Accessible, performant, works on mobile |
| **Rich Text Editor** | Tiptap | Task descriptions, docs, comments |
| **Timeline / Gantt** | Custom built on top of D3 or `frappe-gantt` | Full control over UX behaviour |
| **Calendar** | FullCalendar or custom | |
| **Charts / Reports** | Recharts | Consistent with Axis |
| **Real-time** | Supabase Realtime (WebSockets) | Live updates, presence, cursors |
| **Backend / DB** | Supabase (PostgreSQL, Auth, Storage) | Multi-tenant with RLS |
| **File Storage** | Supabase Storage | Attachments, doc images |
| **Email** | Resend | Notifications, digests, guest invites |
| **Search** | PostgreSQL full-text search → Typesense (Phase 2) | Fast global search |
| **Hosting** | Vercel (frontend) + Supabase (backend) | |
| **Auth** | Supabase Auth | SSO / OAuth in Phase 2 |

---

## 10. Development Phases

### Phase 0 — Foundation *(Weeks 1–3)*
- [ ] Project scaffold (Vite + React + TS + Tailwind + shadcn)
- [ ] Supabase schema: orgs, workspaces, projects, members, roles
- [ ] Auth flow (signup, login, invite, org creation)
- [ ] Shell layout: sidebar (projects list, nav), topbar, command palette
- [ ] RBAC + RLS policies
- [ ] Design system tokens: colours, typography, spacing, shadows
- [ ] Base component library: Button, Input, Modal, Dropdown, Avatar, Badge, Tooltip

### Phase 1 — Core Task Engine *(Weeks 4–8)*
- [ ] Create, edit, delete, archive tasks
- [ ] Task detail panel (slide-in or full page)
- [ ] Subtasks (one level deep)
- [ ] Assignees, due date, priority, status, labels
- [ ] Sections within project
- [ ] Project-level custom statuses
- [ ] Task comments (basic, no threading yet)
- [ ] File attachments on tasks
- [ ] Activity log on tasks
- [ ] **Kanban view** (full implementation — drag, columns, filters)
- [ ] **List view** (full implementation — sort, group, inline edit)
- [ ] My Work page (assigned to me, due today/this week)
- [ ] Global search (basic)
- [ ] In-app notification centre

### Phase 2 — Time & Timeline *(Weeks 9–14)*
- [ ] **Timeline / Gantt view** (full implementation)
- [ ] Task dependencies (Finish-to-Start)
- [ ] Milestones
- [ ] **Calendar view**
- [ ] Recurring tasks
- [ ] Time tracking (start/stop timer + manual log)
- [ ] Time tracking report
- [ ] Threaded comments
- [ ] @mentions + notifications
- [ ] Email notifications (configurable)
- [ ] Project templates (Regent starter templates)
- [ ] Duplicate project / task

### Phase 3 — Collaboration & Power Features *(Weeks 15–22)*
- [ ] **Table view** (full implementation)
- [ ] **Workload view**
- [ ] Custom fields (all types)
- [ ] Automations engine (no-code rule builder)
- [ ] Project documents / wiki
- [ ] Guest access
- [ ] Real-time collaborative presence (who's online, who's editing)
- [ ] Reporting module (progress, velocity, burndown, custom)
- [ ] CSV import/export
- [ ] Trello import
- [ ] Portfolio / Dashboard view
- [ ] Project health status

### Phase 4 — Scale & Intelligence *(Weeks 23–32)*
- [ ] **Mind Map view**
- [ ] Advanced automations (webhooks, external triggers)
- [ ] Regent Axis integration (budget tracking, billable hours → invoices)
- [ ] Scheduled report delivery
- [ ] Advanced search (Typesense)
- [ ] Real-time collaborative document editing
- [ ] SSO / SAML for enterprise
- [ ] API access (REST + Webhooks)
- [ ] AI features (see below)
- [ ] Community template library
- [ ] Mobile app (React Native or PWA)
- [ ] Asana / Jira import

### AI Feature Roadmap (Phase 4+)
- [ ] AI task description writer (type a title, get a suggested description)
- [ ] Smart due date suggestions (based on similar past tasks)
- [ ] Automatic blocker detection ("Task B depends on Task A which is 5 days overdue")
- [ ] Natural language task creation ("Add a task to review the proposal, due Friday, assigned to James, high priority")
- [ ] Weekly AI project summary ("This week: 12 tasks completed, 3 overdue, sprint is 80% on track")
- [ ] Risk flagging ("4 tasks on the critical path have no assignee")
- [ ] AI-generated status reports for stakeholders

---

## 11. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Performance** | Page loads < 2s, Kanban board renders < 500ms for 200+ tasks |
| **Real-time** | Task status/comment updates visible to all viewers within < 500ms |
| **Drag-and-drop** | Smooth at 60fps with 200+ cards on screen |
| **Availability** | 99.9% uptime SLA |
| **Security** | RLS enforces tenant isolation at DB level. All data encrypted at rest and in transit. |
| **Auditability** | Every write operation logs user, timestamp, and delta |
| **Scalability** | Designed to support orgs with 100+ projects, 500+ members, 50,000+ tasks |
| **Accessibility** | WCAG 2.1 AA compliance. Full keyboard navigation. Screen reader support on core flows. |
| **Offline** | Graceful degradation: show cached data offline, queue writes and sync on reconnect (Phase 3) |
| **Backups** | Daily automated Supabase backups. Enterprise: point-in-time recovery. |
| **GDPR** | Full data export, right to deletion, data residency options (Phase 3) |

---

## 12. Integrations Roadmap

| Integration | Purpose | Priority |
|---|---|---|
| **Regent Axis** | Budget, billable hours, invoicing, HR leave in workload | P0 — Phase 4 |
| **Regent CAD** | Link projects to CRM deals, client acquisition pipeline | P0 — Phase 4 |
| **GitHub / GitLab** | Link commits, PRs, and branches to tasks | P1 — Phase 4 |
| **Slack** | Task notifications, create tasks from Slack messages | P1 — Phase 4 |
| **Google Drive** | Attach Drive files to tasks, link Docs | P1 — Phase 3 |
| **Figma** | Embed Figma frames in task descriptions and docs | P1 — Phase 3 |
| **Zoom / Google Meet** | Schedule meetings directly from task or project | P2 — Phase 4 |
| **WhatsApp Business** | Task update notifications via WhatsApp | P2 — Phase 4 |
| **Zapier / Make** | Custom workflow automations with 1000+ tools | P2 — Phase 4 |
| **Loom** | Embed Loom videos in task descriptions and comments | P2 — Phase 3 |
| **Notion** | Import Notion pages as project docs | P3 — Future |
| **Open API** | REST API + webhooks for any custom integration | P1 — Phase 4 |

---

## 13. Monetisation & Plans

| Plan | Target | Key Limits | Price Signal |
|---|---|---|---|
| **Free** | Individuals, small teams getting started | 3 projects, 5 members, basic views (Kanban + List), no automations, 100MB storage | $0 |
| **Starter** | Small teams (5–15) | Unlimited projects, 15 members, all views, 5 automations/project, 5GB storage | ~$8–12/user/mo |
| **Growth** | Growing teams (15–50) | Unlimited members, all views, unlimited automations, custom fields, guest access, 50GB storage, time tracking | ~$15–20/user/mo |
| **Business** | Orgs (50–200) | Everything + workload view, advanced reporting, Axis integration, SSO, API access, 200GB storage | ~$25–30/user/mo |
| **Enterprise** | 200+ members | Custom pricing, SLA, data residency, SAML, dedicated support, unlimited storage | Custom |

**Notes:**
- Guests (external) do not consume paid seats on Starter and above
- Annual billing at 20% discount
- Non-profit and education discounts
- Regent Ecosystem discount for Axis + PM bundle

---

## 14. Open Questions & Decisions

- [ ] **Views as tabs vs sidebar nav** — Should project views be tabs at the top of the project page, or in a collapsible sidebar nav? Decide before Phase 1 UI build.
- [ ] **Task panel vs full page** — Does clicking a task open a side panel (Asana-style) or navigate to a full task page (Linear-style)? Both have trade-offs. Lean toward side panel with option to expand.
- [ ] **Subtask depth limit** — Unlimited nesting adds complexity. Cap at 3 levels for Phase 1?
- [ ] **Dependency types** — Start with Finish-to-Start only in Phase 2, add other dependency types (SS, FF, SF) in Phase 3?
- [ ] **Real-time collaboration on docs** — Fully collaborative (Google Docs-style) or last-write-wins? Operational Transform vs CRDTs add significant engineering cost.
- [ ] **Mobile strategy** — PWA first (fast to ship) or React Native (better native experience)? Decide by end of Phase 3.
- [ ] **Mind Map library** — Build custom on canvas, or use an existing library (React Flow, Excalidraw fork)?
- [ ] **AI integration timing** — Claude API for AI features: Phase 4 only, or wire a few quick wins (task description gen) earlier?
- [ ] **Offline support scope** — Full offline or just graceful degradation? Offline-first requires significant architectural investment.
- [ ] **Template marketplace** — Community templates: revenue opportunity or distraction? Decide before Phase 3.
- [ ] **Axis integration depth** — Read project budget from Axis, or full two-way sync? Define the data contract early.
- [ ] **Sprint support** — Should sprints (fixed-time work cycles with backlog) be a first-class concept, or handled via sections + milestones?

---

*Regent Systems — Internal Product Document*  
*Regent Project Manager is part of the Regent Ecosystem alongside Axis (business ops) and CAD (CRM/acquisition).*
