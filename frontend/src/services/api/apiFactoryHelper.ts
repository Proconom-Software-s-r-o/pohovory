import axios, { AxiosInstance } from 'axios';
import Utils from '../../common/utils';

/**
 * Postaví axios instanci s interceptory - stejná myšlenka jako v ostré aplikaci:
 * odpověď se rozbalí na `response.data`, takže metody klienta rovnou vracejí data,
 * a chyby se centrálně otoastují a přehodí dál (volající je chytá do try/catch).
 */
const getClientInstance = (url: string, user: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            // Ostrá aplikace tu posílá JWT; tady jen jméno uživatele, ať má backend co zapsat do Autor
            'X-User': user,
        },
    });

    instance.interceptors.response.use(
        (response) => response.data,
        (error) => {
            const status = error?.response?.status;

            // 404 znamená neexistující endpoint, ne chybu dat - vracíme null, ať to nespadne
            if (status === 404) {
                return null;
            }

            if (status === 400 || status === 403 || status === 409 || status >= 500) {
                Utils.errorToast(Utils.getErrorMessage(error));
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export default getClientInstance;
