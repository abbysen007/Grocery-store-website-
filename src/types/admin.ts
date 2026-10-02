import { Product, Order, UserAddress, Coupon } from './index';

export type AdminRole = 'Super Admin' | 'Order Manager' | 'Inventory Manager' | 'Support Agent';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[]; // e.g. ['all'] or ['orders', 'customers']
  avatar?: string;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  category: string;
  sku: string;
  unit: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  adjustmentType: 'add' | 'remove' | 'correction' | 'damaged' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  adjustedBy: string;
  timestamp: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'suspended';
  suspensionReason?: string;
  addresses: UserAddress[];
  internalNotes: string[];
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'E-Bike' | 'Motorcycle' | 'Bicycle' | 'Scooter';
  vehicleNumber: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  availability: 'online' | 'busy' | 'offline';
  currentDeliveryStatus: 'idle' | 'assigned' | 'in_transit';
  completedDeliveries: number;
  rating: number;
  accountStatus: 'active' | 'suspended' | 'inactive';
  joinedDate: string;
  currentOrderId?: string;
  drivingLicenseNumber?: string;
  photo?: string;
}

export interface LiveDeliveryTrip {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  address: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  status: 'unassigned' | 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'failed';
  assignedTime?: string;
  pickupTime?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  failureReason?: string;
  distanceKm: number;
  lat: number;
  lng: number;
}

export interface AdminOffer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageCount: number;
  usageLimit?: number;
  status: 'active' | 'scheduled' | 'expired' | 'disabled';
  applicableCategories?: string[];
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  method: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  gatewayTxnId: string;
  status: 'successful' | 'pending' | 'failed' | 'refunded';
  refundAmount?: number;
  refundStatus?: 'none' | 'requested' | 'processing' | 'completed' | 'failed';
  refundReason?: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  orderId?: string;
  category: 'Order Delay' | 'Missing Item' | 'Quality Issue' | 'Payment & Refund' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  createdAt: string;
  assignedStaff?: string;
  messages: {
    id: string;
    sender: 'customer' | 'admin' | 'system';
    senderName: string;
    text: string;
    timestamp: string;
    isInternal?: boolean;
  }[];
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  recipientGroup: 'all_customers' | 'active_riders' | 'admin_staff' | 'single_customer';
  recipientTarget?: string;
  type: 'order_update' | 'promotional' | 'low_stock' | 'system_alert';
  channel: 'in_app' | 'sms' | 'push';
  sentAt: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed';
}

export interface ActivityLog {
  id: string;
  staffName: string;
  staffEmail: string;
  action: string;
  entityType: 'order' | 'product' | 'inventory' | 'customer' | 'rider' | 'offer' | 'settings' | 'auth';
  entityId: string;
  timestamp: string;
  details: string;
  result: 'success' | 'failure';
}

export interface StoreOperationalSettings {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  supportPhone: string;
  fssaiLicense: string;
  address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  geofenceRadiusKm: number;
  isStoreOnline: boolean;
  openingTime: string;
  closingTime: string;
  minOrderValue: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  platformHandlingFee: number;
  averagePreparationMinutes: number;
  estimatedDeliveryMinutes: number;
  acceptedPaymentMethods: {
    upi: boolean;
    cards: boolean;
    netbanking: boolean;
    cashOnDelivery: boolean;
  };
}

export interface WebsiteCustomizationSettings {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBadge: string;
  heroNotice: string;
  featuredCategoryIds: string[];
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  copyrightText: string;
}
