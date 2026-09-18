import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import queryClient from './queryClient';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const container = document.getElementById('root');
if (!container) {
    throw new Error('V index.html chybí element #root.');
}

createRoot(container).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
);
