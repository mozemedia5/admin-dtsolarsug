export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  whatsapp: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  isMain: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  branchId?: string;
}

export type ProductCategory = 
  | 'solar-kits'
  | 'batteries-inverters'
  | 'cctv-cameras'
  | 'water-pumps'
  | 'home-electronics';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  productId?: string;
  branchId?: string;
  verified: boolean;
}

export interface PreOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  branchId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerLocation: string;
  status: 'pending' | 'ready' | 'completed' | 'cancelled';
  date: string;
  notes?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  validUntil: string;
  code?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
  agentName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent' | 'user';
  branchId?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}
