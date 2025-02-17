import API from "./api";

class CollectorService {

    baseUrl = "/collector";

    async registerCollector({ fullName, email, phone, current_address }: CollectorRegisterParams) {
        try {
            const response = await API.post(`${this.baseUrl}/register`, { fullName, email, phone, current_address });
            return response.data;
        } catch (error: any) {
            console.log('API :: registerCollector :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getAllCollectors() {
        try {
            const response = await API.get(`${this.baseUrl}/all`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllCollectors :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

}

const collectorService = new CollectorService();
export default collectorService;