import React, { useState } from 'react';
import { db } from '../services/db';
import { Product, CartItem, Sale } from '../types';
import { Search, ShoppingCart, Trash2, Plus, Minus, CheckCircle2, Printer } from 'lucide-react';

export function PDV() {
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [clients] = useState(() => db.getClients());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('Cliente Balcão');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'PIX' | 'DEBIT' | 'CREDIT' | 'STORE_CREDIT'>('PIX');
  const [amountPaid, setAmountPaid] = useState('');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert('Produto esgotado!');
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.product.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.product.id !== productId));

  const subtotal = cart.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);
  const changeDue = paymentMethod === 'CASH' ? Math.max(0, (parseFloat(amountPaid) || 0) - total) : 0;

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Carrinho vazio.');
    
    // Atualização transacional
    const updatedProducts = products.map(p => {
      const item = cart.find(c => c.product.id === p.id);
      return item ? { ...p, stock: p.stock - item.quantity } : p;
    });

    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.salePrice, costPrice: i.product.costPrice })),
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,
      clientName: selectedClient,
      operator: 'Administrador',
      status: 'COMPLETED'
    };

    db.saveProducts(updatedProducts);
    db.saveSales([newSale, ...db.getSales()]);
    db.logAction('Administrador', 'VENDA_PDV', `Venda ${newSale.id} de R$ ${total.toFixed(2)}`);
    
    setProducts(updatedProducts);
    setCompletedSale(newSale);
    setCart([]);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 animate-fadeIn\">
      <div className=\"lg:col-span-7 flex flex-col space-y-4\">
        <input 
          placeholder=\"Buscar produtos...\"
          className=\"w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500\"
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className=\"grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto\">
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} className=\"bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-emerald-500\">
              <h4 className=\"font-bold text-white\">{p.name}</h4>
              <p className=\"text-emerald-400\">{formatCurrency(p.salePrice)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className=\"lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6\">
        <h2 className=\"text-xl font-bold text-white mb-4\">Carrinho</h2>
        {cart.map(item => (
          <div key={item.product.id} className=\"flex justify-between items-center mb-2 text-white\">\n            <span>{item.quantity}x {item.product.name}</span>
            <span>{formatCurrency(item.product.salePrice * item.quantity)}</span>
            <button onClick={() => removeFromCart(item.product.id)} className=\"text-red-400\"><Trash2 size={16}/></button>
          </div>
        ))}
        <div className=\"mt-6 pt-4 border-t border-slate-800\">\n          <p className=\"text-white font-bold\">Total: {formatCurrency(total)}</p>
          <button onClick={handleCheckout} className=\"w-full mt-4 bg-emerald-600 p-3 rounded-lg text-white font-bold\">Finalizar</button>
        </div>
      </div>
    </div>
  );
}
