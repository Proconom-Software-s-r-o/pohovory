import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Utils from '../common/utils';
import ApiClientFactory from '../services/api/apiClientFactory';
import { StavbaDTO } from '../services/api/webapi';
import useRouteParams from './useRouteParams';

export const stavbyQueryKey = () => ['stavby', 'list'];

// Sdilena reference, aby prazdny vysledek nevytvarel nove pole pri kazdem renderu
const emptyStavby: StavbaDTO[] = [];

/**
 * Hook to fetch all active constructions.
 * @returns An object containing the query and the constructions data.
 */
export const useStavbyQuery = () => {
    const query = useQuery({
        queryKey: stavbyQueryKey(),
        queryFn: async (): Promise<StavbaDTO[] | null> => {
            try {
                const client = await new ApiClientFactory().createAuth();
                const res = await client.stavby_GetStavby();

                return res.stavby ?? [];
            } catch (e) {
                Utils.handleError(e);
                return null;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const state = useMemo(() => ({ query, stavby: query.data ?? emptyStavby }), [query]);

    return state;
};

/**
 * Hook to fetch the construction from the current route. Reuses the constructions list cache,
 * so opening the diary right from the URL does not fire another request.
 * @returns An object containing the query and the selected construction.
 */
const useStavbaDetail = () => {
    const { stavbaId } = useRouteParams();
    const { query, stavby } = useStavbyQuery();

    const state = useMemo(
        () => ({
            query,
            stavba: stavby.find((stavba) => stavba.id === stavbaId) ?? null,
        }),
        [query, stavby, stavbaId]
    );

    return state;
};

export default useStavbaDetail;
