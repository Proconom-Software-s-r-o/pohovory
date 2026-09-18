import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';
import { Maybe } from '../../types/typeUtils';
import { FormEvent } from './textField';

type Props = Omit<MUITextFieldProps, 'onChange' | 'value' | 'type'> & {
    value: Maybe<number>;
    onChange: (value: number | null) => void;
};

/**
 * Číselné pole - prázdná hodnota je null, ne NaN.
 */
const NumberField = ({ value, onChange, ...rest }: Props) => (
    <MUITextField
        {...rest}
        type="number"
        size={rest.size ?? 'small'}
        value={value ?? ''}
        onChange={(e: FormEvent) => {
            const raw = e.target.value;
            onChange(raw === '' ? null : Number(raw));
        }}
    />
);

export default NumberField;
