import { QueryClient } from '@tanstack/react-query';

/**
 * Stejné výchozí nastavení jako v ostré aplikaci - žádné automatické retry
 * ani refetch při návratu do okna, ať je chování při pohovoru předvídatelné.
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 0,
            gcTime: 1000 * 60,
        },
    },
});

export default queryClient;
