import { Maybe } from '../../common/types/typeUtils';
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
 * ÚKOL 4 - Hook to create or update a diary entry.
 *
 * Hotovy vzor zapisove akce najdes v `useSmazZaznam.ts` - drz se stejneho tvaru:
 * `useCallback` + `useState` na loading + vysledek zabaleny v `useMemo`.
 *
 * Zadani:
 *  - podle `zaznamId` zavolat bud `zaznamy_CreateZaznam(novy)`, nebo
 *    `zaznamy_UpdateZaznam(zaznamId, upraveny)` a vratit ulozeny `ZaznamDTO`
 *  - po uspechu zneplatnit query `['stavebniDenik', 'zaznamy', 'list']`, at se seznam prekresli,
 *    a zobrazit success toast s hlaskou z namespace `toastMessages`
 *  - chybu predat do `Utils.handleError` a vratit `null`
 */
const useUlozZaznam = (): UseUlozZaznamState => {
    // TODO (úkol 4): implementovat
    //  const queryClient = useQueryClient();
    //  const { t: tToast } = useTranslation('toastMessages');
    //  const [loading, setLoading] = useState(false);
    //  const ulozZaznam = useCallback(async ({ zaznamId, novy, upraveny }: UlozZaznamParams) => { ... }, [...]);
    //  return useMemo(() => ({ ulozZaznam, loading }), [ulozZaznam, loading]);
    return {
        ulozZaznam: async () => {
            throw new Error('Ukládání záznamu zatím není hotové (úkol 4).');
        },
        loading: false,
    };
};

export default useUlozZaznam;
