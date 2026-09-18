import { useEffect, useState } from 'react';

/**
 * ÚKOL 3 - Hook that postpones a value (debounce).
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
