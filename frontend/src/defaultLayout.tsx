import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { LoaderCentered } from './common/components/loaderDefault';

/**
 * Obal kolem vsech scen. Hlavicku si kresli kazda scena sama pres svuj SceneProvider,
 * stejne jako v ostre aplikaci.
 */
const DefaultLayout = () => (
    <div className="d-flex flex-column h-100 overflow-hidden">
        <Suspense fallback={<LoaderCentered />}>
            <Outlet />
        </Suspense>
    </div>
);

export default DefaultLayout;
