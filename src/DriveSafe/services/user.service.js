import axios from 'axios';

const API = 'http://localhost:3002/';

class UserService {
    getUserById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'users/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
    create(data){
        return axios.post(API + 'auth/register', data);
    }
    update(id, data) {
        const token = localStorage.getItem('userToken');
        return axios.put(API + 'users/' + id, data, { headers: { 'Authorization': `Bearer ${token}` } });
    }
}

export default new UserService();