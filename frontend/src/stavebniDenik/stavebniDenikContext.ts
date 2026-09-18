import { createContext, Dispatch, SetStateAction } from 'react';
import { Maybe } from '../common/types/typeUtils';
import { ZaznamDTO } from '../services/api/webapi';
import { ZaznamyFiltrState } from './stavebniDenikTypes';

export interface StavebniDenikContextProps {
    stavbaId: number;
    zaznamy: ZaznamDTO[];
    loading: boolean;
    filtr: ZaznamyFiltrState;
    setFiltr: Dispatch<SetStateAction<ZaznamyFiltrState>>;
    selectedZaznamId: Maybe<number>;
    selectedZaznam: ZaznamDTO | null;
    detailOtevren: boolean;
    openZaznam: (zaznamId: number) => void;
    openNovyZaznam: () => void;
    closeDetail: () => void;
    deleteZaznam: (zaznamId: number) => Promise<void>;
}

export const StavebniDenikContext = createContext({} as StavebniDenikContextProps);
