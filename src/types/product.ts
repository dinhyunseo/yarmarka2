export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  author: string;
  description: string;
}

export interface CartItem extends Product {
  cartId: number;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
