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
  isLatest?: boolean;
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
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Rocket';
  transactionId?: string;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  password?: string;
  address?: string;
  photoURL?: string;
  phone?: string;
}

export interface AppSettings {
  categories: string[];
  paymentNumbers: {
    bKash: string;
    Nagad: string;
    Rocket: string;
  };
}
