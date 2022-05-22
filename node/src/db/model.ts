import mongoose from "mongoose";
import { getI18nSchema } from './schema/i18n';

const model = mongoose.model;

export const I18nModel = model('i18nModel', getI18nSchema());

