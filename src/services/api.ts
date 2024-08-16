import {API_URL} from '@/config/config.tsx';
import axios from 'axios';

export default axios.create({
    baseURL: API_URL,
});
    
