import API from "./api";

class AuthService {
    baseUrl = "/admin";

    async login({ identifier, password }: { identifier: string, password: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/login`, {
                identifier,
                password
            });

            return response.data;

        } catch (error: any) {
            console.log('API :: login :: error', error.response?.data || error)
            return error.response?.data;

        }
    }

    async logout() {
        try {
            const response = await API.post(`${this.baseUrl}/logout`);
            return response.data;
        } catch (error: any) {
            console.log('API :: logout :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async changePassword({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/change-password`, {
                currentPassword,
                newPassword
            });

            return response.data;

        } catch (error: any) {
            console.log('API :: changePassword :: error', error.response?.data || error)
            return error.response?.data;

        }
    }

    async getCurrentUser() {
        try {
            const response = await API.get(`${this.baseUrl}/current-user`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getCurrentUser :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

}

const authService = new AuthService();

export default authService;
