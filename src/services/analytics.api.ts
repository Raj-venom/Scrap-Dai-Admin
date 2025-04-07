import API from "./api";


class AnalyticsService {
    baseUrl = "/analytics";

    async getTopScrapSellers() {
        try {
            const response = await API.get(`${this.baseUrl}/top-scrap-seller`, {
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
            return response.data;
        } catch (error: any) {
            console.log('API :: getTopScrapSellers :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getTopCollectors() {
        try {
            const response = await API.get(`${this.baseUrl}/top-collectors`, {
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
            return response.data;
        } catch (error: any) {
            console.log('API :: getTopCollectors :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

}

const analyticsService = new AnalyticsService();
export default analyticsService;