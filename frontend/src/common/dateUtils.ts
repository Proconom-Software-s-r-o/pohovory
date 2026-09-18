import moment, { Moment } from 'moment';
import { Maybe } from './types/typeUtils';

export const DATE_FORMAT = 'DD.MM.YYYY';
export const DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm';

/**
 * Převede datum z API (ISO string) na Moment.
 * V projektu se pracuje s Momentem, ne s nativním Date.
 * @param value hodnota z API
 * @returns Moment nebo null
 */
export const fromApiDate = (value: Maybe<string>): Moment | null => {
    if (!value) return null;

    const parsed = moment(value);
    return parsed.isValid() ? parsed : null;
};

/**
 * Převede Moment na formát, kterému rozumí API.
 * @param value datum z formuláře
 * @returns ISO řetězec bez časové zóny
 */
export const toApiDate = (value: Maybe<Moment>): string => (value ? value.format('YYYY-MM-DDTHH:mm:ss') : '');

/**
 * Naformátuje datum z API pro zobrazení.
 * @param value hodnota z API
 * @param format formát dle momentu
 * @returns naformátované datum, nebo pomlčka
 */
export const formatApiDate = (value: Maybe<string>, format: string = DATE_FORMAT): string => {
    const parsed = fromApiDate(value);
    return parsed ? parsed.format(format) : '—';
};
