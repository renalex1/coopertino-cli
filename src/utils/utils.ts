export async function loadTranslation(language: string): Promise<any> {
    const path = `./locales/${language || 'en'}/translation.json`;
    return import(path, { assert: { type: 'json' } });
}