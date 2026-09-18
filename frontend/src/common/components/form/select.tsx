import { MenuItem, TextField as MUITextField } from '@mui/material';
import { Maybe } from '../../types/typeUtils';
import { SelectOption } from './types';

interface Props<TKey extends string | number> {
    label: string;
    value: Maybe<TKey>;
    options: SelectOption<TKey>[];
    onChange: (value: TKey | null) => void;
    emptyLabel?: string;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
}

const EMPTY_KEY = '';

/**
 * Jednoduchý výběr z číselníku. Když je vyplněné `emptyLabel`, jde vybrat i prázdnou hodnotu.
 */
const Select = <TKey extends string | number>({
    label,
    value,
    options,
    onChange,
    emptyLabel,
    className,
    disabled,
    fullWidth,
}: Props<TKey>) => (
    <MUITextField
        select
        size="small"
        label={label}
        className={className}
        disabled={disabled}
        fullWidth={fullWidth}
        value={value ?? EMPTY_KEY}
        onChange={(e) => {
            const raw = e.target.value;
            if (raw === EMPTY_KEY) {
                onChange(null);
                return;
            }

            const option = options.find((x) => String(x.key) === String(raw));
            onChange(option ? option.key : null);
        }}
    >
        {emptyLabel !== undefined && <MenuItem value={EMPTY_KEY}>{emptyLabel}</MenuItem>}

        {options.map((option) => (
            <MenuItem
                key={option.key}
                value={option.key}
            >
                {option.label}
            </MenuItem>
        ))}
    </MUITextField>
);

export default Select;
