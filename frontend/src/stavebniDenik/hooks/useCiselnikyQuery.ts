import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Utils from '../../common/utils';
import ApiClientFactory from '../../services/api/apiClientFactory';
import { CiselnikPolozkaDTO } from '../../services/api/webapi';

// Sdilena reference, aby prazdny vysledek nevytvarel nove pole pri kazdem renderu
const emptyPolozky: CiselnikPolozkaDTO[] = [];

export const ciselnikyQueryKey = () => ['ciselnik', 'stavebniDenik'];

/**
 * Hook to fetch the code lists used by the entry form (weather, states).
 * @returns An object containing the query and both code lists.
 */
const useCiselnikyQuery = () => {
    const query = useQuery({
        queryKey: ciselnikyQueryKey(),
        queryFn: async () => {
            try {
                const client = await new ApiClientFactory().createAuth();
                return await client.ciselnik_GetCiselniky();
            } catch (e) {
                Utils.handleError(e);
                return null;
            }
        },
        staleTime: 1000 * 60 * 30, // 30 minutes
    });

    const state = useMemo(
        () => ({
            query,
            pocasi: query.data?.pocasi ?? emptyPolozky,
            stavy: query.data?.stavy ?? emptyPolozky,
        }),
        [query]
    );

    return state;
};

export default useCiselnikyQuery;
