import { PRODUCTS, CATEGORIES, MOCK_COUPONS } from '../data/mockData';
import { Product, Order, Category } from '../types';
import { 
  AdminUser, 
  InventoryItem, 
  StockAdjustment, 
  AdminCustomer, 
  DeliveryPartner, 
  LiveDeliveryTrip, 
  AdminOffer, 
  PaymentTransaction, 
  SupportTicket, 
  AdminNotification, 
  ActivityLog, 
  StoreOperationalSettings, 
  WebsiteCustomizationSettings 
} from '../types/admin';

// LocalStorage Keys
const KEYS = {
  ADMIN_USER: 'freshit_current_admin',
  STAFF: 'freshit_staff_list',
  PRODUCTS: 'freshit_products',
  CATEGORIES: 'freshit_categories',
  INVENTORY: 'freshit_inventory',
  STOCK_ADJUSTMENTS: 'freshit_stock_adjustments',
  ORDERS: 'freshit_orders',
  CUSTOMERS: 'freshit_admin_customers',
  RIDERS: 'freshit_riders',
  OFFERS: 'freshit_offers',
  PAYMENTS: 'freshit_payments',
  TICKETS: 'freshit_tickets',
  NOTIFICATIONS: 'freshit_notifications',
  LOGS: 'freshit_activity_logs',
  STORE_SETTINGS: 'freshit_store_settings',
  WEBSITE_SETTINGS: 'freshit_website_settings',
};

// Default Staff
export const DEFAULT_STAFF: AdminUser[] = [
  {
    id: 'staff-01',
    name: 'Subhankar Sen',
    email: 'admin@freshit.in',
    role: 'Super Admin',
    phone: '+91 98301 23456',
    status: 'active',
    lastLogin: 'Today, 05:45 AM',
    permissions: ['all'],
  },
  {
    id: 'staff-02',
    name: 'Anirban Das',
    email: 'orders@freshit.in',
    role: 'Order Manager',
    phone: '+91 98312 88765',
    status: 'active',
    lastLogin: 'Yesterday, 08:30 PM',
    permissions: ['dashboard', 'orders', 'delivery', 'delivery_management', 'customers', 'support'],
  },
  {
    id: 'staff-03',
    name: 'Priyanka Ghosh',
    email: 'inventory@freshit.in',
    role: 'Inventory Manager',
    phone: '+91 94330 45678',
    status: 'active',
    lastLogin: 'Today, 04:15 AM',
    permissions: ['dashboard', 'products', 'categories', 'inventory', 'reports'],
  },
  {
    id: 'staff-04',
    name: 'Rohan Mondal',
    email: 'support@freshit.in',
    role: 'Support Agent',
    phone: '+91 82400 11223',
    status: 'active',
    lastLogin: '2 days ago',
    permissions: ['dashboard', 'customers', 'support', 'orders'],
  },
];

// Default Store Operational Settings
export const DEFAULT_STORE_SETTINGS: StoreOperationalSettings = {
  storeName: 'Freshit Dark Store Hub',
  tagline: "India's 8-Minute Fresh Kirana & Essentials",
  phone: '+91 89100 98765',
  email: 'contact@freshit.in',
  supportPhone: '+91 1800 200 4455',
  fssaiLicense: '12824013000492',
  address: 'Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, West Bengal',
  pincode: '712513',
  latitude: 22.993125,
  longitude: 88.385500,
  geofenceRadiusKm: 25,
  isStoreOnline: true,
  openingTime: '06:00',
  closingTime: '23:30',
  minOrderValue: 49,
  deliveryFee: 25,
  freeDeliveryThreshold: 149,
  platformHandlingFee: 4,
  averagePreparationMinutes: 4,
  estimatedDeliveryMinutes: 8,
  acceptedPaymentMethods: {
    upi: true,
    cards: true,
    netbanking: true,
    cashOnDelivery: true,
  },
};

