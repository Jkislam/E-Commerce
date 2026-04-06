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
  islatest?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedAttr?: string;
}

export interface Order {
  id: string;
  customername: string;
  customeremail: string;
  customerphone: string;
  customeraddress: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentmethod: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Rocket';
  transactionid?: string;
  createdat: string;
}

export interface User {
  email: string;
  name: string;
  password?: string;
  address?: string;
  photourl?: string;
  phone?: string;
}

export interface AppSettings {
  id?: number;
  categories: string[];
  paymentNumbers: {
    bKash: string;
    Nagad: string;
    Rocket: string;
  };
  hero?: {
    image: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
  };
  brandName?: string;
  footerDescription?: string;
  metaPixelId?: string;
}
