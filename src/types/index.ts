export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'CASH' | 'PIX' | 'DEBIT' | 'CREDIT' | 'STORE_CREDIT';
  clientName: string;
  operator: string;
  status: 'COMPLETED' | 'CANCELLED';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalSpent: number;
  lastPurchase: string;
  status: 'VIP' | 'Regular' | 'Inativo';
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  document?: string;
  address?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'SALE' | 'RETURN';
  reason: string;
  date: string;
  user: string;
}

export interface FinancialRecord {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING';
  paymentMethod?: string;
}

export interface CashSession {
  id: string;
  isOpen: boolean;
  openedAt: string;
  closedAt?: string;
  operator: string;
  initialBalance: number;
  cashSales: number;
  pixSales: number;
  cardSales: number;
  withdrawals: number;
  supplies: number;
  expectedBalance: number;
  finalBalance?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}
