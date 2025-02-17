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

}

const userService = new UserService();
export default userService;