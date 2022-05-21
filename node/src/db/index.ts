import mongoose from "mongoose";
import { TestModel } from './model';

const db_url = "mongodb://localhost:27017";

mongoose.connect(db_url, { dbName: 'i18n' });

mongoose.connection.on('connected', function () {
    console.log('连接成功：', db_url);

    //创建模型
    let Model = new TestModel({
        username: '小明',
        password: '123456',
        age: 18
    })
    //2.同模型的sava([fn]),保存模型到数据库中
    Model.save(function (err: any, res: any) {
        if (err) {
            console.log('保存失败：', err);
        } else {
            console.log(res);
        }
    })

})

mongoose.connection.on('error', function (err) {
    console.log('连接错误：', err);
})

mongoose.connection.on('disconnection', function () {
    console.log('断开连接');
})

export default mongoose;