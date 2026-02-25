import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

export function useProjects(clientId) {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery({
        queryKey: ['projects', 'client', clientId],
        queryFn: () => api.getClientProjects(clientId),
        enabled: !!clientId,
        select: (response) => response.data,
    });

    const createProjectMutation = useMutation({
        mutationFn: api.createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', 'client', clientId] });
            queryClient.invalidateQueries({ queryKey: ['projects', 'all'] });
            toast.success('Project created.');
        },
        onError: () => toast.error('Failed to create project.'),
    });

    const deleteProjectMutation = useMutation({
        mutationFn: api.deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', 'client', clientId] });
            queryClient.invalidateQueries({ queryKey: ['projects', 'all'] });
            toast.success('Project deleted.');
        },
    });

    return {
        projects: projectsQuery.data || [],
        isLoading: projectsQuery.isLoading,
        error: projectsQuery.error,
        createProject: createProjectMutation.mutate,
        deleteProject: deleteProjectMutation.mutate,
    };
}

export function useAllProjects() {
    return useQuery({
        queryKey: ['projects', 'all'],
        queryFn: api.getProjects,
        select: (response) => response.data,
    });
}

export function useProject(id) {
    return useQuery({
        queryKey: ['project', id],
        queryFn: () => api.getProject(id),
        enabled: !!id,
        select: (response) => response.data,
    });
}
