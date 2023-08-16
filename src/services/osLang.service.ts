import os from 'os';

const getOperatingSystemLanguage = (): string => {
    const envLocale = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES;
    if (envLocale) {
        return envLocale.split('.')[0];
    }

    const platform = os.platform();
    console.log(platform);

    if (platform === 'win32') {
        const intl = os.release().split('.')[0];
        if (intl === '10') {
            return 'en-US';
        }
    }

    const locale = os.userInfo().username;

    if (locale && locale.includes('\\')) {
        const parts = locale.split('\\');
        if (parts.length > 1) {
            return parts[1];
        }
    }

    return 'Unknown';
}

const filterLang = (lang: string) => {
    if (lang.toLocaleLowerCase().match('ru')) {
        return 'ru'
    } else {
        return 'en'
    }
}


export const language = filterLang(getOperatingSystemLanguage());
console.log('Operating system language:', language);
