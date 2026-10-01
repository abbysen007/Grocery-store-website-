export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  weight: string;
  price: number;
  originalPrice: number;
  mrp?: number;
  discountPercentage: number;
  discount?: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  eta: string; // e.g. "8 mins"
  deliveryTime?: string;
  description: string;
  inStock: boolean;
  shelfLife?: string;
  keyFeatures?: string[];
  unit: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  bgColor?: string;
  subcategories: string[];
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
  eta: string;
  houseNo?: string;
  apartmentRoad?: string;
  landmark?: string;
  receiverName?: string;
  receiverPhone?: string;
  isDefault?: boolean;
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

export type PaymentType = 'upi' | 'card' | 'wallet' | 'netbanking' | 'cod';

export interface PaymentDetails {
  method: PaymentType;
  providerTitle: string;
  transactionId: string;
  paidAt: string;
  cardLast4?: string;
  upiVpa?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  itemTotal: number;
  handlingFee: number;
  deliveryFee: number;
  tip: number;
  grandTotal: number;
  address: UserAddress;
  status: 'placed' | 'packing' | 'on_the_way' | 'delivered';
  etaMinutes: number;
  placedTimestamp: number;
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