// Default Website Customization Settings
export const DEFAULT_WEBSITE_SETTINGS: WebsiteCustomizationSettings = {
  bannerTitle: 'Pure Freshness in 8 Minutes',
  bannerSubtitle: 'Sourced from Hooghly farm collectives straight to your doorstep',
  bannerBadge: 'Hyper-Local Chandrahati Hub',
  heroNotice: '⚡ 8-Minute Instant Delivery across Chandrahati, Naya Sarai & Raghunathpur',
  featuredCategoryIds: ['veg-fruits', 'dairy-bread', 'snacks-drinks', 'atta-rice-dal'],
  contactEmail: 'care@freshit.in',
  contactPhone: '+91 89100 98765',
  whatsappNumber: '+91 89100 98765',
  seoMetaTitle: 'Freshit — Instant Groceries & Essentials in 8 Minutes',
  seoMetaDescription: 'Hyper-local instant grocery delivery in Chandrahati Bazar, Naya Sarai, Raghunathpur within 25 km radius.',
  copyrightText: '© 2026 Freshit Technologies Pvt. Ltd. Crafted with care by Convergix.',
};

// Default Delivery Partners (Riders)
export const DEFAULT_RIDERS: DeliveryPartner[] = [
  {
    id: 'rider-01',
    name: 'Ramesh Ghosh',
    phone: '+91 98321 00112',
    email: 'ramesh.g@freshit.in',
    vehicleType: 'E-Bike',
    vehicleNumber: 'WB-16-EK-4021',
    verificationStatus: 'verified',
    availability: 'online',
    currentDeliveryStatus: 'idle',
    completedDeliveries: 428,
    rating: 4.9,
    accountStatus: 'active',
    joinedDate: '12 Jan 2026',
    drivingLicenseNumber: 'WB162022003941',
  },
  {
    id: 'rider-02',
    name: 'Subhasish Das',
    phone: '+91 97482 33441',
    email: 'subhasish.d@freshit.in',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'WB-16-BZ-9082',
    verificationStatus: 'verified',
    availability: 'busy',
    currentDeliveryStatus: 'in_transit',
    completedDeliveries: 312,
    rating: 4.8,
    accountStatus: 'active',
    joinedDate: '28 Jan 2026',
    drivingLicenseNumber: 'WB162021008821',
  },
  {
    id: 'rider-03',
    name: 'Amit Karmakar',
    phone: '+91 98745 66778',
    email: 'amit.k@freshit.in',
    vehicleType: 'E-Bike',
    vehicleNumber: 'WB-16-EK-7734',
    verificationStatus: 'verified',
    availability: 'online',
    currentDeliveryStatus: 'idle',
    completedDeliveries: 189,
    rating: 4.7,
    accountStatus: 'active',
    joinedDate: '14 Feb 2026',
    drivingLicenseNumber: 'WB162023001209',
  },
  {
    id: 'rider-04',
    name: 'Bikram Roy',
    phone: '+91 89100 22334',
    email: 'bikram.r@freshit.in',
    vehicleType: 'Scooter',
    vehicleNumber: 'WB-16-AM-5510',
    verificationStatus: 'verified',
    availability: 'offline',
    currentDeliveryStatus: 'idle',
    completedDeliveries: 94,
    rating: 4.6,
    accountStatus: 'active',
    joinedDate: '01 Mar 2026',
    drivingLicenseNumber: 'WB162024009112',
  },
];

// Helper to safe load from localStorage
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Helper to safe save
function save<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('freshit_admin_sync', { detail: { key } }));
  } catch (err) {
    console.warn('Failed to save to localStorage:', key, err);
  }
}

export class AdminDataService {
  // Staff & Current Admin
  static getStaff(): AdminUser[] {
    return load<AdminUser[]>(KEYS.STAFF, DEFAULT_STAFF);
  }

  static saveStaff(staff: AdminUser[]) {
    save(KEYS.STAFF, staff);
  }

  static getCurrentUser(): AdminUser {
    return load<AdminUser>(KEYS.ADMIN_USER, DEFAULT_STAFF[0]);
  }

  static setCurrentUser(user: AdminUser) {
    save(KEYS.ADMIN_USER, user);
  }

  // Store & Website Settings
  static getStoreSettings(): StoreOperationalSettings {
    return load<StoreOperationalSettings>(KEYS.STORE_SETTINGS, DEFAULT_STORE_SETTINGS);
  }

