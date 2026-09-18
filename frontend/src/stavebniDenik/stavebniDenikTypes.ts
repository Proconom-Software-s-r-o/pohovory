import { StavZaznamu } from '../services/api/webapi';

export interface ZaznamyFiltrState {
    hledat: string;
    stav: StavZaznamu | null;
}

export const defaultZaznamyFiltr: ZaznamyFiltrState = {
    hledat: '',
    stav: null,
};
