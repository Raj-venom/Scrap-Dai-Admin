


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

declare interface Collector {
    _id: string
    email: string;
    password: string;
    fullName: string;
    phone: string;
    avatar: string;
    current_address: string;
    firstLogin: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
}

declare interface User {
    _id: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    gender: string;
    avatar: string;
    current_address: string;
    isverified: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
}

declare interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    scraps: Scrap[];
}


        
declare interface Scrap {
    _id: string;
    name: string;
    description: string;
    pricePerKg: number;
    scrapImage: string;
    category: Category;
    createdAt: string;
    updatedAt: string;
}