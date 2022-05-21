import mongoose from 'mongoose';

const Schema = mongoose.Schema;


//定义UserSchema的Schema
const TestSchema = new Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    }
});

export default TestSchema;
