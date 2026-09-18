import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { LoaderCentered } from '../common/components/loaderDefault';
import NoDataIcon from '../common/components/noDataIcon';
import TopPanelDefault from '../common/components/topPanel/topPanelDefault';
import { useStavbyQuery } from '../hooks/useStavbaDetail';

const StavbyScene = () => {
    const { t } = useTranslation('labels');
    const navigate = useNavigate();

    const { query, stavby } = useStavbyQuery();

    return (
        <div className="d-flex flex-column h-100">
            <TopPanelDefault title={t('Stavby')} />

            <div className="d-flex flex-column gap-3 px-3 py-4 overflow-auto">
                {query.isLoading && <LoaderCentered />}

                {!query.isLoading && !stavby.length && <NoDataIcon text={t('Vybrat stavbu')} />}

                <div className="d-flex flex-wrap gap-3">
                    {stavby.map((stavba) => (
                        <Card
                            key={stavba.id}
                            sx={{ width: 320 }}
                        >
                            <CardActionArea onClick={() => navigate(`/stavby/${stavba.id}/denik`)}>
                                <CardContent>
                                    <Typography variant="h6">{stavba.nazev}</Typography>
                                    <Typography
                                        variant="body2"
                                        className="text-secondary"
                                    >
                                        {t('Investor')}: {stavba.investor}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StavbyScene;
