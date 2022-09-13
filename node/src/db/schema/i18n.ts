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
