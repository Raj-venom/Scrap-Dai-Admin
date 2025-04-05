
import API from "./api";

class DashboardService {
    baseUrl = "/dashboard";

    async getDashboardStats() {
        try {
            const response = await API.get(`${this.baseUrl}/admin-dashboard-stats`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getDashboardStats :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getCollectionOverview() {
        try {
            const response = await API.get(`${this.baseUrl}/collection-overview`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getCollectionOverview :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

}

const dashboardService = new DashboardService();
export default dashboardService;