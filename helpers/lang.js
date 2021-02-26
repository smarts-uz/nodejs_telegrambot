exports.getLanguage =    (lang) => {

    const {language} = require(`../locales/${lang}`);
    return language;
}