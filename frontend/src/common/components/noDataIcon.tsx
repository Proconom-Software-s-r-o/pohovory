import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    text: ReactNode;
    className?: string;
}

/**
 * Jednotný prázdný stav. Nikde se nepíše vlastní div s textem, vždycky se použije tahle komponenta.
 */
const NoDataIcon = ({ text, className }: Props) => (
    <div className={`d-flex flex-column align-items-center justify-content-center gap-2 p-4 text-secondary ${className ?? ''}`}>
        <InboxOutlinedIcon fontSize="large" />
        <Typography variant="body2">{text}</Typography>
    </div>
);

export default NoDataIcon;
