export async function loadTranslation(language: string): Promise<any> {
    const path = `../locales/${language || 'en'}/translation.json`;
    const translationModule = await import(path, { assert: { type: 'json' } });
    
    // Assuming the imported JSON module has the default structure
    const translationData = translationModule.default;

    // Removing the 'default' property
    delete translationData.default;

    return translationData;
}