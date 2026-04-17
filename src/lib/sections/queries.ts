import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Section {
  id: string;
  project_id: string;
  org_id: string;
  name: string;
  color: string;
  position: number;
  wip_limit: number | null;
}

export function useProjectSections(projectId: string) {
  return useQuery({
    queryKey: ['sections', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as Section[];
    },
    enabled: !!projectId,
  });
}
