import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import clsx from 'clsx';
import { MouseEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LoaderCentered } from '../../common/components/loaderDefault';
import NoDataIcon from '../../common/components/noDataIcon';
import { formatApiDate } from '../../common/dateUtils';
import { truncate } from '../../common/stringUtils';
import { StavebniDenikContext } from '../stavebniDenikContext';
import { isZaznamReadOnly, pocasiLabels, stavColors, stavLabels } from '../zaznamUtils';

const ZaznamyTable = () => {
    const { t } = useTranslation('labels');

    const { zaznamy, loading, selectedZaznamId, openZaznam, deleteZaznam } = useContext(StavebniDenikContext);

    if (loading) {
        return <LoaderCentered />;
    }

    if (!zaznamy.length) {
        return <NoDataIcon text={t('Deník je prázdný')} />;
    }

    const handleDelete = (e: MouseEvent, zaznamId: number) => {
        e.stopPropagation();
        deleteZaznam(zaznamId);
    };

    return (
        <Table
            size="small"
            stickyHeader
        >
            <TableHead>
                <TableRow>
                    <TableCell>{t('Datum')}</TableCell>
                    <TableCell>{t('Počasí')}</TableCell>
                    <TableCell align="right">{t('Počet pracovníků')}</TableCell>
                    <TableCell>{t('Popis prací')}</TableCell>
                    <TableCell>{t('Autor')}</TableCell>
                    <TableCell>{t('Stav')}</TableCell>
                    <TableCell align="right" />
                </TableRow>
            </TableHead>

            <TableBody>
                {zaznamy.map((zaznam) => (
                    <TableRow
                        key={zaznam.id}
                        hover
                        className={clsx('zaznam-row', { selected: zaznam.id === selectedZaznamId })}
                        onClick={() => openZaznam(zaznam.id)}
                    >
                        <TableCell>{formatApiDate(zaznam.datum)}</TableCell>
                        <TableCell>{pocasiLabels[zaznam.pocasi]}</TableCell>
                        <TableCell align="right">{zaznam.pocetPracovniku}</TableCell>
                        <TableCell>
                            <Tooltip title={zaznam.popis}>
                                <span>{truncate(zaznam.popis, 60)}</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>{zaznam.autor}</TableCell>
                        <TableCell>
                            <Chip
                                size="small"
                                label={stavLabels[zaznam.stav]}
                                color={stavColors[zaznam.stav]}
                            />
                        </TableCell>
                        <TableCell align="right">
                            <IconButton
                                size="small"
                                disabled={isZaznamReadOnly(zaznam)}
                                onClick={(e) => handleDelete(e, zaznam.id)}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ZaznamyTable;
