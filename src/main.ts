import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';
import './carbon.css';
// import "carbon-components-svelte/css/all.css";


import App from './components/App.svelte';
import en from './i18n/en.json';
import fr from './i18n/fr.json';

addMessages('en', en);
addMessages('fr', fr);

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()
});

const app = new App({
    target: document.body
});

export default app;
