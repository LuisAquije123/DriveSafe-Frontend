import axios from "axios";


class FileService {
    API = 'http://localhost:3002/file';
    APIGET ='http://localhost:3002/file/storage/'

    upload(file) {
        const token = localStorage.getItem('userToken');
        let formData = new FormData();
        formData.append("myfile", file);
        console.log("FileService: ", file);

        return axios.post(this.API, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            console.log("Error del fileservice: ", error);
        })
    }
}

export default new FileService();