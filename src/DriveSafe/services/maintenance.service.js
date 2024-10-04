import axios from 'axios';
import http from '@/shared/services/http-common.js';

const API = 'http://localhost:3002/';

class MaintenanceService {

    getAll() {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'maintenances', { headers: { 'Authorization': `Bearer ${token}` } });
    }

    getById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'maintenances/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    create(data) {
        const token = localStorage.getItem('userToken');
        return axios.post(API + 'maintenances', data, { headers: { 'Authorization': `Bearer ${token}` } });
    }
}

export default new MaintenanceService();