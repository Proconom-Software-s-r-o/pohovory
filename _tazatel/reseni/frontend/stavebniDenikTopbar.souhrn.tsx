// ÚKOL 5 (bonus) - náhrada bloku `souhrn` v src/stavebniDenik/stavebniDenikScene/stavebniDenikTopbar.tsx

const souhrn = useMemo(
    () => ({
        pocet: zaznamy.length,
        prumer: prumerPracovniku(zaznamy),
        obdobi: obdobiZaznamu(zaznamy, (datum) => formatApiDate(datum)),
    }),
    [zaznamy]
);
