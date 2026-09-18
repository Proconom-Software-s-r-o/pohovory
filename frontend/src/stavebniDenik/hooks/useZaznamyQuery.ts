import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Maybe } from '../../common/types/typeUtils';
import Utils from '../../common/utils';
import ApiClientFactory from '../../services/api/apiClientFactory';
import { StavZaznamu, ZaznamDTO } from '../../services/api/webapi';

// Sdilena reference, aby prazdny vysledek nevytvarel nove pole pri kazdem renderu
const emptyZaznamy: ZaznamDTO[] = [];

export const zaznamyQueryKey = (stavbaId: Maybe<number>, hledat: string, stav: StavZaznamu | null) => [
    'stavebniDenik',
    'zaznamy',
    'list',
    stavbaId,
    hledat,
    stav,
];

interface Params {
    stavbaId: Maybe<number>;
    hledat: string;
    stav: StavZaznamu | null;
}

/**
 * Hook to fetch diary entries of a single construction.
 *
 * Filtry jsou soucasti queryKey, takze react-query cachuje kazdou kombinaci zvlast
 * a pri zmene filtru se dotaz spusti sam - zadny useEffect na to neni potreba.
 *
 * @param {Params} params Construction id and the active filters.
 * @returns An object containing the query and the entries data.
 */
const useZaznamyQuery = ({ stavbaId, hledat, stav }: Params) => {
    const query = useQuery({
        queryKey: zaznamyQueryKey(stavbaId, hledat, stav),
        queryFn: async (): Promise<ZaznamDTO[] | null> => {
            if (!stavbaId) return null;

            try {
                const client = await new ApiClientFactory().createAuth();
                const res = await client.zaznamy_GetZaznamy({ kStavba: stavbaId, hledat, stav });

                return res.zaznamy ?? [];
            } catch (e) {
                Utils.handleError(e);
                return null;
            }
        },
        enabled: !!stavbaId,
        staleTime: 1000 * 60 * 1, // 1 minute
    });

    const state = useMemo(() => ({ query, zaznamy: query.data ?? emptyZaznamy }), [query]);

    return state;
};

export default useZaznamyQuery;
