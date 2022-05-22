export const translateAppid = '20220521001223936';

export const translateKey = 'wXRf7BBMFkccZHxhzdmS';

interface TranslateLanguagesMap {
    EN_US: 'en', // 英语
    ZH_TW: 'cht', // 台湾繁体
    ZH_HK: 'cht', // 香港繁体
    JA_JP: 'jp' // 日语
}

export const translateLanguages: (keyof TranslateLanguagesMap)[] = ['EN_US', 'ZH_TW', 'ZH_HK', 'JA_JP'];

export const translateLanguagesMap = {
    EN_US: 'en', // 英语
    ZH_TW: 'cht', // 台湾繁体
    ZH_HK: 'cht', // 香港繁体
    JA_JP: 'jp' // 日语
};

export type Languages = TranslateLanguagesMap[keyof TranslateLanguagesMap]; // 英语 | 中文繁体 | 日语 | 韩语 | 法语
