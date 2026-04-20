-- Triggers for Notifications

-- Function to notify on task assignment
CREATE OR REPLACE FUNCTION notify_task_assignment()
RETURNS TRIGGER AS $$
DECLARE
    new_assignee UUID;
    old_assignees UUID[];
BEGIN
    old_assignees := COALESCE(OLD.assignee_ids, ARRAY[]::UUID[]);

    -- For each assignee in the new list that wasn't in the old list
    FOREACH new_assignee IN ARRAY NEW.assignee_ids
    LOOP
        IF NOT (old_assignees @> ARRAY[new_assignee]) THEN
            INSERT INTO notifications (org_id, user_id, type, title, body, data)
            VALUES (
                NEW.org_id,
                new_assignee,
                'task_assignment',
                'You have been assigned to a task',
                NEW.title,
                jsonb_build_object('task_id', NEW.id, 'project_id', NEW.project_id)
            );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_task_assignment
AFTER INSERT OR UPDATE OF assignee_ids ON tasks
FOR EACH ROW
WHEN (TG_OP = 'INSERT' OR NEW.assignee_ids IS DISTINCT FROM OLD.assignee_ids)
EXECUTE FUNCTION notify_task_assignment();
