import mongoose from "mongoose";

const db_url = "mongodb://localhost:27017";

const connectMongoose = async() => {
    try {
        await mongoose.connect(db_url, { dbName: 'i18n' });
        console.log('mongodb连接成功：', db_url);

        mongoose.connection.on('disconnection', function () {
            console.log('断开连接');
        });        
    } catch(e) {
        console.log('mongodb连接错误：', e);
    }
}

export default connectMongoose;