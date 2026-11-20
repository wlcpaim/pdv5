import { Product, CartItem, Sale, Client, FinancialRecord, Supplier, StockMovement, CashSession, AuditLog } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Notebook Enterprise Core i7 16GB', sku: 'NTB-001', barcode: '7891000123451', category: 'Informática', costPrice: 3200.00, salePrice: 4890.00, stock: 12, minStock: 3, unit: 'UN' },
  { id: 'p2', name: 'Monitor Ultrawide 29" IPS 75Hz', sku: 'MON-002', barcode: '7891000123452', category: 'Informática', costPrice: 950.00, salePrice: 1450.00, stock: 8, minStock: 2, unit: 'UN' },
  { id: 'p3', name: 'Teclado Mecânico RGB Switch Brown', sku: 'TEC-003', barcode: '7891000123453', category: 'Periféricos', costPrice: 180.00, salePrice: 349.90, stock: 25, minStock: 5, unit: 'UN' },
  { id: 'p4', name: 'Mouse Ergonômico Wireless Vertical', sku: 'MOU-004', barcode: '7891000123454', category: 'Periféricos', costPrice: 90.00, salePrice: 189.90, stock: 4, minStock: 6, unit: 'UN' }, // Estoque abaixo do mínimo
  { id: 'p5', name: 'Headset Gamer 7.1 Surround Pro', sku: 'HED-005', barcode: '7891000123455', category: 'Áudio', costPrice: 210.00, salePrice: 399.00, stock: 15, minStock: 4, unit: 'UN' },
  { id: 'p6', name: 'SSD NVMe M.2 1TB High-Speed', sku: 'SSD-006', barcode: '7891000123456', category: 'Armazenamento', costPrice: 350.00, salePrice: 599.00, stock: 2, minStock: 5, unit: 'UN' } // Alerta de estoque baixo
];

const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Empresa Alpha Tech LTDA', phone: '(11) 98765-4321', email: 'contato@alphatech.com', totalSpent: 14670.00, lastPurchase: '2026-11-19', status: 'VIP' },
  { id: 'c2', name: 'Carlos Eduardo Silva', phone: '(11) 97123-4568', email: 'carlos.silva@gmail.com', totalSpent: 3840.00, lastPurchase: '2026-11-18', status: 'Regular' },
  { id: 'c3', name: 'Beatriz Souza Martins', phone: '(21) 99887-1122', email: 'bia.martins@outlook.com', totalSpent: 9250.00, lastPurchase: '2026-11-20', status: 'VIP' }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Tech Distribuidora Nacional S.A.', category: 'Informática', contact: 'Roberto Dias', phone: '(11) 3344-5566', email: 'vendas@techdist.com.br' },
  { id: 's2', name: 'Global Periféricos & Acessórios', category: 'Periféricos', contact: 'Fernanda Lima', phone: '(19) 3222-8899', email: 'comercial@globalperif.com' }
];

const INITIAL_FINANCIAL: FinancialRecord[] = [
  { id: 'f1', type: 'INCOME', category: 'Vendas PDV', description: 'Faturamento de Vendas do Dia', amount: 12450.00, date: '2026-11-20', status: 'PAID' },
  { id: 'f2', type: 'EXPENSE', category: 'Aluguel', description: 'Aluguel Sede Principal WLC.IA', amount: 4500.00, date: '2026-11-05', status: 'PAID' },
  { id: 'f3', type: 'EXPENSE', category: 'Servidores Cloud', description: 'AWS Enterprise & Database Cluster', amount: 1850.00, date: '2026-11-10', status: 'PAID' },
  { id: 'f4', type: 'EXPENSE', category: 'Fornecedores', description: 'Reposição Lote Notebooks', amount: 9600.00, date: '2026-11-15', status: 'PENDING' }
];