  static saveStoreSettings(settings: StoreOperationalSettings) {
    save(KEYS.STORE_SETTINGS, settings);
    // Broadcast for store distance calculations
    try {
      localStorage.setItem('freshit_store_online', JSON.stringify(settings.isStoreOnline));
    } catch {}
  }

  static getWebsiteSettings(): WebsiteCustomizationSettings {
    return load<WebsiteCustomizationSettings>(KEYS.WEBSITE_SETTINGS, DEFAULT_WEBSITE_SETTINGS);
  }

  static saveWebsiteSettings(settings: WebsiteCustomizationSettings) {
    save(KEYS.WEBSITE_SETTINGS, settings);
  }

  // Products
  static getProducts(): Product[] {
    return load<Product[]>(KEYS.PRODUCTS, PRODUCTS);
  }

  static saveProducts(products: Product[]) {
    save(KEYS.PRODUCTS, products);
  }

  // Categories
  static getCategories(): (Category & { displayOrder: number; enabled: boolean })[] {
    const rawCats = load<Category[]>(KEYS.CATEGORIES, CATEGORIES);
    return rawCats.map((c, idx) => ({
      ...c,
      displayOrder: (c as any).displayOrder ?? idx + 1,
      enabled: (c as any).enabled ?? true,
    }));
  }

  static saveCategories(categories: (Category & { displayOrder: number; enabled: boolean })[]) {
    save(KEYS.CATEGORIES, categories);
  }

  // Inventory
  static getInventory(): InventoryItem[] {
    const products = this.getProducts();
    const stored = load<InventoryItem[]>(KEYS.INVENTORY, []);
    if (stored.length > 0) return stored;

    // Generate initial inventory from products
    const initial: InventoryItem[] = products.map((p, idx) => {
      const stock = p.inStock ? 25 + (idx % 30) : 0;
      const threshold = 10;
      let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
      if (stock === 0) status = 'out_of_stock';
      else if (stock <= threshold) status = 'low_stock';

      return {
        productId: p.id,
        productName: p.name || p.title || 'Grocery Item',
        category: p.category,
        sku: `FSH-${p.id.toUpperCase()}`,
        unit: p.weight,
        currentStock: stock,
        reservedStock: 2,
        availableStock: Math.max(0, stock - 2),
        lowStockThreshold: threshold,
        status,
        lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      };
    });
    save(KEYS.INVENTORY, initial);
    return initial;
  }

  static saveInventory(items: InventoryItem[]) {
    save(KEYS.INVENTORY, items);
  }

  static getStockAdjustments(): StockAdjustment[] {
    return load<StockAdjustment[]>(KEYS.STOCK_ADJUSTMENTS, [
      {
        id: 'adj-01',
        productId: 'veg-01',
        productName: 'Fresh Farm Spinach (Palak)',
        adjustmentType: 'add',
        quantity: 20,
        previousStock: 15,
        newStock: 35,
        reason: 'Morning Farm Harvest Delivery batch #HOO-918',
        adjustedBy: 'Priyanka Ghosh (Inventory)',
        timestamp: 'Today, 06:15 AM',
      },
      {
        id: 'adj-02',
        productId: 'veg-02',
        productName: 'Red Country Tomatoes (Desi)',
        adjustmentType: 'damaged',
        quantity: -3,
        previousStock: 28,
        newStock: 25,
        reason: 'Transit crush damage discarded during quality check',
        adjustedBy: 'Priyanka Ghosh (Inventory)',
        timestamp: 'Yesterday, 04:30 PM',
      },
    ]);
  }

  static addStockAdjustment(adj: Omit<StockAdjustment, 'id' | 'timestamp'>) {
    const adjustments = this.getStockAdjustments();
    const newAdj: StockAdjustment = {
      ...adj,
      id: `adj-${Date.now()}`,
      timestamp: 'Just now',
    };
    save(KEYS.STOCK_ADJUSTMENTS, [newAdj, ...adjustments]);
  }

