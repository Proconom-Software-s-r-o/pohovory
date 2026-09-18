import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NotFoundScene = () => {
    const { t } = useTranslation('labels');

    return (
        <div className="d-flex align-items-center justify-content-center h-100 p-5">
            <Typography variant="h5">{t('Nenalezena žádná stránka')}</Typography>
        </div>
    );
};

export default NotFoundScene;
