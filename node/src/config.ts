export const translateAppid = '20220310001119599';

export const translateKey = '8JTpR8GVZNIWYh7jXsFi';

interface TranslateLanguagesMap {
    en_US: 'en', // 英语
    zh_TW: 'cht', // 台湾繁体
    zh_HK: 'cht', // 香港繁体
    ja_JP: 'jp' // 日语
}

export const translateLanguages: (keyof TranslateLanguagesMap)[] = ['en_US', 'zh_TW', 'zh_HK', 'ja_JP'];

export const translateLanguagesMap = {
    en_US: 'en', // 英语
    zh_TW: 'cht', // 台湾繁体
    zh_HK: 'cht', // 香港繁体
    ja_JP: 'jp' // 日语
};

export type Languages = TranslateLanguagesMap[keyof TranslateLanguagesMap]; // 英语 | 中文繁体 | 日语 | 韩语 | 法语
