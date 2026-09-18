import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import csActionMessages from './locales/cs/actionMessages.json';
import csLabels from './locales/cs/labels.json';
import csToastMessages from './locales/cs/toastMessages.json';
import enActionMessages from './locales/en/actionMessages.json';
import enLabels from './locales/en/labels.json';
import enToastMessages from './locales/en/toastMessages.json';

export const supportedLanguages = ['cs', 'en'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const translationNamespaces = ['actionMessages', 'labels', 'toastMessages'] as const;
export type TranslationNamespace = (typeof translationNamespaces)[number];

export const defaultNs = 'actionMessages';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            cs: {
                actionMessages: csActionMessages,
                labels: csLabels,
                toastMessages: csToastMessages,
            },
            en: {
                actionMessages: enActionMessages,
                labels: enLabels,
                toastMessages: enToastMessages,
            },
        },
        supportedLngs: supportedLanguages,
        fallbackLng: 'cs',
        // Vychozi je cestina, prepnout jde pres ?lang=en (jazyk prohlizece se zamerne neresi)
        detection: {
            order: ['querystring', 'localStorage'],
            lookupQuerystring: 'lang',
            caches: ['localStorage'],
        },
        ns: translationNamespaces,
        defaultNS: defaultNs,
        // Klíčem je rovnou český text, proto se nesmí dělit podle teček
        keySeparator: false,
        nsSeparator: ':',
        interpolation: { escapeValue: false },
    });

export default i18n;
