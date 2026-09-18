import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialogAction, ConfirmDialogOptions } from '../types';
import ConfirmDialogContext from './confirmDialogContext';

interface Props {
    children: ReactNode;
}

/**
 * Drží jeden potvrzovací dialog pro celou aplikaci. Volající dostane přes
 * `useConfirmDialog()` funkci, která vrací Promise s odpovědí uživatele.
 */
const ConfirmDialogProvider = ({ children }: Props) => {
    const { t } = useTranslation('actionMessages');

    const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
    const resolveRef = useRef<((action: ConfirmDialogAction) => void) | null>(null);

    const createYesNoDialog = useCallback(
        (dialogOptions: ConfirmDialogOptions) =>
            new Promise<ConfirmDialogAction>((resolve) => {
                resolveRef.current = resolve;
                setOptions(dialogOptions);
            }),
        []
    );

    const close = useCallback((action: ConfirmDialogAction) => {
        setOptions(null);
        resolveRef.current?.(action);
        resolveRef.current = null;
    }, []);

    const value = useMemo(() => ({ createYesNoDialog }), [createYesNoDialog]);

    return (
        <ConfirmDialogContext.Provider value={value}>
            {children}

            <Dialog
                open={!!options}
                onClose={() => close(ConfirmDialogAction.No)}
            >
                <DialogTitle>{options?.title}</DialogTitle>
                <DialogContent>{options?.text}</DialogContent>
                <DialogActions>
                    <Button onClick={() => close(ConfirmDialogAction.No)}>{t('Ne')}</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => close(ConfirmDialogAction.Yes)}
                    >
                        {t('Ano')}
                    </Button>
                </DialogActions>
            </Dialog>
        </ConfirmDialogContext.Provider>
    );
};

export default ConfirmDialogProvider;
