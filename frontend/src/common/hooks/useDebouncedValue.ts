/**
 * ÚKOL 3 - Hook that postpones a value (debounce).
 *
 * Topbar deniku ho vola nad textem z vyhledavaciho pole. Bez nej se pri kazdem
 * stisku klavesy zmeni queryKey a posle se dotaz na API, coz nechceme.
 *
 * Zadani:
 *  - hook dostane hodnotu a prodlevu v ms
 *  - vraci posledni hodnotu, ktera se po zadanou dobu nezmenila
 *  - pri dalsi zmene (a pri odmountovani komponenty) se rozbehnuty casovac zrusi
 *
 * @param {T} value The value to debounce.
 * @param {number} delay Delay in milliseconds.
 * @returns The debounced value.
 */
const useDebouncedValue = <T>(value: T, delay: number = 400): T => {
    // TODO (úkol 3): implementovat
    //  1) drz si odlozenou hodnotu ve stavu (vychozi = value)
    //  2) v useEffectu nastav setTimeout, ktery ji po `delay` prepise na aktualni `value`
    //  3) z useEffectu vrat uklid, ktery timeout zrusi
    return value;
};

export default useDebouncedValue;