  // Orders
  static getOrders(): Order[] {
    const stored = load<Order[]>(KEYS.ORDERS, []);
    if (stored.length > 0) return stored;

    // Seed realistic local orders
    const seedOrders: Order[] = [
      {
        id: 'FSH-ORD-9021',
        date: '05:32 AM',
        items: [
          { product: PRODUCTS[0], quantity: 2 },
          { product: PRODUCTS[1], quantity: 1 },
          { product: PRODUCTS[6], quantity: 1 },
        ],
        itemTotal: 185,
        subtotal: 185,
        handlingFee: 4,
        deliveryFee: 0,
        tip: 10,
        grandTotal: 195,
        address: {
          id: 'addr-01',
          label: 'Home',
          address: 'Holding No. 42, Ward 3, Near Chandrahati Post Office',
          area: 'Chandrahati Bazar',
          city: 'Raghunathpur',
          eta: '8 mins',
          state: 'West Bengal',
          pincode: '712513',
          lat: 22.993125,
          lng: 88.385500,
          isDefault: true,
        },
        status: 'on_the_way',
        etaMinutes: 4,
        placedTimestamp: Date.now() - 6 * 60 * 1000,
        paymentDetails: {
          method: 'UPI',
          transactionId: 'UPI-7782103982',
          status: 'successful',
        },
        deliveryPartner: {
          name: 'Subhasish Das',
          phone: '+91 97482 33441',
          vehicleNumber: 'WB-16-BZ-9082',
          rating: 4.8,
        },
      },
      {
        id: 'FSH-ORD-9022',
        date: '05:28 AM',
        items: [
          { product: PRODUCTS[2], quantity: 1 },
          { product: PRODUCTS[7], quantity: 2 },
        ],
        itemTotal: 142,
        subtotal: 142,
        handlingFee: 4,
        deliveryFee: 25,
        tip: 0,
        grandTotal: 167,
        address: {
          id: 'addr-02',
          label: 'Other',
          address: 'Flat 2B, Green Valley Apts, Station Road',
          area: 'Naya Sarai',
          city: 'Raghunathpur',
          eta: '7 mins',
          state: 'West Bengal',
          pincode: '712513',
          lat: 22.9942,
          lng: 88.3871,
        },
        status: 'packing',
        etaMinutes: 7,
        placedTimestamp: Date.now() - 3 * 60 * 1000,
        paymentDetails: {
          method: 'Cash on Delivery',
          transactionId: 'COD-9022',
          status: 'successful',
        },
      },
      {
        id: 'FSH-ORD-9019',
        date: '04:35 AM',
        items: [
          { product: PRODUCTS[4], quantity: 2 },
          { product: PRODUCTS[9], quantity: 1 },
          { product: PRODUCTS[11], quantity: 1 },
        ],
        itemTotal: 310,
        subtotal: 310,
        handlingFee: 4,
        deliveryFee: 0,
        tip: 20,
        grandTotal: 330,
        address: {
          id: 'addr-03',
          label: 'Home',
          address: 'House 14, Ghosh Para, Magra Main Road',
          area: 'Magra Bazar',
          city: 'Raghunathpur',
          eta: '6 mins',
          state: 'West Bengal',
          pincode: '712513',
          lat: 22.9912,
          lng: 88.384,
        },
        status: 'delivered',
        etaMinutes: 0,
        placedTimestamp: Date.now() - 55 * 60 * 1000,
        paymentDetails: {
          method: 'UPI',
          transactionId: 'UPI-9921029112',
          status: 'successful',
        },
        deliveryPartner: {
          name: 'Ramesh Ghosh',
          phone: '+91 98321 00112',
          vehicleNumber: 'WB-16-EK-4021',
          rating: 4.9,
        },
      },
      {
        id: 'FSH-ORD-9018',
        date: 'Yesterday',
        items: [{ product: PRODUCTS[3], quantity: 1 }],
        itemTotal: 65,
        subtotal: 65,
        handlingFee: 4,
        deliveryFee: 25,
        tip: 0,
        grandTotal: 90,
        address: {
          id: 'addr-04',
          label: 'Other',
          address: 'Kalyani Cross Road, Raghunathpur',
          area: 'Raghunathpur More',
          city: 'Raghunathpur',
          eta: '9 mins',
          state: 'West Bengal',
          pincode: '712513',
          lat: 22.995,
          lng: 88.389,
        },
        status: 'cancelled',
        etaMinutes: 0,
        placedTimestamp: Date.now() - 120 * 60 * 1000,
        paymentDetails: {
          method: 'UPI',
          transactionId: 'UPI-3310029101',
          status: 'refunded',
        },
      },
    ];

    save(KEYS.ORDERS, seedOrders);
    return seedOrders;
  }

