import { CircularProgress } from '@mui/material';

const LoaderDefault = () => <CircularProgress size={32} />;

/** Loader vycentrovaný v rodičovském elementu. */
export const LoaderCentered = () => (
    <div className="d-flex align-items-center justify-content-center w-100 h-100 p-4">
        <LoaderDefault />
    </div>
);

export default LoaderDefault;
