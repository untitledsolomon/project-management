-- Projects Schema for Regent Project Manager

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    status TEXT CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled', 'archived')) DEFAULT 'active',
    privacy TEXT CHECK (privacy IN ('public', 'team', 'private')) DEFAULT 'public',
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    project_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Members
CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('lead', 'contributor', 'viewer', 'commenter')) DEFAULT 'contributor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- Sections
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    position FLOAT NOT NULL,
    wip_limit INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR, -- matches the project's custom status names
    priority TEXT CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'none')) DEFAULT 'none',
    assignee_ids UUID[], -- array of user IDs
    due_date TIMESTAMPTZ,
    start_date TIMESTAMPTZ,
    position FLOAT NOT NULL, -- LexoRank / fractional for ordering
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    estimated_minutes INT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

-- Task Labels
CREATE TABLE task_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task Label Assignments
CREATE TABLE task_label_assignments (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    label_id UUID REFERENCES task_labels(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);

-- Task Dependencies
CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    target_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type TEXT CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')) DEFAULT 'finish_to_start',
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT no_self_dependency CHECK (source_task_id <> target_task_id)
);

-- Task Comments
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    parent_comment_id UUID REFERENCES task_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Task Attachments
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT,
    mime_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Time Entries
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_minutes INT,
    is_billable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    status TEXT CHECK (status IN ('on_track', 'at_risk', 'delayed', 'completed')) DEFAULT 'on_track',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Circular Dependency Prevention Trigger
CREATE OR REPLACE FUNCTION check_circular_dependency()
RETURNS TRIGGER AS $$
DECLARE
    found_cycle BOOLEAN;
BEGIN
    WITH RECURSIVE dependency_chain AS (
        SELECT target_task_id
        FROM task_dependencies
        WHERE source_task_id = NEW.target_task_id
        UNION ALL
        SELECT td.target_task_id
        FROM task_dependencies td
        JOIN dependency_chain dc ON td.source_task_id = dc.target_task_id
    )
    SELECT EXISTS (
        SELECT 1 FROM dependency_chain WHERE target_task_id = NEW.source_task_id
    ) INTO found_cycle;

    IF found_cycle THEN
        RAISE EXCEPTION 'Circular dependency detected';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_circular_dependency
BEFORE INSERT OR UPDATE ON task_dependencies
FOR EACH ROW EXECUTE FUNCTION check_circular_dependency();

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_label_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Policies (org_id based)

-- Projects
CREATE POLICY "Users can view projects in their organisation" ON projects
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert projects in their organisation" ON projects
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update projects in their organisation" ON projects
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete projects in their organisation" ON projects
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Project Members
CREATE POLICY "Users can view project members in their organisation" ON project_members
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert project members in their organisation" ON project_members
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update project members in their organisation" ON project_members
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete project members in their organisation" ON project_members
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Sections
CREATE POLICY "Users can view sections in their organisation" ON sections
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert sections in their organisation" ON sections
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update sections in their organisation" ON sections
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete sections in their organisation" ON sections
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Tasks
CREATE POLICY "Users can view tasks in their organisation" ON tasks
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert tasks in their organisation" ON tasks
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update tasks in their organisation" ON tasks
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete tasks in their organisation" ON tasks
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Task Labels
CREATE POLICY "Users can view task labels in their organisation" ON task_labels
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert task labels in their organisation" ON task_labels
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update task labels in their organisation" ON task_labels
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete task labels in their organisation" ON task_labels
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Task Label Assignments
CREATE POLICY "Users can view task label assignments in their organisation" ON task_label_assignments
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert task label assignments in their organisation" ON task_label_assignments
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update task label assignments in their organisation" ON task_label_assignments
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete task label assignments in their organisation" ON task_label_assignments
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Task Dependencies
CREATE POLICY "Users can view task dependencies in their organisation" ON task_dependencies
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert task dependencies in their organisation" ON task_dependencies
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update task dependencies in their organisation" ON task_dependencies
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete task dependencies in their organisation" ON task_dependencies
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Task Comments
CREATE POLICY "Users can view task comments in their organisation" ON task_comments
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert task comments in their organisation" ON task_comments
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update task comments in their organisation" ON task_comments
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete task comments in their organisation" ON task_comments
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Task Attachments
CREATE POLICY "Users can view task attachments in their organisation" ON task_attachments
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert task attachments in their organisation" ON task_attachments
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update task attachments in their organisation" ON task_attachments
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete task attachments in their organisation" ON task_attachments
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Time Entries
CREATE POLICY "Users can view time entries in their organisation" ON time_entries
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert time entries in their organisation" ON time_entries
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update time entries in their organisation" ON time_entries
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete time entries in their organisation" ON time_entries
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Milestones
CREATE POLICY "Users can view milestones in their organisation" ON milestones
    FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can insert milestones in their organisation" ON milestones
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update milestones in their organisation" ON milestones
    FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()))
    WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can delete milestones in their organisation" ON milestones
    FOR DELETE USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Indexes
CREATE INDEX idx_projects_org_id ON projects(org_id);
CREATE INDEX idx_project_members_org_id ON project_members(org_id);
CREATE INDEX idx_sections_project_id ON sections(project_id);
CREATE INDEX idx_sections_org_id ON sections(org_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_section_id ON tasks(section_id);
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_labels_project_id ON task_labels(project_id);
CREATE INDEX idx_task_dependencies_org_id ON task_dependencies(org_id);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
