import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maybe } from '../../common/types/typeUtils';
import Utils from '../../common/utils';
import ApiClientFactory from '../../services/api/apiClientFactory';
import { ZaznamCreateDTO, ZaznamDTO, ZaznamUpdateDTO } from '../../services/api/webapi';

export interface UlozZaznamParams {
    /** `null` znamena zakladani noveho zaznamu. */
    zaznamId: Maybe<number>;
    novy: ZaznamCreateDTO;
    upraveny: ZaznamUpdateDTO;
}

export interface UseUlozZaznamState {
    ulozZaznam: (params: UlozZaznamParams) => Promise<ZaznamDTO | null>;
    loading: boolean;
}

/**
 * Hook to create or update a diary entry.
 * @returns An object containing the save action and its loading state.
 */
const useUlozZaznam = (): UseUlozZaznamState => {
    const { t: tToast } = useTranslation('toastMessages');
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);

    const ulozZaznam = useCallback(
        async ({ zaznamId, novy, upraveny }: UlozZaznamParams): Promise<ZaznamDTO | null> => {
            try {
                setLoading(true);

                const client = await new ApiClientFactory().createAuth();

                const res = zaznamId
                    ? await client.zaznamy_UpdateZaznam(zaznamId, upraveny)
                    : await client.zaznamy_CreateZaznam(novy);

                // Seznam uz neplati - react-query si ho natahne znovu
                await queryClient.invalidateQueries({ queryKey: ['stavebniDenik', 'zaznamy', 'list'] });

                Utils.successToast(tToast('Záznam byl uložen'));

                return res.zaznam;
            } catch (e) {
                Utils.handleError(e);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [queryClient, tToast]
    );

    const state = useMemo(() => ({ ulozZaznam, loading }), [ulozZaznam, loading]);

    return state;
};

export default useUlozZaznam;
