/**
 * i18n : https://react.i18next.com/latest/using-with-hooks
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import phraseData from './locales/getLangData.json';

const lng = localStorage.getItem('i18nextLngTemp') || localStorage.getItem('i18nextLng') || 'en';
moment.locale(lng);

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
  resources: phraseData,
  lng: lng,
  fallbackLng: {
    'en-GB': ['en'],
    'en-US': ['en'],
    'fr-FR': ['fr'],
    default: ['en']
  },
  debug: process.env.node_env !== 'production',
  keySeparator: false, // we use content as keys
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;
