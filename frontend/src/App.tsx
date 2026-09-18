import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment/dist/locale/cs';
import { ToastContainer } from 'react-toastify';
import AppRouter from './appRouter';
import ConfirmDialogProvider from './common/components/dialogs/confirmDialog/confirmDialogProvider';
import { proconomTheme } from './common/styles/themes';

moment.locale('cs');

const App = () => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={proconomTheme}>
            <CssBaseline />
            <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="cs"
            >
                <ConfirmDialogProvider>
                    <AppRouter />
                </ConfirmDialogProvider>
            </LocalizationProvider>

            <ToastContainer
                position="bottom-right"
                newestOnTop
            />
        </ThemeProvider>
    </StyledEngineProvider>
);

export default App;
