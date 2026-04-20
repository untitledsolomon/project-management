import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export interface Activity {
  id: string;
  org_id: string;
  project_id: string;
  task_id: string;
  user_id: string;
  action: string;
  field_name: string;
  old_value: string;
  new_value: string;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface Comment {
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

export interface TaskLabel {
  id: string;
  org_id: string;
  project_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface TaskLabelAssignment {
  task_id: string;
  label_id: string;
  org_id: string;
  label?: TaskLabel;
}

export interface PublicUser {
  id: string;
  org_id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  role: string;
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

export function useTaskActivity(taskId: string) {
  return useQuery({
    queryKey: ['activity', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          *,
          user:users(full_name, avatar_url)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!taskId,
  });
}

export function useTaskLabels(projectId: string) {
  return useQuery({
    queryKey: ['project-labels', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_labels')
        .select('*')
        .eq('project_id', projectId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TaskLabel[];
    },
    enabled: !!projectId,
  });
}

export function useLabelsForTask(taskId: string) {
  return useQuery({
    queryKey: ['task-labels', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_label_assignments')
        .select(`
          *,
          label:task_labels(*)
        `)
        .eq('task_id', taskId);

      if (error) throw error;
      return data as TaskLabelAssignment[];
    },
    enabled: !!taskId,
  });
}

export function useUpdateTaskLabels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, orgId, labelIds, projectId }: { taskId: string, orgId: string, labelIds: string[], projectId: string }) => {
      // Delete existing assignments
      const { error: deleteError } = await supabase
        .from('task_label_assignments')
        .delete()
        .eq('task_id', taskId);

      if (deleteError) throw deleteError;

      if (labelIds.length > 0) {
        const { error: insertError } = await supabase
          .from('task_label_assignments')
          .insert(labelIds.map(labelId => ({
            task_id: taskId,
            label_id: labelId,
            org_id: orgId
          })));

        if (insertError) throw insertError;
      }

      await logActivity(orgId, projectId, taskId, 'update', 'labels');
    },
    onMutate: async ({ taskId, labelIds, projectId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      await queryClient.cancelQueries({ queryKey: ['task-labels', taskId] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]);
      const projectLabels = queryClient.getQueryData<TaskLabel[]>(['project-labels', projectId]);

      queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) =>
        old?.map(t => {
          if (t.id === taskId) {
            const newAssignments = labelIds.map(lId => ({
              task_id: taskId,
              label_id: lId,
              org_id: t.org_id,
              label: projectLabels?.find(pl => pl.id === lId)
            }));
            return { ...t, task_label_assignments: newAssignments };
          }
          return t;
        })
      );

      return { previousTasks, projectId };
    },
    onError: (err, variables, context) => {
      if (context?.projectId) {
        queryClient.setQueryData(['tasks', context.projectId], context.previousTasks);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['task-labels', variables.taskId] });
    },
  });
}

export function useOrgMembers(orgId: string) {
  return useQuery({
    queryKey: ['org-members', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('org_id', orgId)
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data as PublicUser[];
    },
    enabled: !!orgId,
  });
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          *,
          user:users(*)
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      return data.map((m: { user: PublicUser }) => m.user) as PublicUser[];
    },
    enabled: !!projectId,
  });
}

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          user:users(full_name, avatar_url)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: Partial<Comment>) => {
      const { data, error } = await supabase
        .from('task_comments')
        .insert(newComment)
        .select()
        .single();

      if (error) throw error;

      // We need project_id for activity logging, but it's not in the comment table
      // Let's fetch the task first or just log without it if necessary.
      // For now, assume it's passed or available.

      return data as Comment;
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['comments', newComment.task_id] });
      const previousComments = queryClient.getQueryData(['comments', newComment.task_id]);

      queryClient.setQueryData(['comments', newComment.task_id], (old: Comment[] | undefined) => [
        ...(old || []),
        { ...newComment, id: 'temp-id', created_at: new Date().toISOString() } as Comment,
      ]);

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(['comments', newComment.task_id], context?.previousComments);
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['comments', data.task_id] });
      }
    },
  });
}

