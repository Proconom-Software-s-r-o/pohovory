import { Typography } from '@mui/material';
import { CSSProperties, memo, ReactNode } from 'react';
import { Link } from 'react-router';

interface IProps {
    title: string;
    subTitle?: string;
    children?: ReactNode | undefined;
    className?: string;
    style?: CSSProperties;
}

const TopPanelDefault = ({ title, subTitle, children, className = '', style = {} }: IProps) => (
    <div
        className={`proconom-topbar d-flex align-items-center gap-3 px-3 ${className}`}
        style={style}
    >
        <Link
            to="/stavby"
            className="text-decoration-none text-white"
        >
            <Typography variant="subtitle1">PRO|||CONOM</Typography>
        </Link>

        <Typography variant="subtitle2">{title}</Typography>

        {!!subTitle && (
            <Typography
                variant="caption"
                className="opacity-75"
            >
                {subTitle}
            </Typography>
        )}

        <div className="d-flex align-items-center gap-2 ms-auto">{children}</div>
    </div>
);

export default memo(TopPanelDefault);
