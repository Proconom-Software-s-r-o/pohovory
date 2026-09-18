import { AxiosInstance } from 'axios';

/**
 * Kontrakty a klient k Pohovor.Api.
 *
 * V ostré aplikaci je tenhle soubor generovaný NSwagem ze Swaggeru a needituje se ručně.
 * Tady je psaný ručně, ale drží stejný tvar: metody se jmenují
 * `{controller}_{Operace}` a vracejí rovnou `response.data`.
 */

export enum PocasiTyp {
    Jasno = 0,
    Polojasno = 1,
    Oblacno = 2,
    Dest = 3,
    Snih = 4,
    Mlha = 5,
}

export enum StavZaznamu {
    Rozpracovany = 0,
    Odeslany = 1,
    Schvaleny = 2,
}

export interface StavbaDTO {
    id: number;
    nazev: string;
    investor: string;
}

export interface ZaznamDTO {
    id: number;
    kStavba: number;
    datum: string;
    pocasi: PocasiTyp;
    teplotaRano: number | null;
    teplotaOdpoledne: number | null;
    pocetPracovniku: number;
    popis: string;
    autor: string;
    stav: StavZaznamu;
    vytvoreno: string;
    zmeneno: string | null;
}

export interface ZaznamCreateDTO {
    kStavba: number;
    datum: string;
    pocasi: PocasiTyp;
    teplotaRano: number | null;
    teplotaOdpoledne: number | null;
    pocetPracovniku: number;
    popis: string;
}

export interface ZaznamUpdateDTO {
    datum: string;
    pocasi: PocasiTyp;
    teplotaRano: number | null;
    teplotaOdpoledne: number | null;
    pocetPracovniku: number;
    popis: string;
    stav: StavZaznamu;
}

export interface CiselnikPolozkaDTO {
    id: number;
    nazev: string;
}

export interface GetStavbyResponse {
    stavby: StavbaDTO[];
}

export interface GetZaznamyResponse {
    zaznamy: ZaznamDTO[];
}

export interface GetZaznamDetailResponse {
    zaznam: ZaznamDTO;
}

export interface CreateZaznamResponse {
    zaznam: ZaznamDTO;
}

export interface UpdateZaznamResponse {
    zaznam: ZaznamDTO;
}

export interface GetCiselnikyResponse {
    pocasi: CiselnikPolozkaDTO[];
    stavy: CiselnikPolozkaDTO[];
}

export interface ZaznamyFiltr {
    kStavba: number;
    hledat?: string | null;
    stav?: StavZaznamu | null;
}

export class Client {
    private readonly instance: AxiosInstance;

    constructor(instance: AxiosInstance) {
        this.instance = instance;
    }

    stavby_GetStavby(): Promise<GetStavbyResponse> {
        return this.instance.get('/api/stavby');
    }

    ciselnik_GetCiselniky(): Promise<GetCiselnikyResponse> {
        return this.instance.get('/api/ciselnik');
    }

    zaznamy_GetZaznamy(filtr: ZaznamyFiltr): Promise<GetZaznamyResponse> {
        return this.instance.get('/api/zaznamy', {
            params: {
                KStavba: filtr.kStavba,
                Hledat: filtr.hledat || undefined,
                Stav: filtr.stav ?? undefined,
            },
        });
    }

    zaznamy_GetZaznamDetail(zaznamId: number): Promise<GetZaznamDetailResponse> {
        return this.instance.get(`/api/zaznamy/${zaznamId}`);
    }

    zaznamy_CreateZaznam(zaznam: ZaznamCreateDTO): Promise<CreateZaznamResponse> {
        return this.instance.post('/api/zaznamy', { zaznam });
    }

    zaznamy_UpdateZaznam(zaznamId: number, zaznam: ZaznamUpdateDTO): Promise<UpdateZaznamResponse> {
        return this.instance.put(`/api/zaznamy/${zaznamId}`, zaznam);
    }

    zaznamy_DeleteZaznam(zaznamId: number): Promise<void> {
        return this.instance.delete(`/api/zaznamy/${zaznamId}`);
    }
}
