import express from 'express';
import bodyParser from 'body-parser';
import router from './router';
import connectMongoose from './db';

const app = express();

app.use(bodyParser.json({limit: "20mb"}));

app.use('/api/i18n', router());

connectMongoose();

const port = process.env.PORT || 3002;

app.listen(port);

console.log('start on port' + port);
