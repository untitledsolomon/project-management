import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export interface Task {
  id: string;
  org_id: string;
  project_id: string;
  section_id: string;
  title: string;
  description: string;
  status: string;
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  assignee_ids: string[];
  due_date: string;
  start_date: string;
  position: number;
  parent_task_id: string | null;
  estimated_minutes: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

async function logActivity(org_id: string, project_id: string, task_id: string, action: string, field_name?: string, old_value?: string, new_value?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('activity_log').insert({
    org_id,
    project_id,
    task_id,
    user_id: user.id,
    action,
    field_name,
    old_value,
    new_value
  });
}

export function useUserTasks() {
  const { data: { user } } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    }
  });

  return useQuery({
    queryKey: ['my-tasks', user?.user?.id],
    queryFn: async () => {
      if (!user?.user?.id) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .contains('assignee_ids', [user.user.id])
        .is('archived_at', null)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user?.user?.id,
  });
}

export function useProjectTasks(projectId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .is('archived_at', null)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`project-tasks-${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) => [...(old || []), payload.new as Task]);
        } else if (payload.eventType === 'UPDATE') {
          queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) =>
            old?.map(t => t.id === payload.new.id ? { ...t, ...payload.new } : t)
          );
        } else if (payload.eventType === 'DELETE') {
          queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) =>
            old?.filter(t => t.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  return query;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      await logActivity(data.org_id, data.project_id, data.id, 'create');

      return data as Task;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['tasks', data.project_id], (old: Task[] | undefined) => [...(old || []), data]);
    },
  });
}

export interface TaskComment {
  id: string;
  task_id: string;
  org_id: string;
  user_id: string;
  body: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}

export function useSubtasks(parentTaskId: string) {
  return useQuery({
    queryKey: ['subtasks', parentTaskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('parent_task_id', parentTaskId)
        .is('archived_at', null)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!parentTaskId,
  });
}

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*, user:users(full_name, avatar_url)')
        .eq('task_id', taskId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TaskComment[];
    },
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, body, orgId }: { taskId: string; body: string; orgId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          body,
          org_id: orgId,
          user_id: user.id
        })
        .select('*, user:users(full_name, avatar_url)')
        .single();

      if (error) throw error;

      await logActivity(orgId, '', taskId, 'comment', 'body', '', body);

      return data as TaskComment;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['comments', data.task_id], (old: TaskComment[] | undefined) => [...(old || []), data]);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      // Soft delete: set archived_at
      const { data, error } = await supabase
        .from('tasks')
        .update({ archived_at: new Date().toISOString() })
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;

      await logActivity(task.org_id, task.project_id, task.id, 'archive');

      return data as Task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      // Get old task for activity logging
      const { data: oldTask } = await supabase.from('tasks').select('*').eq('id', id).single();

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log changes
      for (const [key, value] of Object.entries(updates)) {
        if (oldTask && oldTask[key] !== value) {
          await logActivity(data.org_id, data.project_id, data.id, 'update', key, String(oldTask[key]), String(value));
        }
      }

      return data as Task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, section_id, position }: { id: string; section_id: string; position: number }) => {
      const { data: oldTask } = await supabase.from('tasks').select('*').eq('id', id).single();

      const { data, error } = await supabase
        .from('tasks')
        .update({ section_id, position })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (oldTask.section_id !== section_id) {
        await logActivity(data.org_id, data.project_id, data.id, 'move', 'section_id', oldTask.section_id, section_id);
      }
      if (oldTask.position !== position) {
        await logActivity(data.org_id, data.project_id, data.id, 'reorder', 'position', String(oldTask.position), String(position));
      }

      return data as Task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
    },
  });
}
