import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers';
import { Moment } from 'moment';
import { Maybe } from '../../types/typeUtils';

interface Props {
    label: string;
    value: Maybe<Moment>;
    onChange: (value: Moment | null) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * Datum se v projektu drží jako `Moment`, ne jako nativní `Date`.
 */
const DatePicker = ({ label, value, onChange, disabled, className }: Props) => (
    <MUIDatePicker
        label={label}
        value={value ?? null}
        disabled={disabled}
        className={className}
        format="DD.MM.YYYY"
        slotProps={{ textField: { size: 'small', fullWidth: true } }}
        onChange={(newValue) => onChange(newValue)}
    />
);

export default DatePicker;
