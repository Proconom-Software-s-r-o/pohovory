import { createContext } from 'react';
import { ConfirmDialogAction, ConfirmDialogOptions } from '../types';

export interface ConfirmDialogContextValue {
    createYesNoDialog: (options: ConfirmDialogOptions) => Promise<ConfirmDialogAction>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue>({
    createYesNoDialog: () => Promise.resolve(ConfirmDialogAction.No),
});

export default ConfirmDialogContext;
