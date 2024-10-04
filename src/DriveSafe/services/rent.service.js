import axios from 'axios';
import http from '@/shared/services/http-common.js';

const API = 'http://localhost:3002/';

class RentService {
    getAll() {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'rents', { headers: { 'Authorization': `Bearer ${token}` } });
    }

    getById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'rents/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    getByUserId(userId) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'rents/tenant/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    create(data) {
        const token = localStorage.getItem('userToken');
        return axios.post(API + 'rents', data, { headers: { 'Authorization': `Bearer ${token}` } });
    }

    update(id, data) {
        const token = localStorage.getItem('userToken');
        return axios.put(API + 'rents/' + id, data, { headers: { 'Authorization': `Bearer ${token}` } });
    }

    delete(id) {
        const token = localStorage.getItem('userToken');
        return axios.delete(API + 'rents/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}

export default new RentService();
