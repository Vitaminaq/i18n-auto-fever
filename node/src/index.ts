import express from 'express';
import bodyParser from 'body-parser';
import cookie from 'cookie-parser';
import { initRouter } from './router';
import connectMongoose from './db';
import { whiteList } from './middleware/white-list';
import { formatRes } from './middleware/formatRes';
import { load } from "@node-rs/jieba";

const app = express();

app.use(bodyParser.json({limit: "20mb"}));
app.use(cookie());

app.all('*', whiteList);

app.all('*', formatRes);

initRouter(app);

connectMongoose();

const port = process.env.PORT || 3002;

app.listen(port);

console.log('start on port' + port);

load();
