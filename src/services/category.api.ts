import API from "./api";

class CategoryService {

    baseUrl = "/category";

    async addNewCategory({ name, description, categoryImage }: AddNewCategoryParams) {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('categoryImage', categoryImage);

            const response = await API.post(`${this.baseUrl}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;

        } catch (error: any) {
            console.log('API :: addNewCategory :: error', error.response?.data || error)
            return error.response?.data;

        }
    }

    async getAllCategories() {
        try {
            const response = await API.get(`${this.baseUrl}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllCategories :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getSingleCategory(slug: string) {
        try {
            const response = await API.get(`${this.baseUrl}/${slug}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getSingleCategory :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

}

const categoryService = new CategoryService();
export default categoryService;