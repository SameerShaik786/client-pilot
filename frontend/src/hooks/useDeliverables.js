import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

export function useDeliverables(projectId) {
    const queryClient = useQueryClient();

    const deliverablesQuery = useQuery({
        queryKey: ['deliverables', projectId],
        queryFn: () => api.getProjectDeliverables(projectId),
        enabled: !!projectId,
        select: (response) => response.data,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => api.updateDeliverableStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deliverables', projectId] });
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            toast.success('Status updated.');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to update status.');
        },
    });

    const deleteDeliverableMutation = useMutation({
        mutationFn: api.deleteDeliverable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deliverables', projectId] });
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            toast.success('Deliverable deleted.');
        },
    });

    const createDeliverableMutation = useMutation({
        mutationFn: (data) => api.createDeliverable(projectId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deliverables', projectId] });
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            toast.success('Deliverable created.');
        },
        onError: () => toast.error('Failed to create deliverable.'),
    });

    return {
        deliverables: deliverablesQuery.data || [],
        isLoading: deliverablesQuery.isLoading,
        createDeliverable: createDeliverableMutation.mutate,
        updateStatus: updateStatusMutation.mutate,
        deleteDeliverable: deleteDeliverableMutation.mutate,
    };
}
