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

    return {
        deliverables: deliverablesQuery.data || [],
        isLoading: deliverablesQuery.isLoading,
        updateStatus: updateStatusMutation.mutate,
        deleteDeliverable: deleteDeliverableMutation.mutate,
    };
}
