import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useDashboard() {
    const { data: summary, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: api.getDashboardStats,
        select: (response) => response.data,
    });

    return {
        summary,
        isLoading,
        error
    };
}
