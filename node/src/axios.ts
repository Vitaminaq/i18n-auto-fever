import axios from 'axios';

axios.create({
    baseURL: 'https://fanyi-api.baidu.com',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
});

export default axios;
