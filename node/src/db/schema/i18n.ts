import mongoose from 'mongoose';
import { translateLanguages } from '../../config';

const Schema = mongoose.Schema;

const TranslateSchema = new Schema({
    value: {
        type: String,
        default: ''
    },
    lock: {
        type: String,
        default: false
    }
});


//定义UserSchema的Schema
const I18nSchema = new Schema({
    key: {
        type: String,
        index: true
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
        ZH_CN: {
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

export default I18nSchema;
