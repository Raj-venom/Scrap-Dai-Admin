import API from "./api";

interface Promotion {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    url?: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
}

interface CreatePromotionData {
    title: string;
    description: string;
    imageUrl: string;
    url?: string;
    startDate: string;
    endDate: string;
}

interface UpdatePromotionData extends Partial<CreatePromotionData> {
    _id: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

class PromotionService {
    private baseUrl = "/promotion";

    async createPromotion(data: CreatePromotionData): Promise<ApiResponse<Promotion>> {
        try {
            const response = await API.post(`${this.baseUrl}`, data);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: createPromotion :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }

    async getAllPromotions(): Promise<ApiResponse<Promotion[]>> {
        try {
            const response = await API.get(`${this.baseUrl}`);
            console.log('PromotionService :: getAllPromotions :: response', response.data);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: getAllPromotions :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }

    async getActivePromotions(): Promise<ApiResponse<Promotion[]>> {
        try {
            const response = await API.get(`${this.baseUrl}/active`);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: getActivePromotions :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }

    async getPromotion(id: string): Promise<ApiResponse<Promotion>> {
        try {
            const response = await API.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: getPromotion :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }

    async updatePromotion(data: UpdatePromotionData): Promise<ApiResponse<Promotion>> {
        try {
            const response = await API.put(`${this.baseUrl}/${data._id}`, data);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: updatePromotion :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }

    async deletePromotion(id: string): Promise<ApiResponse<void>> {
        try {
            const response = await API.delete(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: deletePromotion :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }
}

const promotionService = new PromotionService();
export default promotionService;