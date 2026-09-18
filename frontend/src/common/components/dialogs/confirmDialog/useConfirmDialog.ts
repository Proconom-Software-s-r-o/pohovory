import { useContext } from 'react';
import ConfirmDialogContext from './confirmDialogContext';

/**
 * Potvrzovací dialogy se nedělají přes window.confirm ani vlastní state,
 * vždycky přes tenhle hook.
 *
 * ```ts
 * const { createYesNoDialog } = useConfirmDialog();
 * const action = await createYesNoDialog({ title: '…', text: '…' });
 * if (action !== ConfirmDialogAction.Yes) return;
 * ```
 */
const useConfirmDialog = () => useContext(ConfirmDialogContext);

export default useConfirmDialog;
