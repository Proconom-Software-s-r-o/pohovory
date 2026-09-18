import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';
import { ChangeEvent } from 'react';

export type FormEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type Props = Omit<MUITextFieldProps, 'onChange' | 'value'> & {
    value: string;
    onChange: (value: string) => void;
};

/**
 * Obal nad MUI TextFieldem. MUI komponenty do formulářů se nepoužívají přímo,
 * vždycky přes wrapper v common/components/form - ať je chování na jednom místě.
 */
const TextField = ({ value, onChange, ...rest }: Props) => (
    <MUITextField
        {...rest}
        size={rest.size ?? 'small'}
        value={value}
        onChange={(e: FormEvent) => onChange(e.target.value)}
    />
);

export default TextField;
