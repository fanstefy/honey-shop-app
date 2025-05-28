export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    origin: string;
}

export interface ContactForm {
    name: string;
    email: string;
    message: string;
}