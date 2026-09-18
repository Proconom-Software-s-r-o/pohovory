import { describe, expect, it } from 'vitest';
import { PocasiTyp, StavZaznamu, ZaznamDTO } from '../services/api/webapi';
import { isZaznamReadOnly, obdobiZaznamu, prumerPracovniku } from './zaznamUtils';

const zaznam = (id: number, pocetPracovniku: number, datum: string, stav = StavZaznamu.Rozpracovany): ZaznamDTO => ({
    id,
    kStavba: 1,
    datum,
    pocasi: PocasiTyp.Jasno,
    teplotaRano: null,
    teplotaOdpoledne: null,
    pocetPracovniku,
    popis: 'Popis',
    autor: 'Autor',
    stav,
    vytvoreno: datum,
    zmeneno: null,
});

describe('prumerPracovniku', () => {
    it('vrátí 0 pro prázdný seznam', () => {
        expect(prumerPracovniku([])).toBe(0);
    });

    it('spočítá průměr a zaokrouhlí na jedno desetinné místo', () => {
        const zaznamy = [zaznam(1, 4, '2026-09-01'), zaznam(2, 5, '2026-09-02'), zaznam(3, 8, '2026-09-03')];

        expect(prumerPracovniku(zaznamy)).toBe(5.7);
    });
});

describe('isZaznamReadOnly', () => {
    it('schválený záznam je jen ke čtení', () => {
        expect(isZaznamReadOnly(zaznam(1, 4, '2026-09-01', StavZaznamu.Schvaleny))).toBe(true);
    });

    it('rozpracovaný záznam se dá editovat', () => {
        expect(isZaznamReadOnly(zaznam(1, 4, '2026-09-01'))).toBe(false);
    });

    it('nevybraný záznam se dá editovat', () => {
        expect(isZaznamReadOnly(null)).toBe(false);
    });
});

const format = (datum: string) => datum.slice(0, 10);

describe('obdobiZaznamu', () => {
    it('vrátí pomlčku pro prázdný seznam', () => {
        expect(obdobiZaznamu([], format)).toBe('—');
    });

    it('vrátí jedno datum, pokud jsou všechny záznamy ze stejného dne', () => {
        expect(obdobiZaznamu([zaznam(1, 4, '2026-09-01'), zaznam(2, 5, '2026-09-01')], format)).toBe('2026-09-01');
    });

    it('vrátí rozsah od nejstaršího po nejnovější', () => {
        const zaznamy = [zaznam(1, 4, '2026-09-03'), zaznam(2, 5, '2026-09-01'), zaznam(3, 8, '2026-09-05')];

        expect(obdobiZaznamu(zaznamy, format)).toBe('2026-09-01 – 2026-09-05');
    });
});
