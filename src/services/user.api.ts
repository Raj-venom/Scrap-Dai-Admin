import API from "./api";

class UserService {
    baseUrl = "/user";

    async getAllUsers() {
        try {
            const response = await API.get(`${this.baseUrl}/all`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllUsers :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async banUser(userId: string) {
        try {
            const response = await API.patch(`${this.baseUrl}/ban-user/${userId}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: banUser :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async unBanUser(userId: string) {
        try {
            const response = await API.patch(`${this.baseUrl}/unban-user/${userId}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: unBanUser :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

}

const userService = new UserService();
export default userService;