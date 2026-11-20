import { Sale, Product, FinancialRecord, SaleItem } from '../types';

export interface FinancialMetrics {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  totalExpenses: number;
  netProfit: number;
  netMargin: number;
  averageTicket: number;
  roi: number;
  inventoryValue: number;
  lowStockCount: number;
}

export function calculateFinancialMetrics(
  sales: Sale[],
  products: Product[],
  financialRecords: FinancialRecord[]
): FinancialMetrics {
  const completedSales = sales.filter(s => s.status === 'COMPLETED');
  
  const totalRevenue = completedSales.reduce((acc, s) => acc + s.total, 0);

  let totalCost = 0;
  completedSales.forEach(sale => {
    sale.items.forEach(item => {
      totalCost += item.costPrice * item.quantity;
    });
  });

  const grossProfit = totalRevenue - totalCost;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const totalExpenses = financialRecords
    .filter(f => f.type === 'EXPENSE' && f.status === 'PAID')
    .reduce((acc, f) => acc + f.amount, 0);

  const netProfit = grossProfit - totalExpenses;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const averageTicket = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;
  const totalInvestment = totalCost + totalExpenses;
  const roi = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0;

  const inventoryValue = products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  return { totalRevenue, totalCost, grossProfit, grossMargin, totalExpenses, netProfit, netMargin, averageTicket, roi, inventoryValue, lowStockCount };
}

export const validateSale = (items: SaleItem[], products: Product[]) => {
  const errors: string[] = [];
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) errors.push(`Produto não encontrado: ${item.productId}`);
    else if (product.stock < item.quantity) errors.push(`Estoque insuficiente: ${product.name}`);
  });
  return { isValid: errors.length === 0, errors };
};

export const calculateSaleTotals = (items: SaleItem[], discount: number) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  return { subtotal, total: Math.max(0, subtotal - discount) };
};
