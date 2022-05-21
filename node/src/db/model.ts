import mongoose from "mongoose";
import testSchema from './schema/test';

const model = mongoose.model;

export const TestModel = model('testModel', testSchema)
