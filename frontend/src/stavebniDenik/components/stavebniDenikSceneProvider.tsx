import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import TopPanelDefault from '../../common/components/topPanel/topPanelDefault';
import { proconomTheme } from '../../common/styles/themes';
import useStavbaDetail from '../../hooks/useStavbaDetail';
import '../stavebniDenik.css';

interface Props {
    children: ReactNode;
    disableTopBar?: boolean;
}

const StavebniDenikSceneProvider = ({ children, disableTopBar }: Props) => {
    const { t } = useTranslation('labels');
    const { stavba } = useStavbaDetail();

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={proconomTheme}>
                <div className="d-flex flex-column h-100 overflow-hidden bg-less-gray">
                    {!disableTopBar && (
                        <TopPanelDefault
                            title={t('Stavební deník')}
                            subTitle={stavba?.nazev ?? ''}
                            style={{ height: '45px', flexShrink: 0 }}
                        />
                    )}

                    <div className="d-flex flex-column flex-grow-1 px-3 overflow-hidden">{children}</div>
                </div>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default StavebniDenikSceneProvider;
