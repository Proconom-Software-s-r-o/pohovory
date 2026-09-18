import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useConfirmDialog from '../../common/components/dialogs/confirmDialog/useConfirmDialog';
import { ConfirmDialogAction } from '../../common/components/dialogs/types';
import { Maybe } from '../../common/types/typeUtils';
import Utils from '../../common/utils';
import ApiClientFactory from '../../services/api/apiClientFactory';

/**
 * Hook to delete a diary entry, including the confirmation dialog.
 * @returns An object containing the delete action and its loading state.
 */
const useSmazZaznam = () => {
    const { t } = useTranslation('actionMessages');
    const { t: tToast } = useTranslation('toastMessages');
    const queryClient = useQueryClient();
    const { createYesNoDialog } = useConfirmDialog();

    const [loading, setLoading] = useState(false);

    const smazZaznam = useCallback(
        async (zaznamId: Maybe<number>): Promise<boolean> => {
            if (!zaznamId) return false;

            const action = await createYesNoDialog({
                title: t('Potvrdit smazání'),
                text: t('Opravdu chcete smazat vybraný záznam?'),
            });

            if (action !== ConfirmDialogAction.Yes) return false;

            try {
                setLoading(true);

                const client = await new ApiClientFactory().createAuth();
                await client.zaznamy_DeleteZaznam(zaznamId);

                // Seznam uz neplati - react-query si ho natahne znovu
                await queryClient.invalidateQueries({ queryKey: ['stavebniDenik', 'zaznamy', 'list'] });

                Utils.successToast(tToast('Záznam byl smazán'));

                return true;
            } catch (e) {
                Utils.handleError(e);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [createYesNoDialog, queryClient, t, tToast]
    );

    const state = useMemo(() => ({ smazZaznam, loading }), [smazZaznam, loading]);

    return state;
};

export default useSmazZaznam;
