import { useMemo } from 'react';
import { useParams } from 'react-router';

/**
 * Parametry z URL `/stavby/:stavbaId/denik` převedené na čísla.
 * URL je v téhle aplikaci primární zdroj kontextu - nedrží se ve stavu ani v contextu.
 */
const useRouteParams = () => {
    const { stavbaId } = useParams();

    return useMemo(
        () => ({
            stavbaId: stavbaId ? Number(stavbaId) : null,
        }),
        [stavbaId]
    );
};

export default useRouteParams;
