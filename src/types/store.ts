export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductOption {
  name: string; // e.g. "Tamanho", "Cor"
  values: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  avatar?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number; // em centavos
  originalPrice?: number; // preço original se tiver desconto
  images: ProductImage[];
  category: ProductCategory;
  options: ProductOption[];
  reviews: ProductReview[];
  tags: string[];
  featured: boolean;
  stock: number;
  digital: boolean; // true para ebooks
}

export type ProductCategory = "ebook" | "camiseta" | "xicara" | "acessorio";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>; // e.g. { Tamanho: "M", Cor: "Azul" }
}

export interface CheckoutFormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  // endereço (não necessário para digitais)
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  // pagamento
  paymentMethod: "credit_card" | "pix" | "boleto";
  // cartão
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  installments?: number;
}
