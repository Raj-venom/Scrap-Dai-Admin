import API from "./api";

class ScrapService {

    baseUrl = "/scrap";

    async addNewScrap({ name, description, pricePerKg, category, scrapImage }: AddNewScrapParams) {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('pricePerKg', pricePerKg.toString());
            formData.append('category', category);
            formData.append('ScrapImage', scrapImage);

            const response = await API.post(`${this.baseUrl}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;

        } catch (error: any) {
            console.log('API :: addNewScrap :: error', error.response?.data || error)
            return error.response?.data;

        }
    }

    async updateScrapPrice({ id, pricePerKg }: UpdateScrapPriceParams) {
        try {
            const response = await API.patch(`${this.baseUrl}/${id}`, { pricePerKg });
            return response.data;
        } catch (error: any) {
            console.log('API :: updateScrapPrice :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async deleteScrap(id: string) {
        try {
            const response = await API.delete(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: deleteScrap :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getScrapById(id: string) {
        try {
            const response = await API.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getScrapById :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getAllScraps() {
        try {
            const response = await API.get(`${this.baseUrl}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllScraps :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async getAllScrapsPrice() {
        try {
            const response = await API.get(`${this.baseUrl}/all/prices`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllScrapsPrice :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async updateMultipleScrapPrice(scraps: { _id: string, pricePerKg: number }[]) {
        console.log('API :: updateMultipleScrapPrice :: scraps', scraps)
        try {
            const response = await API.patch(`${this.baseUrl}/all/update-multiple`, { scraps });
            console.log('API :: updateMultipleScrapPrice :: response', response)
            return response.data;
        } catch (error: any) {
            console.log('API :: updateMultipleScrapPrice :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

    async updateScrapDetails({ _id, name, description, pricePerKg, scrapImage }: UpdateScrapDetailsParams) {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('pricePerKg', pricePerKg.toString());
            // if (scrapImage) {
            //     formData.append('scrapImage', scrapImage);
            // }
            formData.append('ScrapImage', scrapImage || '');

            const response = await API.patch(`${this.baseUrl}/update/${_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error: any) {
            console.log('API :: updateScrapDetails :: error', error.response?.data || error)
            return error.response?.data;
        }
    }

}

const scrapService = new ScrapService();
export default scrapService;

