export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  sizes?: string[];
  volumes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedAttr?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  password?: string;
  address?: string;
}
