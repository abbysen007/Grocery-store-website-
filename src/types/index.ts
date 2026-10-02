export interface Product {
  id: string;
  name: string;
  title?: string; // Ergonomic alias for name
  category: string;
  subcategory?: string;
  weight: string;
  price: number;
  originalPrice: number;
  mrp?: number;
  discountPercentage: number;
  discount?: string;
  image: string;
  imageUrl?: string; // Ergonomic alias for image
  rating?: number;
  reviewsCount?: number;
  eta: string; // e.g. "8 mins"
  deliveryTime?: string;
  deliveryTimeMinutes?: number;
  description: string;
  inStock: boolean;
  shelfLife?: string;
  keyFeatures?: string[];
  unit: string;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'draft';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  itemsCount?: number;
  bgColor?: string;
  subcategories: string[];
  imageUrl?: string;
  displayOrder?: number;
  enabled?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  area: string;
  city: string;
  state?: string;
  pincode?: string;
  eta: string;
  houseNo?: string;
  apartmentRoad?: string;
  landmark?: string;
  receiverName?: string;
  name?: string; // Ergonomic alias for receiverName
  receiverPhone?: string;
  phone?: string;
  isDefault?: boolean;
  lat?: number;
  lng?: number;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  bgGradient: string;
  image: string;
  categoryFilter?: string;
}

export type PaymentType = 'upi' | 'card' | 'wallet' | 'netbanking' | 'cod' | 'UPI' | 'Card' | 'Cash on Delivery';

export interface PaymentDetails {
  method: PaymentType;
  providerTitle?: string;
  transactionId: string;
  paidAt?: string;
  status?: 'successful' | 'pending' | 'failed' | 'refunded' | 'completed';
  cardLast4?: string;
  upiVpa?: string;
}

export interface Order {
  id: string;
  date: string;
  createdAt?: string; // Ergonomic alias for date
  items: CartItem[];
  itemTotal: number;
  subtotal?: number; // Ergonomic alias for itemTotal
  handlingFee: number;
  deliveryFee: number;
  tip: number;
  grandTotal: number;
  total?: number; // Ergonomic alias for grandTotal
  address: UserAddress;
  status: 'placed' | 'packing' | 'on_the_way' | 'delivered' | 'cancelled';
  etaMinutes: number;
  placedTimestamp: number;
  deliveredAt?: string;
  paymentMethod?: string;
  deliveryNotes?: string[];
  paymentDetails?: PaymentDetails;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    rating: number;
    deliveriesCount?: number;
    photo?: string;
  };
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  tag?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  title: string;
  date: string;
  status: 'successful' | 'pending';
}

export interface UserWallet {
  balance: number;
  cashback: number;
  giftCards: number;
  transactions: WalletTransaction[];
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
}

