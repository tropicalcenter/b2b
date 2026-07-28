export interface PurchaseHistoryItem {
  amount: number;
  date: string;
  pointsEarned: number;
  invoiceNumber: string;
  operator: string;
  details?: string;
}

export interface RedemptionHistoryItem {
  pointsRedeemed: number;
  date: string;
  description: string;
  authorizedBy: string;
  status: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  phone?: string;
  companyName: string;
  cnpj: string;
  registrationDate: string;
  avatar: string;
  totalPurchases: number;
  pointsRedeemed: number;
  isAdmin?: boolean;
  lastPurchase?: PurchaseHistoryItem | null;
  purchaseHistory: PurchaseHistoryItem[];
  redemptionHistory: RedemptionHistoryItem[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  highlight: boolean;
}

export interface TripDestination {
  id: string;
  name: string;
  subtitle: string;
  target: number;
  desc: string;
  duration: string;
  badge: string;
  colorTheme: string;
  textTheme: string;
  borderTheme: string;
  image: string;
}
