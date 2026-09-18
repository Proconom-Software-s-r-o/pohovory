import { Paper } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group as PanelGroup, Panel } from 'react-resizable-panels';
import NoDataIcon from '../common/components/noDataIcon';
import PanelResizer from '../common/components/panelResizer';
import useDebouncedValue from '../common/hooks/useDebouncedValue';
import { Maybe } from '../common/types/typeUtils';
import useRouteParams from '../hooks/useRouteParams';
import StavebniDenikSceneProvider from './components/stavebniDenikSceneProvider';
import useSmazZaznam from './hooks/useSmazZaznam';
import useZaznamyQuery from './hooks/useZaznamyQuery';
import { StavebniDenikContext, StavebniDenikContextProps } from './stavebniDenikContext';
import StavebniDenikTopbar from './stavebniDenikScene/stavebniDenikTopbar';
import ZaznamDetail from './stavebniDenikScene/zaznamDetail';
import ZaznamyTable from './stavebniDenikScene/zaznamyTable';
import { defaultZaznamyFiltr, ZaznamyFiltrState } from './stavebniDenikTypes';

/**
 * Stavebni denik jedne stavby - seznam zaznamu vlevo, detail vpravo.
 * Scena drzi stav cele stranky a posila ho dolu pres kontext, komponenty
 * si ho tahaji pres `useContext(StavebniDenikContext)`.
 */
const StavebniDenikScene = () => {
    const { t } = useTranslation('labels');
    const { stavbaId } = useRouteParams();

    const [filtr, setFiltr] = useState<ZaznamyFiltrState>(defaultZaznamyFiltr);
    const [selectedZaznamId, setSelectedZaznamId] = useState<Maybe<number>>(null);
    const [detailOtevren, setDetailOtevren] = useState(false);

    // Dokud uzivatel pise, na API se nechodi - viz ukol 3
    const hledatDebounced = useDebouncedValue(filtr.hledat);

    const { query, zaznamy } = useZaznamyQuery({ stavbaId, hledat: hledatDebounced, stav: filtr.stav });
    const { smazZaznam } = useSmazZaznam();

    const selectedZaznam = useMemo(
        () => zaznamy.find((zaznam) => zaznam.id === selectedZaznamId) ?? null,
        [zaznamy, selectedZaznamId]
    );

    const openZaznam = useCallback((zaznamId: number) => {
        setSelectedZaznamId(zaznamId);
        setDetailOtevren(true);
    }, []);

    const openNovyZaznam = useCallback(() => {
        setSelectedZaznamId(null);
        setDetailOtevren(true);
    }, []);

    const closeDetail = useCallback(() => {
        setSelectedZaznamId(null);
        setDetailOtevren(false);
    }, []);

    const deleteZaznam = useCallback(
        async (zaznamId: number) => {
            const smazano = await smazZaznam(zaznamId);
            if (smazano && zaznamId === selectedZaznamId) {
                closeDetail();
            }
        },
        [closeDetail, selectedZaznamId, smazZaznam]
    );

    const contextValue = useMemo<StavebniDenikContextProps>(
        () => ({
            stavbaId: stavbaId ?? 0,
            zaznamy,
            loading: query.isLoading,
            filtr,
            setFiltr,
            selectedZaznamId,
            selectedZaznam,
            detailOtevren,
            openZaznam,
            openNovyZaznam,
            closeDetail,
            deleteZaznam,
        }),
        [
            closeDetail,
            deleteZaznam,
            detailOtevren,
            filtr,
            openNovyZaznam,
            openZaznam,
            query.isLoading,
            selectedZaznam,
            selectedZaznamId,
            stavbaId,
            zaznamy,
        ]
    );

    if (!stavbaId) {
        return (
            <StavebniDenikSceneProvider>
                <NoDataIcon text={t('Vybrat stavbu')} />
            </StavebniDenikSceneProvider>
        );
    }

    return (
        <StavebniDenikSceneProvider>
            <StavebniDenikContext.Provider value={contextValue}>
                <StavebniDenikTopbar />

                <PanelGroup
                    orientation="horizontal"
                    className="flex-grow-1 pb-3 overflow-hidden"
                >
                    <Panel
                        defaultSize="68"
                        minSize="40"
                    >
                        <Paper className="h-100 overflow-auto">
                            <ZaznamyTable />
                        </Paper>
                    </Panel>

                    <PanelResizer />

                    <Panel
                        defaultSize="32"
                        minSize="20"
                    >
                        <Paper className="h-100 overflow-hidden">
                            <ZaznamDetail />
                        </Paper>
                    </Panel>
                </PanelGroup>
            </StavebniDenikContext.Provider>
        </StavebniDenikSceneProvider>
    );
};

export default StavebniDenikScene;
