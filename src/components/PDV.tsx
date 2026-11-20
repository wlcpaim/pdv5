import React, { useState } from 'react';
import { db } from '../services/db';
import { Product, CartItem, Sale } from '../types';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign, CheckCircle2, User, Printer, AlertCircle } from 'lucide-react';

export function PDV() {
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [clients] = useState(() => db.getClients());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(clients[0]?.name || 'Cliente Balcão');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'PIX' | 'DEBIT' | 'CREDIT' | 'STORE_CREDIT'>('PIX');
  const [amountPaid, setAmountPaid] = useState('');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Filtrar produtos
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Produto esgotado em estoque!');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Quantidade máxima em estoque atingida.');
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.product.stock) {
          alert('Estoque insuficiente.');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);
  
  const cashPaidNum = parseFloat(amountPaid) || 0;
  const changeDue = paymentMethod === 'CASH' ? Math.max(0, cashPaidNum - total) : 0;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('O carrinho está vazio.');
      return;
    }

    if (paymentMethod === 'CASH' && cashPaidNum < total) {
      alert('Valor pago em dinheiro é inferior ao total da venda.');
      return;
    }

    // Atualizar estoque e persistir produtos
    const updatedProducts = [...products];
    cart.forEach(item => {
      const prod = updatedProducts.find(p => p.id === item.product.id);
      if (prod) {
        prod.stock -= item.quantity;
      }
    });
    db.saveProducts(updatedProducts);
    setProducts(updatedProducts);

    // Criar registro da venda
    const newSale: Sale = {
      id: 'SALE-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: cart.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.salePrice })),
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,
      clientName: selectedClient,
      operator: 'Ana Gerente',
      status: 'COMPLETED'
    };

    const sales = db.getSales();
    db.saveSales([newSale, ...sales]);

    // Registrar auditoria
    db.logAction('Ana Gerente', 'VENDA_PDV', `Venda ${newSale.id} realizada no valor de R$ ${total.toFixed(2)} via ${paymentMethod}`);

    setCompletedSale(newSale);
    setCart([]);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn pb-12">
      {/* Coluna Esquerda: Catálogo de Produtos e Busca */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, SKU ou código de barras..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[620px] overflow-y-auto pr-1">
          {filteredProducts.map(product => {
            const isLow = product.stock <= product.minStock;
            return (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className={`bg-slate-900/90 border rounded-2xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-lg relative group ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed border-red-500/30' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {product.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      product.stock === 0 ? 'bg-red-500/10 text-red-400' : isLow ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      Estoque: {product.stock} {product.unit}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{product.name}</h4>
                  <span className="text-xs text-slate-400">SKU: {product.sku}</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-lg font-black text-emerald-400">{formatCurrency(product.salePrice)}</span>
                  <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coluna Direita: Carrinho e Checkout */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[750px]">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Carrinho da Venda</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
              {cart.reduce((a, i) => a + i.quantity, 0)} itens
            </span>
          </div>

          {/* Seleção de Cliente */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Cliente da Venda</label>
            <select 
              value={selectedClient} 
              onChange={e => setSelectedClient(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Cliente Balcão">Consumidor / Cliente Balcão</option>
              {clients.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.status})</option>
              ))}
            </select>
          </div>

          {/* Lista de Itens no Carrinho */}
          <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 mb-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Carrinho vazio. Selecione produtos ao lado para iniciar a venda.
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <h5 className="text-xs font-bold text-white">{item.product.name}</h5>
                    <span className="text-xs text-emerald-400 font-semibold">{formatCurrency(item.product.salePrice)} un</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resumo e Pagamento */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Desconto (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={discountPercent} 
                onChange={e => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Forma de Pagamento</label>
              <select 
                value={paymentMethod} 
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="PIX">PIX Instantâneo</option>
                <option value="CASH">Dinheiro (Espécie)</option>
                <option value="CREDIT">Cartão de Crédito</option>
                <option value="DEBIT">Cartão de Débito</option>
                <option value="STORE_CREDIT">Crediário / Faturamento</option>
              </select>
            </div>
          </div>

          {paymentMethod === 'CASH' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Valor Recebido (R$)</label>
                <input 
                  type="number" 
                  value={amountPaid} 
                  onChange={e => setAmountPaid(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Troco</label>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold flex items-center">
                  {formatCurrency(changeDue)}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-xs pt-2">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Desconto ({discountPercent}%)</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
              <span>Total a Pagar</span>
              <span className="text-emerald-400 text-xl">{formatCurrency(total)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${
              cart.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Finalizar Venda & Emitir Recibo</span>
          </button>
        </div>
      </div>

      {/* Modal de Comprovante de Venda */}
      {completedSale && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleUp">
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Venda Realizada com Sucesso!</h3>
              <p className="text-xs text-slate-400">WLC.IA Enterprise PDV — Comprovante Fiscal Eletrônico</p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Transação ID:</span>
                <span className="font-mono text-white">{completedSale.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Data e Hora:</span>
                <span className="text-white">{completedSale.date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cliente:</span>
                <span className="text-white">{completedSale.clientName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Operador:</span>
                <span className="text-white">{completedSale.operator}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Forma de Pagamento:</span>
                <span className="text-emerald-400 font-semibold">{completedSale.paymentMethod}</span>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="font-bold text-slate-300 block mb-2">Itens da Venda:</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {completedSale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                <span>Total Pago:</span>
                <span className="text-emerald-400 text-base">{formatCurrency(completedSale.total)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex space-x-3">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>
              <button 
                onClick={() => setCompletedSale(null)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Nova Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