  static saveOrders(orders: Order[]) {
    save(KEYS.ORDERS, orders);
  }

  // Delivery Partners
  static getRiders(): DeliveryPartner[] {
    return load<DeliveryPartner[]>(KEYS.RIDERS, DEFAULT_RIDERS);
  }

  static saveRiders(riders: DeliveryPartner[]) {
    save(KEYS.RIDERS, riders);
  }

  // Customers
  static getCustomers(): AdminCustomer[] {
    const stored = load<AdminCustomer[]>(KEYS.CUSTOMERS, []);
    if (stored.length > 0) return stored;

    const initial: AdminCustomer[] = [
      {
        id: 'cust-01',
        name: 'Abhirup Sen',
        phone: '+91 98300 12345',
        email: 'abhirup.sen@gmail.com',
        registrationDate: '10 Jan 2026',
        totalOrders: 14,
        totalSpent: 4890,
        lastOrderDate: 'Today, 05:12 AM',
        status: 'active',
        addresses: [
          {
            id: 'addr-c1',
            label: 'Home',
            address: 'Holding No. 42, Kuntighat - Magra Rd, Naya Sarai',
            area: 'Chandrahati Bazar',
            city: 'Raghunathpur',
            eta: '8 mins',
            state: 'West Bengal',
            pincode: '712513',
            lat: 22.993125,
            lng: 88.3855,
            isDefault: true,
          },
        ],
        internalNotes: ['Preferred doorstep drop: ringing doorbell once', 'Frequent organic dairy buyer'],
      },
      {
        id: 'cust-02',
        name: 'Mouparna Chakraborty',
        phone: '+91 94331 99882',
        email: 'mouparna.c@outlook.com',
        registrationDate: '18 Jan 2026',
        totalOrders: 9,
        totalSpent: 2650,
        lastOrderDate: 'Yesterday, 07:30 PM',
        status: 'active',
        addresses: [
          {
            id: 'addr-c2',
            label: 'Home',
            address: 'Shanti Villa, Station Road',
            area: 'Naya Sarai',
            city: 'Raghunathpur',
            eta: '8 mins',
            state: 'West Bengal',
            pincode: '712513',
            lat: 22.9942,
            lng: 88.3871,
          },
        ],
        internalNotes: ['Verified phone number'],
      },
      {
        id: 'cust-03',
        name: 'Debjit Mukherjee',
        phone: '+91 82401 55667',
        email: 'debjit.m@gmail.com',
        registrationDate: '02 Feb 2026',
        totalOrders: 6,
        totalSpent: 1820,
        lastOrderDate: '28 Sep 2026',
        status: 'active',
        addresses: [
          {
            id: 'addr-c3',
            label: 'Work',
            address: 'Block B, Commercial Complex',
            area: 'Magra Bazar',
            city: 'Raghunathpur',
            eta: '6 mins',
            state: 'West Bengal',
            pincode: '712513',
            lat: 22.9912,
            lng: 88.384,
          },
        ],
        internalNotes: [],
      },
    ];

    save(KEYS.CUSTOMERS, initial);
    return initial;
  }

  static saveCustomers(customers: AdminCustomer[]) {
    save(KEYS.CUSTOMERS, customers);
  }

  // Offers & Discounts
  static getOffers(): AdminOffer[] {
    const stored = load<AdminOffer[]>(KEYS.OFFERS, []);
    if (stored.length > 0) return stored;

    const initial: AdminOffer[] = [
      {
        id: 'off-01',
        code: 'FRESHIT50',
        title: 'Flat ₹50 Off On Kirana Essentials',
        description: 'Save ₹50 on any grocery order above ₹249',
        discountType: 'flat',
        discountValue: 50,
        minOrderValue: 249,
        startDate: '2026-01-01',
        expiryDate: '2026-12-31',
        usageCount: 342,
        status: 'active',
      },
      {
        id: 'off-02',
        code: 'WELCOME100',
        title: 'New Customer Welcome Deal',
        description: 'Flat ₹100 instant discount on orders above ₹399',
        discountType: 'flat',
        discountValue: 100,
        minOrderValue: 399,
        startDate: '2026-01-01',
        expiryDate: '2026-12-31',
        usageCount: 188,
        status: 'active',
      },
      {
        id: 'off-03',
        code: 'CHANDRAHATI20',
        title: 'Local Neighborhood 20% Off',
        description: 'Get 20% off up to ₹60 on farm fresh vegetables',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 199,
        maxDiscount: 60,
        startDate: '2026-02-01',
        expiryDate: '2026-11-30',
        usageCount: 94,
        status: 'active',
        applicableCategories: ['Vegetables & Fruits'],
      },
    ];

    save(KEYS.OFFERS, initial);
    return initial;
  }

