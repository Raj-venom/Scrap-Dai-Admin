import API from "./api";

class OrderService {

    baseUrl = "/order";

    async getUserOrderHistoryById(userId: string, timeframe?: string) {
        try {
            const queryParams = timeframe && timeframe !== 'all' ? `?timeframe=${timeframe}` : '';
            const response = await API.get(`${this.baseUrl}/user-order-history/${userId}${queryParams}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getUserOrderHistoryById :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getCollectorOrderHistoryById(collectorId: string, timeframe?: string) {
        try {
            const queryParams = timeframe && timeframe !== 'all' ? `?timeframe=${timeframe}` : '';
            const response = await API.get(`${this.baseUrl}/collector-orders-history/${collectorId}${queryParams}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getCollectorOrderHistoryById :: error', error.response?.data || error)
            return error.response?.data;
        }
    }
}

const orderService = new OrderService();
export default orderService;