const INITIAL_SALES: Sale[] = [
  {
    id: 'SALE-1001',
    date: '2026-11-20 10:30',
    items: [{ productId: 'p1', name: 'Notebook Enterprise Core i7 16GB', quantity: 1, price: 4890.00 }],
    subtotal: 4890.00,
    discount: 0,
    total: 4890.00,
    paymentMethod: 'PIX',
    clientName: 'Empresa Alpha Tech LTDA',
    operator: 'Ana Gerente',
    status: 'COMPLETED'
  },
  {
    id: 'SALE-1002',
    date: '2026-11-20 11:15',
    items: [
      { productId: 'p3', name: 'Teclado Mecânico RGB Switch Brown', quantity: 2, price: 349.90 },
      { productId: 'p4', name: 'Mouse Ergonômico Wireless Vertical', quantity: 1, price: 189.90 }
    ],
    subtotal: 889.70,
    discount: 39.70,
    total: 850.00,
    paymentMethod: 'CREDIT',
    clientName: 'Carlos Eduardo Silva',
    operator: 'Carlos Operador',
    status: 'COMPLETED'
  }
];

const INITIAL_CASH_SESSION: CashSession = {
  isOpen: true,
  openedAt: '2026-11-20 08:00',
  operator: 'Ana Gerente',
  initialBalance: 1500.00,
  cashSales: 2450.00,
  pixSales: 4890.00,
  cardSales: 850.00,
  withdrawals: 200.00,
  supplies: 500.00,
  expectedBalance: 7090.00
};

export const db = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem('wlc_products');
    if (!data) {
      localStorage.setItem('wlc_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem('wlc_products', JSON.stringify(products));
  },

  getClients: (): Client[] => {
    const data = localStorage.getItem('wlc_clients');
    if (!data) {
      localStorage.setItem('wlc_clients', JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(data);
  },
  saveClients: (clients: Client[]) => {
    localStorage.setItem('wlc_clients', JSON.stringify(clients));
  },

  getSuppliers: (): Supplier[] => {
    const data = localStorage.getItem('wlc_suppliers');
    if (!data) {
      localStorage.setItem('wlc_suppliers', JSON.stringify(INITIAL_SUPPLIERS));
      return INITIAL_SUPPLIERS;
    }
    return JSON.parse(data);
  },
  saveSuppliers: (suppliers: Supplier[]) => {
    localStorage.setItem('wlc_suppliers', JSON.stringify(suppliers));
  },

  getFinancial: (): FinancialRecord[] => {
    const data = localStorage.getItem('wlc_financial');
    if (!data) {
      localStorage.setItem('wlc_financial', JSON.stringify(INITIAL_FINANCIAL));
      return INITIAL_FINANCIAL;
    }
    return JSON.parse(data);
  },
  saveFinancial: (records: FinancialRecord[]) => {
    localStorage.setItem('wlc_financial', JSON.stringify(records));
  },

  getSales: (): Sale[] => {
    const data = localStorage.getItem('wlc_sales');
    if (!data) {
      localStorage.setItem('wlc_sales', JSON.stringify(INITIAL_SALES));
      return INITIAL_SALES;
    }
    return JSON.parse(data);
  },
  saveSales: (sales: Sale[]) => {
    localStorage.setItem('wlc_sales', JSON.stringify(sales));
  },

  getCashSession: (): CashSession => {
    const data = localStorage.getItem('wlc_cash_session');
    if (!data) {
      localStorage.setItem('wlc_cash_session', JSON.stringify(INITIAL_CASH_SESSION));
      return INITIAL_CASH_SESSION;
    }
    return JSON.parse(data);
  },
  saveCashSession: (session: CashSession) => {
    localStorage.setItem('wlc_cash_session', JSON.stringify(session));
  },

  getAuditLogs: (): AuditLog[] => {
    const data = localStorage.getItem('wlc_audit');
    if (!data) {
      const initialLogs: AuditLog[] = [
        { id: 'a1', timestamp: '2026-11-20 08:00:12', user: 'Ana Gerente', action: 'ABERTURA_CAIXA', details: 'Caixa aberto com fundo de R$ 1.500,00' },
        { id: 'a2', timestamp: '2026-11-20 10:30:45', user: 'Ana Gerente', action: 'VENDA_CONCLUIDA', details: 'Venda SALE-1001 no valor de R$ 4.890,00 via PIX' }
      ];
      localStorage.setItem('wlc_audit', JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(data);
  },
  saveAuditLogs: (logs: AuditLog[]) => {
    localStorage.setItem('wlc_audit', JSON.stringify(logs));
  },

  logAction: (user: string, action: string, details: string) => {
    const logs = db.getAuditLogs();
    const newLog: AuditLog = {
      id: 'a_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      action,
      details
    };
    db.saveAuditLogs([newLog, ...logs]);
  },

  resetAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
