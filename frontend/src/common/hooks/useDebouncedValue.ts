import { useEffect, useState } from 'react';

/**
 * Hook that postpones a value (debounce).
 *
 * Pouziva se nad textem z vyhledavaciho pole - bez nej by se pri kazdem stisku
 * klavesy zmenil queryKey a odesel dotaz na API.
 *
 * @param {T} value The value to debounce.
 * @param {number} delay Delay in milliseconds.
 * @returns The debounced value.
 */
const useDebouncedValue = <T>(value: T, delay: number = 400): T => {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay);

        // Uklid - zrusi bezici casovac pri dalsi zmene i pri odmountovani komponenty
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
};

export default useDebouncedValue;
