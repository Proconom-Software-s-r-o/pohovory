import { PocasiTyp, StavZaznamu, ZaznamDTO } from '../services/api/webapi';

/** Barva chipu podle stavu záznamu - používá MUI paletu. */
export type StavColor = 'default' | 'warning' | 'success';

export const stavColors: Record<StavZaznamu, StavColor> = {
    [StavZaznamu.Rozpracovany]: 'default',
    [StavZaznamu.Odeslany]: 'warning',
    [StavZaznamu.Schvaleny]: 'success',
};

export const stavLabels: Record<StavZaznamu, string> = {
    [StavZaznamu.Rozpracovany]: 'Rozpracovaný',
    [StavZaznamu.Odeslany]: 'Odeslaný',
    [StavZaznamu.Schvaleny]: 'Schválený',
};

export const pocasiLabels: Record<PocasiTyp, string> = {
    [PocasiTyp.Jasno]: 'Jasno',
    [PocasiTyp.Polojasno]: 'Polojasno',
    [PocasiTyp.Oblacno]: 'Oblačno',
    [PocasiTyp.Dest]: 'Déšť',
    [PocasiTyp.Snih]: 'Sníh',
    [PocasiTyp.Mlha]: 'Mlha',
};

/**
 * Schválený záznam už se needituje ani nemaže - stejné pravidlo hlídá i backend.
 * @param zaznam kontrolovaný záznam
 * @returns true pokud je záznam jen ke čtení
 */
export const isZaznamReadOnly = (zaznam: ZaznamDTO | null): boolean => zaznam?.stav === StavZaznamu.Schvaleny;

/**
 * Spočítá průměrný počet pracovníků na záznam. Prázdný seznam vrací 0.
 * @param zaznamy záznamy, ze kterých se počítá
 * @returns průměr zaokrouhlený na jedno desetinné místo
 */
export const prumerPracovniku = (zaznamy: ZaznamDTO[]): number => {
    if (zaznamy.length === 0) return 0;

    const soucet = zaznamy.reduce((acc, zaznam) => acc + zaznam.pocetPracovniku, 0);

    return Math.round((soucet / zaznamy.length) * 10) / 10;
};

/**
 * Vrátí rozsah dat záznamů jako text "od – do".
 * @param zaznamy záznamy, ze kterých se rozsah počítá
 * @param format funkce, která převede ISO datum na text
 * @returns text rozsahu, nebo pomlčka pro prázdný seznam
 */
export const obdobiZaznamu = (zaznamy: ZaznamDTO[], format: (datum: string) => string): string => {
    if (zaznamy.length === 0) return '—';

    const data = zaznamy.map((zaznam) => zaznam.datum).toSorted();
    const od = format(data[0]);
    const doDatum = format(data[data.length - 1]);

    return od === doDatum ? od : `${od} – ${doDatum}`;
};
