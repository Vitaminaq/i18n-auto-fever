import express from 'express';
import router from './router';

const app = express();

app.use('/api/i18n', router());

const port = process.env.PORT || 3002;

app.listen(port);

console.log('start on port' + port);
