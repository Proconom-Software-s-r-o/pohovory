import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Select from '../../common/components/form/select';
import TextField from '../../common/components/form/textField';
import { SelectOption } from '../../common/components/form/types';
import { formatApiDate } from '../../common/dateUtils';
import { StavZaznamu } from '../../services/api/webapi';
import { StavebniDenikContext } from '../stavebniDenikContext';
import { obdobiZaznamu, prumerPracovniku, stavLabels } from '../zaznamUtils';

const StavebniDenikTopbar = () => {
    const { t } = useTranslation('labels');
    const navigate = useNavigate();

    const { zaznamy, filtr, setFiltr, openNovyZaznam } = useContext(StavebniDenikContext);

    const stavOptions = useMemo<SelectOption<StavZaznamu>[]>(
        () => Object.entries(stavLabels).map(([key, label]) => ({ key: Number(key) as StavZaznamu, label })),
        []
    );

    // ÚKOL 5 (bonus): dopocitat souhrn nad `zaznamy` a zobrazit ho vpravo v liste
    //  - pocet zaznamu, prumerny pocet pracovniku (viz prumerPracovniku)
    //    a obdobi od-do (viz obdobiZaznamu + formatApiDate)
    //  - hodnoty se maji prepocitat jen pri zmene `zaznamy`, ne pri kazdem prekresleni
    const souhrn = useMemo(
        () => ({
            pocet: 0,
            prumer: 0,
            obdobi: '—',
        }),
        [zaznamy]
    );

    return (
        <div className="d-flex flex-wrap align-items-center gap-2 py-2">
            <Button
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/stavby')}
            >
                {t('Zpět na stavby')}
            </Button>

            <TextField
                label={t('Vyhledat v popisu nebo autorovi')}
                value={filtr.hledat}
                onChange={(hledat) => setFiltr((prev) => ({ ...prev, hledat }))}
                sx={{ width: 320 }}
            />

            <Select
                label={t('Stav')}
                value={filtr.stav}
                options={stavOptions}
                emptyLabel={t('Všechny stavy')}
                onChange={(stav) => setFiltr((prev) => ({ ...prev, stav }))}
                className="w-auto"
            />

            <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={openNovyZaznam}
            >
                {t('Nový záznam')}
            </Button>

            <div className="d-flex gap-4 ms-auto text-secondary">
                <Typography variant="body2">
                    {t('Záznamů celkem')}: <strong>{souhrn.pocet}</strong>
                </Typography>
                <Typography variant="body2">
                    {t('Průměrně pracovníků')}: <strong>{souhrn.prumer}</strong>
                </Typography>
                <Typography variant="body2">
                    {t('Období')}: <strong>{souhrn.obdobi}</strong>
                </Typography>
            </div>
        </div>
    );
};

export default StavebniDenikTopbar;
