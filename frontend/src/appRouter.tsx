import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { LoaderCentered } from './common/components/loaderDefault';
import NotFoundScene from './common/components/notFoundScene';
import DefaultLayout from './defaultLayout';

// Každá scéna se načítá líně - jedna routa = jedna scéna
const StavbyScene = lazy(() => import('./seznamStaveb/stavbyScene'));
const StavebniDenikScene = lazy(() => import('./stavebniDenik/stavebniDenikScene'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/stavby" replace />,
            },
            {
                path: 'stavby',
                element: <StavbyScene />,
            },
            {
                path: 'stavby/:stavbaId/denik',
                element: <StavebniDenikScene />,
            },
            {
                path: '*',
                element: <NotFoundScene />,
            },
        ],
    },
]);

const AppRouter = () => (
    <Suspense fallback={<LoaderCentered />}>
        <RouterProvider router={router} />
    </Suspense>
);

export default AppRouter;
