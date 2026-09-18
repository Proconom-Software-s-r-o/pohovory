import getClientInstance from './apiFactoryHelper';
import { Client } from './webapi';

/**
 * Jediná cesta, jak si sáhnout na API. Použití:
 *
 * ```ts
 * const client = await new ApiClientFactory().createAuth();
 * const res = await client.zaznamy_GetZaznamy({ kStavba });
 * ```
 */
class ApiClientFactory {
    url: string;

    user: string;

    constructor() {
        if (!import.meta.env.VITE_API) {
            console.log('Není nastavena URL k API.');
        }

        this.url = import.meta.env.VITE_API as string;
        this.user = (import.meta.env.VITE_USER as string) || 'Neznámý uživatel';
    }

    create(): Client {
        return new Client(getClientInstance(this.url, this.user));
    }

    async createAuth(): Promise<Client> {
        return this.create();
    }
}

export default ApiClientFactory;