export function useSubtasks(parentTaskId: string) {
  return useQuery({
    queryKey: ['subtasks', parentTaskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('parent_task_id', parentTaskId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!parentTaskId,
  });
}

export function useProjectTasks(projectId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_label_assignments(
            *,
            label:task_labels(*)
          )
        `)
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (!projectId) return;

    const tasksChannel = supabase
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
          // Invalidate specific task and its subtasks
          queryClient.invalidateQueries({ queryKey: ['task', payload.new.id] });
          if (payload.new.parent_task_id) {
            queryClient.invalidateQueries({ queryKey: ['subtasks', payload.new.parent_task_id] });
          }
        } else if (payload.eventType === 'DELETE') {
          queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) =>
            old?.filter(t => t.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    const commentsChannel = supabase
      .channel(`project-comments-${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'task_comments'
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
          const taskId = (payload.new as Comment)?.task_id || (payload.old as Comment)?.task_id;
          if (taskId) {
            queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
          }
        }
      })
      .subscribe();

    const activityChannel = supabase
      .channel(`project-activity-${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_log',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        const taskId = (payload.new as Activity)?.task_id;
        if (taskId) {
          queryClient.invalidateQueries({ queryKey: ['activity', taskId] });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(activityChannel);
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
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', newTask.project_id] });
      const previousTasks = queryClient.getQueryData(['tasks', newTask.project_id]);

      queryClient.setQueryData(['tasks', newTask.project_id], (old: Task[] | undefined) => [
        ...(old || []),
        { ...newTask, id: 'temp-id', created_at: new Date().toISOString() } as Task,
      ]);

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks', newTask.project_id], context?.previousTasks);
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
        if (data.parent_task_id) {
          queryClient.invalidateQueries({ queryKey: ['subtasks', data.parent_task_id] });
        }
      }
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
    onMutate: async ({ id, updates }) => {
      const allTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });
      let projectId: string | undefined;

      for (const [queryKey, data] of allTasks) {
        if (data?.find(t => t.id === id)) {
          projectId = queryKey[1] as string;
          break;
        }
      }

      if (projectId) {
        await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
        await queryClient.cancelQueries({ queryKey: ['task', id] });

        const previousTasks = queryClient.getQueryData(['tasks', projectId]);
        const previousTask = queryClient.getQueryData(['task', id]);

        queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) =>
          old?.map(t => t.id === id ? { ...t, ...updates } : t)
        );
        queryClient.setQueryData(['task', id], (old: Task | undefined) =>
          old ? { ...old, ...updates } : undefined
        );

        return { previousTasks, previousTask, projectId };
      }
    },
    onError: (err, { id }, context) => {
      if (context?.projectId) {
        queryClient.setQueryData(['tasks', context.projectId], context.previousTasks);
        queryClient.setQueryData(['task', id], context.previousTask);
      }
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
        queryClient.invalidateQueries({ queryKey: ['task', data.id] });
        if (data.parent_task_id) {
          queryClient.invalidateQueries({ queryKey: ['subtasks', data.parent_task_id] });
        }
      }
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
    onMutate: async ({ id, section_id, position }) => {
      const allTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });
      let projectId: string | undefined;

      for (const [queryKey, data] of allTasks) {
        if (data?.find(t => t.id === id)) {
          projectId = queryKey[1] as string;
          break;
        }
      }

      if (projectId) {
        await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
        const previousTasks = queryClient.getQueryData(['tasks', projectId]);

        queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) =>
          old?.map(t => t.id === id ? { ...t, section_id, position } : t)
        );

        return { previousTasks, projectId };
      }
    },
    onError: (err, variables, context) => {
      if (context?.projectId) {
        queryClient.setQueryData(['tasks', context.projectId], context.previousTasks);
      }
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      }
    },
  });
}

export function useMyWorkTasks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-work-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_label_assignments(
            *,
            label:task_labels(*)
          )
        `)
        .contains('assignee_ids', [user.id])
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('my-work-tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, async (payload) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isRelevant = (payload.new as Task)?.assignee_ids?.includes(user.id) ||
                          (payload.old as Task)?.assignee_ids?.includes(user.id);

        if (isRelevant) {
          queryClient.invalidateQueries({ queryKey: ['my-work-tasks'] });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: task } = await supabase.from('tasks').select('*').eq('id', id).single();
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;

      if (task) {
        await logActivity(task.org_id, task.project_id, task.id, 'delete');
      }
      return task as Task;
    },
    onMutate: async (id) => {
      const allTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });
      let projectId: string | undefined;

      for (const [queryKey, data] of allTasks) {
        if (data?.find(t => t.id === id)) {
          projectId = queryKey[1] as string;
          break;
        }
      }

      if (projectId) {
        await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
        const previousTasks = queryClient.getQueryData(['tasks', projectId]);

        queryClient.setQueryData(['tasks', projectId], (old: Task[] | undefined) =>
          old?.filter(t => t.id !== id)
        );

        return { previousTasks, projectId };
      }
    },
    onError: (err, id, context) => {
      if (context?.projectId) {
        queryClient.setQueryData(['tasks', context.projectId], context.previousTasks);
      }
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
        if (data.parent_task_id) {
          queryClient.invalidateQueries({ queryKey: ['subtasks', data.parent_task_id] });
        }
      }
    },
  });
}
