import mongoose from 'mongoose';
import { translateLanguages } from '../../config';

const Schema = mongoose.Schema;

// 暂时废弃-简化结构
// const TranslateSchema = new Schema({
//     value: {
//         type: String,
//         default: ''
//     },
//     lock: {
//         type: Boolean,
//         default: false
//     },
//     translator: {
//         type: String // 翻译者 - 预留
//     },
//     translator_id: Number // 翻译者id - 预留
// });


//定义I18nSchema的Schema
// const I18nSchema = new Schema({
//     id: {
//         type: Number,
//         index: true
//     },
//     key: {
//         type: String,
//         index: true
//     },
//     relation: {
//         type: Array,
//         default: []
//     },
//     ZH_CN: {
//         type: String,
//         index: true
//     },
//     create_time: {
//         type: Date,
//         default: Date.now
//     },
//     update_time: {
//         type: Date,
//         default: Date.now
//     }
// });

export const getI18nSchema = () => {
    const obj: any = {};

    translateLanguages.forEach(lan => {
        obj[lan] = {
            type: String,
            default: ""
        };
    });
    return new Schema({
        project: {
            type: String,
            index: true,
            default: "none"
        },
        path: {
            type: String,
            index: true,
            default: ""
        },
        key: {
            type: String,
            index: true
        },
        zh_CN: {
            type: String,
            index: true
        },
        ...obj,
        create_time: {
            type: Date,
            default: Date.now
        },
        update_time: {
            type: Date,
            default: Date.now
        }
    });
}
