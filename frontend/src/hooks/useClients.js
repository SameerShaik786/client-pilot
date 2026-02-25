import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

export function useClients() {
    const queryClient = useQueryClient();

    const clientsQuery = useQuery({
        queryKey: ['clients'],
        queryFn: api.getClients,
        select: (response) => response.data,
    });

    const createClientMutation = useMutation({
        mutationFn: api.createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toast.success('Client added.');
        },
        onError: () => toast.error('Failed to add client.'),
    });

    const deleteClientMutation = useMutation({
        mutationFn: api.deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toast.success('Client removed.');
        },
        onError: () => toast.error('Failed to remove client.'),
    });

    return {
        clients: clientsQuery.data || [],
        isLoading: clientsQuery.isLoading,
        error: clientsQuery.error,
        createClient: createClientMutation.mutate,
        deleteClient: deleteClientMutation.mutate,
    };
}

export function useClient(id) {
    return useQuery({
        queryKey: ['clients', id],
        queryFn: () => api.getClient(id),
        enabled: !!id,
        select: (response) => response.data,
    });
}
