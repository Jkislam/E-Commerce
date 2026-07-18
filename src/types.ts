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
  images?: string[];
  
  // Delivery Options
  delivery_days_min?: number;
  delivery_days_max?: number;
  delivery_charge?: number;
  delivery_charge_active?: boolean;
  
  // COD Options
  cod_available?: boolean;
  
  // Return & Warranty
  change_of_mind_available?: boolean;
  easy_return_days?: number;
  warranty_available?: boolean;
  warranty_duration?: string;
  
  // Store info
  store_name?: string;
  seller_rating?: string;
  ship_on_time?: string;
  chat_response_rate?: string;
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
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: 'Facebook' | 'Twitter' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'WhatsApp' | 'TikTok' | 'Pinterest' | 'GitHub' | 'Other';
  url: string;
}

