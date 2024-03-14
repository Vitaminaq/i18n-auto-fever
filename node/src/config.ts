export const translateAppid = '20220521001223936';

export const translateKey = 'wXRf7BBMFkccZHxhzdmS';

interface TranslateLanguagesMap {
    en: 'en', // 英语
    jp: 'jp', // 日语
    kr: 'kor', // 韩语
    ru: 'ru' // 俄语
}

export const translateLanguages: (keyof TranslateLanguagesMap)[] = ['en', 'jp', 'kr', 'ru'];

export const translateLanguagesMap = {
    en: 'en', // 英语
    jp: 'jp', // 台湾繁体
    kr: 'kor', // 香港繁体
    ru: 'ru' // 日语
};

export type Languages = TranslateLanguagesMap[keyof TranslateLanguagesMap]; // 英语 | 中文繁体 | 日语 | 韩语 | 法语

export const scret = "JWT";

export const tokens = [
    "d0YZgFux6GurMfPBFRjs2WJJ9ErOaDZXA89KozS088KMdbQcVDBKL6KmG5Zhol8m",
    "jtFOBesruCAdbJ82TEIcj7tEZ9reAfes7E5jResZSm95q8ZEcfQe90QGUCHlsS9T",
];
