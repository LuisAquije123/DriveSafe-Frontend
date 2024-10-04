import axios from 'axios';



class VehicleService {
    API = 'http://localhost:3002/';

    getAll() {
        const token = localStorage.getItem('userToken');
        return axios.get(this.API + 'vehicles', { headers: { 'Authorization': `Bearer ${token}` } });
    }

    getById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(this.API + 'vehicles/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    getByUserId(userId) {
        const token = localStorage.getItem('userToken');
        return axios.get(this.API + 'vehicles/ownerId/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    create(data) {
        const token = localStorage.getItem('userToken');
        return axios.post(this.API + 'vehicles', data, { headers: { 'Authorization': `Bearer ${token}` } });
    }

    delete(id) {
        const token = localStorage.getItem('userToken');
        return axios.delete(this.API + 'vehicles/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}

export default new VehicleService();