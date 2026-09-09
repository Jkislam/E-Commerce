import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'default-1',
    name: 'Royal Cotton Panjabi',
    price: 2450,
    rating: 4.9,
    category: 'Panjabi',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=75&w=600&fm=webp',
    description: 'Handcrafted premium Egyptian cotton Panjabi with intricate embroidery.',
    islatest: true,
    stock: 15
  },
  {
    id: 'default-2',
    name: 'Organic Royal Oudh Attar',
    price: 1250,
    rating: 5.0,
    category: 'Attar',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=75&w=600&fm=webp',
    description: 'Pure concentrated Oudh fragrance extracted from rare Assam agarwood.',
    islatest: true,
    stock: 20
  },
  {
    id: 'default-3',
    name: 'Classic White Linen Panjabi',
    price: 2890,
    rating: 4.8,
    category: 'Panjabi',
    image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=75&w=600&fm=webp',
    description: 'Breathable pure linen Panjabi designed for summer elegance and comfort.',
    islatest: false,
    stock: 12
  },
  {
    id: 'default-4',
    name: 'Premium Mukhallat Fragrance',
    price: 950,
    rating: 4.7,
    category: 'Attar',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=75&w=600&fm=webp',
    description: 'A rich blend of Rose, Amber, and Sandalwood for a lasting oriental scent.',
    islatest: false,
    stock: 25
  }
];
