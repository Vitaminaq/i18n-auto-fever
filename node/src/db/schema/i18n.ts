import mongoose from 'mongoose';
import { translateLanguages } from '../../config';

const Schema = mongoose.Schema;

const TranslateSchema = new Schema({
    value: {
        type: String,
        default: ''
    },
    lock: {
        type: Boolean,
        default: false
    },
    translator: {
        type: String // 翻译平台
    },
    translator_id: Number
});


//定义I18nSchema的Schema
const I18nSchema = new Schema({
    id: {
        type: Number,
        index: true
    },
    key: {
        type: String,
        index: true
    },
    relation: {
        type: Array,
        default: []
    },
    ZH_CN: {
        type: String,
        index: true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    update_time: {
        type: Date,
        default: Date.now
    }
});

export const getI18nSchema = () => {
    const obj: any = {};

    translateLanguages.forEach(lan => {
        obj[lan] = {
            type: TranslateSchema,
            default: {
                value: '',
                lock: false
            }
        };
    });
    return new Schema({
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