  static saveOffers(offers: AdminOffer[]) {
    save(KEYS.OFFERS, offers);
  }

  // Payments & Refunds
  static getPayments(): PaymentTransaction[] {
    const stored = load<PaymentTransaction[]>(KEYS.PAYMENTS, []);
    if (stored.length > 0) return stored;

    const initial: PaymentTransaction[] = [
      {
        id: 'txn-991',
        orderId: 'FSH-ORD-9021',
        customerName: 'Abhirup Sen',
        customerPhone: '+91 98300 12345',
        amount: 195,
        method: 'UPI',
        gatewayTxnId: 'pay_HooGhl782103',
        status: 'successful',
        timestamp: 'Today, 05:32 AM',
      },
      {
        id: 'txn-990',
        orderId: 'FSH-ORD-9022',
        customerName: 'Mouparna Chakraborty',
        customerPhone: '+91 94331 99882',
        amount: 167,
        method: 'Cash on Delivery',
        gatewayTxnId: 'COD-VERIFIED-9022',
        status: 'successful',
        timestamp: 'Today, 05:28 AM',
      },
      {
        id: 'txn-989',
        orderId: 'FSH-ORD-9019',
        customerName: 'Debjit Mukherjee',
        customerPhone: '+91 82401 55667',
        amount: 330,
        method: 'UPI',
        gatewayTxnId: 'pay_HooGhl992102',
        status: 'successful',
        timestamp: 'Today, 04:35 AM',
      },
      {
        id: 'txn-988',
        orderId: 'FSH-ORD-9018',
        customerName: 'Abhirup Sen',
        customerPhone: '+91 98300 12345',
        amount: 90,
        method: 'UPI',
        gatewayTxnId: 'pay_HooGhl331002',
        status: 'refunded',
        refundAmount: 90,
        refundStatus: 'completed',
        refundReason: 'Customer initiated pre-dispatch cancellation',
        timestamp: 'Yesterday, 09:12 PM',
      },
    ];

    save(KEYS.PAYMENTS, initial);
    return initial;
  }

  static savePayments(txns: PaymentTransaction[]) {
    save(KEYS.PAYMENTS, txns);
  }

  // Support Tickets
  static getTickets(): SupportTicket[] {
    const stored = load<SupportTicket[]>(KEYS.TICKETS, []);
    if (stored.length > 0) return stored;

    const initial: SupportTicket[] = [
      {
        id: 'tkt-01',
        ticketNumber: 'SUP-4102',
        customerName: 'Mouparna Chakraborty',
        customerPhone: '+91 94331 99882',
        orderId: 'FSH-ORD-9022',
        category: 'Order Delay',
        priority: 'medium',
        status: 'in_progress',
        subject: 'Estimated 8-minute delivery check',
        createdAt: 'Today, 05:35 AM',
        assignedStaff: 'Rohan Mondal',
        messages: [
          {
            id: 'm-01',
            sender: 'customer',
            senderName: 'Mouparna Chakraborty',
            text: 'Hello, checking if my milk and bread order is out for delivery?',
            timestamp: '05:35 AM',
          },
          {
            id: 'm-02',
            sender: 'admin',
            senderName: 'Rohan Mondal (Support)',
            text: 'Good morning Mouparna ji! Your order is packed and rider Subhasish has picked it up. He is 3 minutes away.',
            timestamp: '05:37 AM',
          },
        ],
      },
      {
        id: 'tkt-02',
        ticketNumber: 'SUP-4098',
        customerName: 'Debjit Mukherjee',
        customerPhone: '+91 82401 55667',
        category: 'Missing Item',
        priority: 'high',
        status: 'resolved',
        subject: '1 Packet Coriander replacement',
        createdAt: 'Yesterday, 06:10 PM',
        assignedStaff: 'Rohan Mondal',
        messages: [
          {
            id: 'm-03',
            sender: 'customer',
            senderName: 'Debjit Mukherjee',
            text: 'I ordered fresh coriander but received mint leaves by mistake.',
            timestamp: 'Yesterday, 06:10 PM',
          },
          {
            id: 'm-04',
            sender: 'admin',
            senderName: 'Rohan Mondal (Support)',
            text: 'We apologize sincerely! We dispatched a complimentary bundle of fresh coriander right away via rider Ramesh.',
            timestamp: 'Yesterday, 06:15 PM',
          },
        ],
      },
    ];

    save(KEYS.TICKETS, initial);
    return initial;
  }

