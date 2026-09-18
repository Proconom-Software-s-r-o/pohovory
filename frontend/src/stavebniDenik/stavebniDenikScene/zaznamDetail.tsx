import { Button, Divider, Typography } from '@mui/material';
import moment, { Moment } from 'moment';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../common/components/form/datePicker';
import NoDataIcon from '../../common/components/noDataIcon';
import NumberField from '../../common/components/form/numberField';
import Select from '../../common/components/form/select';
import TextField from '../../common/components/form/textField';
import { SelectOption } from '../../common/components/form/types';
import { DATE_TIME_FORMAT, formatApiDate, toApiDate } from '../../common/dateUtils';
import { isValid } from '../../common/stringUtils';
import { Maybe } from '../../common/types/typeUtils';
import Utils from '../../common/utils';
import { PocasiTyp, StavZaznamu, ZaznamCreateDTO, ZaznamDTO, ZaznamUpdateDTO } from '../../services/api/webapi';
import useCiselnikyQuery from '../hooks/useCiselnikyQuery';
import useUlozZaznam from '../hooks/useUlozZaznam';
import { StavebniDenikContext } from '../stavebniDenikContext';
import { isZaznamReadOnly, pocasiLabels, stavLabels } from '../zaznamUtils';

interface FormState {
    datum: Moment | null;
    pocasi: PocasiTyp;
    teplotaRano: Maybe<number>;
    teplotaOdpoledne: Maybe<number>;
    pocetPracovniku: Maybe<number>;
    popis: string;
    stav: StavZaznamu;
}

const prazdnyForm = (): FormState => ({
    datum: moment(),
    pocasi: PocasiTyp.Jasno,
    teplotaRano: null,
    teplotaOdpoledne: null,
    pocetPracovniku: 0,
    popis: '',
    stav: StavZaznamu.Rozpracovany,
});

const zaznamToForm = (zaznam: ZaznamDTO): FormState => ({
    datum: moment(zaznam.datum),
    pocasi: zaznam.pocasi,
    teplotaRano: zaznam.teplotaRano,
    teplotaOdpoledne: zaznam.teplotaOdpoledne,
    pocetPracovniku: zaznam.pocetPracovniku,
    popis: zaznam.popis,
    stav: zaznam.stav,
});

/**
 * Detail zaznamu - stejny formular slouzi pro zalozeni i pro editaci.
 * `selectedZaznam === null` znamena novy zaznam.
 */
