


declare interface CollectorRegisterParams {
    fullName: string;
    email: string;
    phone: string;
    current_address: string;
}

declare interface AddNewScrapParams {
    name: string;
    description: string;
    pricePerKg: number;
    category: string;
    scrapImage: File;
}

declare interface UpdateScrapPriceParams {
    id: string;
    pricePerKg: number;
}   

declare interface AddNewCategoryParams {
    name: string;
    description: string;
    categoryImage: File;
}