  static saveTickets(tickets: SupportTicket[]) {
    save(KEYS.TICKETS, tickets);
  }

  // Notifications
  static getNotifications(): AdminNotification[] {
    const stored = load<AdminNotification[]>(KEYS.NOTIFICATIONS, []);
    if (stored.length > 0) return stored;

    const initial: AdminNotification[] = [
      {
        id: 'notif-01',
        title: 'Morning Harvest Arrival',
        message: 'Farm fresh palak, desi tomatoes and sweet corn just stocked at Chandrahati Hub.',
        recipientGroup: 'all_customers',
        type: 'promotional',
        channel: 'in_app',
        sentAt: 'Today, 06:00 AM',
        deliveryStatus: 'delivered',
      },
      {
        id: 'notif-02',
        title: 'Low Stock Alert: Organic Cow Milk 1L',
        message: 'Stock level reached 4 pouches. Automated reorder triggered with Hooghly Dairy Co-op.',
        recipientGroup: 'admin_staff',
        type: 'low_stock',
        channel: 'in_app',
        sentAt: 'Today, 05:15 AM',
        deliveryStatus: 'delivered',
      },
    ];

    save(KEYS.NOTIFICATIONS, initial);
    return initial;
  }

  static saveNotifications(notifs: AdminNotification[]) {
    save(KEYS.NOTIFICATIONS, notifs);
  }

  // Activity Logs
  static getLogs(): ActivityLog[] {
    const stored = load<ActivityLog[]>(KEYS.LOGS, []);
    if (stored.length > 0) return stored;

    const initial: ActivityLog[] = [
      {
        id: 'log-01',
        staffName: 'Subhankar Sen',
        staffEmail: 'admin@freshit.in',
        action: 'Store Timing Configured',
        entityType: 'settings',
        entityId: 'store-settings',
        timestamp: 'Today, 05:40 AM',
        details: 'Updated operational hours: 06:00 AM - 11:30 PM (Daily)',
        result: 'success',
      },
      {
        id: 'log-02',
        staffName: 'Anirban Das',
        staffEmail: 'orders@freshit.in',
        action: 'Rider Assigned to Order',
        entityType: 'order',
        entityId: 'FSH-ORD-9021',
        timestamp: 'Today, 05:33 AM',
        details: 'Assigned verified partner Subhasish Das (WB-16-BZ-9082)',
        result: 'success',
      },
      {
        id: 'log-03',
        staffName: 'Priyanka Ghosh',
        staffEmail: 'inventory@freshit.in',
        action: 'Stock Adjustment Recorded',
        entityType: 'inventory',
        entityId: 'veg-01',
        timestamp: 'Today, 06:15 AM',
        details: 'Added +20 units Palak from farm harvest batch #HOO-918',
        result: 'success',
      },
    ];

    save(KEYS.LOGS, initial);
    return initial;
  }

  static logAction(action: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      ...action,
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
    };
    save(KEYS.LOGS, [newLog, ...logs]);
  }

  static logActivity(
    action: string,
    entityId: string,
    details: string,
    entityType: ActivityLog['entityType'] = 'order',
    result: 'success' | 'failure' = 'success'
  ) {
    this.logAction({
      staffName: 'System / Fleet',
      staffEmail: 'system@freshit.in',
      action,
      entityType,
      entityId,
      details,
      result,
    });
  }
}