const ZaznamDetail = () => {
    const { t } = useTranslation('labels');
    const { t: tToast } = useTranslation('toastMessages');

    const { stavbaId, selectedZaznam, detailOtevren, openZaznam, closeDetail } = useContext(StavebniDenikContext);
    const { pocasi: pocasiCiselnik, stavy: stavyCiselnik } = useCiselnikyQuery();
    const { ulozZaznam, loading } = useUlozZaznam();

    const [form, setForm] = useState<FormState>(() => (selectedZaznam ? zaznamToForm(selectedZaznam) : prazdnyForm()));

    // Pri prepnuti na jiny zaznam se formular naplni znovu
    useEffect(() => {
        setForm(selectedZaznam ? zaznamToForm(selectedZaznam) : prazdnyForm());
    }, [selectedZaznam]);

    const readOnly = isZaznamReadOnly(selectedZaznam);

    const pocasiOptions = useMemo<SelectOption<PocasiTyp>[]>(
        () =>
            pocasiCiselnik.map((polozka) => ({
                key: polozka.id as PocasiTyp,
                label: pocasiLabels[polozka.id as PocasiTyp] ?? polozka.nazev,
            })),
        [pocasiCiselnik]
    );

    const stavOptions = useMemo<SelectOption<StavZaznamu>[]>(
        () =>
            stavyCiselnik.map((polozka) => ({
                key: polozka.id as StavZaznamu,
                label: stavLabels[polozka.id as StavZaznamu] ?? polozka.nazev,
            })),
        [stavyCiselnik]
    );

    const setField = useCallback(
        <TKey extends keyof FormState>(key: TKey, value: FormState[TKey]) =>
            setForm((prev) => ({ ...prev, [key]: value })),
        []
    );

    const handleSave = useCallback(async () => {
        if (!isValid(form.popis)) {
            Utils.errorToast(tToast('Popis prací je povinný'));
            return;
        }

        const spolecne = {
            datum: toApiDate(form.datum),
            pocasi: form.pocasi,
            teplotaRano: form.teplotaRano ?? null,
            teplotaOdpoledne: form.teplotaOdpoledne ?? null,
            pocetPracovniku: form.pocetPracovniku ?? 0,
            popis: form.popis.trim(),
        };

        const novy: ZaznamCreateDTO = { kStavba: stavbaId, ...spolecne };
        const upraveny: ZaznamUpdateDTO = { ...spolecne, stav: form.stav };

        const ulozeny = await ulozZaznam({ zaznamId: selectedZaznam?.id ?? null, novy, upraveny });
        if (ulozeny) {
            openZaznam(ulozeny.id);
        }
    }, [form, openZaznam, selectedZaznam, stavbaId, tToast, ulozZaznam]);

    if (!detailOtevren) {
        return <NoDataIcon text={t('Nevybrán žádný záznam')} />;
    }

    return (
        <div className="d-flex flex-column gap-3 p-3 h-100 overflow-auto">
            <Typography variant="h6">{selectedZaznam ? t('Detail záznamu') : t('Nový záznam')}</Typography>

            <DatePicker
                label={t('Datum')}
                value={form.datum}
                disabled={readOnly}
                onChange={(value) => setField('datum', value)}
            />

            <Select
                label={t('Počasí')}
                value={form.pocasi}
                options={pocasiOptions}
                disabled={readOnly}
                fullWidth
                onChange={(value) => setField('pocasi', value ?? PocasiTyp.Jasno)}
            />

            <div className="d-flex gap-2">
                <NumberField
                    label={t('Teplota ráno')}
                    value={form.teplotaRano}
                    disabled={readOnly}
                    fullWidth
                    onChange={(value) => setField('teplotaRano', value)}
                />
                <NumberField
                    label={t('Teplota odpoledne')}
                    value={form.teplotaOdpoledne}
                    disabled={readOnly}
                    fullWidth
                    onChange={(value) => setField('teplotaOdpoledne', value)}
                />
            </div>

            <NumberField
                label={t('Počet pracovníků')}
                value={form.pocetPracovniku}
                disabled={readOnly}
                fullWidth
                onChange={(value) => setField('pocetPracovniku', value)}
            />

            <TextField
                label={t('Popis prací')}
                value={form.popis}
                disabled={readOnly}
                multiline
                minRows={5}
                fullWidth
                onChange={(value) => setField('popis', value)}
            />

            {!!selectedZaznam && (
                <Select
                    label={t('Stav')}
                    value={form.stav}
                    options={stavOptions}
                    disabled={readOnly}
                    fullWidth
                    onChange={(value) => setField('stav', value ?? StavZaznamu.Rozpracovany)}
                />
            )}

            {!!selectedZaznam && (
                <>
                    <Divider />

                    <div className="d-flex flex-column text-secondary">
                        <Typography variant="caption">
                            {t('Autor')}: {selectedZaznam.autor}
                        </Typography>
                        <Typography variant="caption">
                            {t('Vytvořeno')}: {formatApiDate(selectedZaznam.vytvoreno, DATE_TIME_FORMAT)}
                        </Typography>
                        <Typography variant="caption">
                            {t('Změněno')}: {formatApiDate(selectedZaznam.zmeneno, DATE_TIME_FORMAT)}
                        </Typography>
                    </div>
                </>
            )}

            <div className="d-flex gap-2 mt-auto pt-2">
                <Button
                    variant="contained"
                    disabled={readOnly || loading}
                    onClick={handleSave}
                >
                    {t('Uložit')}
                </Button>

                <Button onClick={closeDetail}>{t('Zavřít')}</Button>
            </div>
        </div>
    );
};

export default ZaznamDetail;
