import http from '@/shared/services/http-common.js';

class AuthApiService {
    login(body) {
        return http.post('auth/login', body)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

export default new AuthApiService();