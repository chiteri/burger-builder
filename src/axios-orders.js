import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-7196e.firebaseio.com/'
});

export default instance;