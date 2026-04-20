# Regent Project Manager
### Product Plan & Development Roadmap
**Owner:** Regent Systems | **Status:** Phase 1 | **Last Updated:** April 2026

## Last Session
- Implemented optimistic updates for all task mutations using TanStack Query.
- Built recursive Subtasks system in the Task Detail Panel.
- Added Task Activity Feed and real-time Comments to Task Detail Panel.
- Migrated List View to TanStack Query architecture.
- Integrated Supabase Realtime Presence to track active users.
- Fixed numerous TypeScript linting and build errors across the core UI components.

---

## Table of Contents
1. [Vision & Mission](#1-vision--mission)
2. [Phase 1: Foundation & Core Task Engine](#phase-1-foundation--core-task-engine)
3. [Phase 2: Advanced Views & Collaboration](#phase-2-advanced-views--collaboration)
4. [Phase 3: Automation & Reporting](#phase-3-automation--reporting)
5. [Phase 4: Ecosystem & API](#phase-4-ecosystem--api)

---

## 1. Vision & Mission
To build the most performant, delightful, and integrated work management platform for high-velocity teams. Inspired by the speed of Linear and the flexibility of Notion, Regent Project Manager is the "Source of Truth" for all Regent Systems projects.

---

## Phase 1: Foundation & Core Task Engine
*Goal: Establish the multi-tenant foundation and a rock-solid task data model with a functional Kanban view.*

- [x] **Supabase Schema & RLS**
  - [x] Multi-tenant `org_id` isolation on all tables.
  - [x] RLS policies for Projects, Tasks, Sections, and Members.
  - [x] Activity Log table and triggers.
- [x] **Authentication & Onboarding**
  - [x] Email/Password login and signup.
  - [x] Organisation creation flow.
  - [x] Protected routes and session management.
- [x] **App Shell**
  - [x] Collapsible Sidebar with navigation.
  - [x] Topbar with breadcrumbs and user menu.
  - [x] Global Command Palette (Cmd+K).
- [x] **Task Engine - Data Layer**
  - [x] LexoRank-style float positioning for reordering.
  - [x] Activity logging on all mutations.
  - [x] TanStack Query integration for server state.
- [x] **Kanban View**
  - [x] Drag-and-drop reordering within and between columns using `dnd-kit`.
  - [x] Task cards with priority, due date, and assignee indicators.
  - [x] Section WIP limits (visual warnings).
- [x] **Task Detail Panel**
  - [x] Tiptap rich text editor for descriptions.
  - [x] Basic task metadata editing (Title, Priority, Due Date).
- [x] **Core Task Features**
  - [x] Optimistic updates for all task mutations.
  - [x] Subtasks CRUD (recursive task model).
  - [x] Task Comments system.
  - [x] Activity Log feed in detail panel.
- [x] Task Labels and assignments.
> Completed April 2026 — Implemented full label management and multiple assignee support with optimistic updates and N+1 query optimizations.
- [x] **List View (Refactor)**
  - [x] Migrate legacy List View to TanStack Query and Supabase.
  - [x] Support density settings (Compact/Comfortable/Spacious).
- [x] **Real-time & Collaboration**
  - [x] Supabase Realtime for task updates.
> Completed April 2026 — Integrated Realtime for tasks, comments, activity log, and My Work view.
  - [x] Presence indicators in project header.

---

## Phase 2: Advanced Views & Collaboration
*Goal: Expand beyond Kanban and add deep collaboration features.*

- [ ] **Timeline View**
  - [ ] Custom SVG-based Gantt chart.
  - [ ] Drag-to-move and resize task bars.
  - [ ] Dependency lines with curved SVG paths.
  - [ ] Critical path calculation.
- [ ] **Calendar View**
  - [ ] Monthly and Weekly layouts.
  - [ ] Drag-and-drop to reschedule.
- [x] **Inbox & Notifications**
  - [x] Notification infrastructure (table + delivery).
> Completed April 2026 — Established database triggers and library hooks for task assignment notifications.
  - [ ] In-app notification center.
  - [ ] Mention system (@user) in comments.
- [x] **My Work Page**
  - [x] Aggregated view of all tasks assigned to current user.
> Completed April 2026 — Built dedicated page with Realtime support.
  - [x] "Upcoming" and "Overdue" sections.
- [ ] **Project Templates**
  - [ ] Ability to save project structures as templates.

---

## Phase 3: Automation & Reporting
*Goal: Add intelligence and high-level visibility.*

- [ ] **Custom Fields**
  - [ ] Support for Number, Select, Date, and Formula fields.
- [ ] **Automations**
  - [ ] Simple "When/Then" trigger system.
- [ ] **Reporting & Dashboards**
  - [ ] Velocity charts.
  - [ ] Burn-down charts for milestones.
  - [ ] Custom dashboard widgets.

---

## Phase 4: Ecosystem & API
*Goal: Open the platform for integrations.*

- [ ] **Public API**
  - [ ] REST API with personal access tokens.
- [ ] **Integrations**
  - [ ] Slack/Microsoft Teams notifications.
  - [ ] GitHub/GitLab PR linking.
- [ ] **Mobile App**
  - [ ] Native iOS/Android apps using React Native.
