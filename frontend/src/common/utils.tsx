import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import i18n from '../i18n';

const AUTOCLOSE_MS = 5000;

export type ToastId = string | number;

/**
 * Obal nad react-toastify a zpracováním chyb z API.
 * Toasty se nikde nevolají přímo, vždycky přes tuhle třídu.
 */
export default class Utils {
    static errorToast = (err: string) => toast.error(err, { type: 'error', autoClose: AUTOCLOSE_MS });

    static warningToast = (msg: ReactNode) => toast.warn(msg, { type: 'warning', autoClose: AUTOCLOSE_MS });

    static successToast = (msg: string) => toast.success(msg, { type: 'success', autoClose: AUTOCLOSE_MS });

    static infoToast = (msg: ReactNode, autoClose: number = AUTOCLOSE_MS) => toast.info(msg, { type: 'info', autoClose });

    /** Vytáhne z chyby hlášku, kterou má smysl ukázat uživateli. */
    static getErrorMessage = (err: any): string => {
        if (err?.response?.data?.message) {
            return err.response.data.message;
        }

        if (err?.response?.data?.Message) {
            return err.response.data.Message;
        }

        if (typeof err?.response?.data === 'string' && err.response.data.length > 0) {
            return err.response.data;
        }

        return i18n.t('labels:Neznámá chyba');
    };

    /**
     * Zaloguje chybu a zobrazí ji uživateli. Volá se v catch bloku nad každým voláním API.
     * @param err chyba z axiosu
     * @param callback pokud je vyplněný, hláška se místo toastu předá sem
     */
    static handleError = (err: any, callback?: (message: string) => void): ToastId | null => {
        console.error(err);
        console.error(err?.response?.data);

        const msg = Utils.getErrorMessage(err);

        if (callback) {
            callback(msg);
            return null;
        }

        return Utils.errorToast(msg);
    };
}
