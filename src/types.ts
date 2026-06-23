export interface Product {
  id: string | number;
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
  id?: string;
  email: string;
  name: string;
  password?: string;
  address?: string;
  photourl?: string;
  phone?: string;
  role?: 'admin' | 'customer';
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
  logo?: string;
  footerDescription?: string;
  metaPixelId?: string;
  seoKeywords?: string;
  aboutText1?: string;
  aboutText2?: string;
  aboutMission?: string;
  aboutVision?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactHours?: string;
  contactImageTop?: string;
  contactImageBottom?: string;
}
