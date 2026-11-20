import React, { useState } from 'react';
import { db } from '../services/db';
import { Product } from '../types';
import { Package, Search, Plus, Edit3, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react';

export function ProductsModule() {
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('Informática');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [unit, setUnit] = useState('UN');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingProduct(null);
    setName('');
    setSku('SKU-' + Math.floor(100 + Math.random() * 900));
    setBarcode('789100' + Math.floor(1000000 + Math.random() * 9000000));
    setCategory('Informática');
    setCostPrice('');
    setSalePrice('');
    setStock('10');
    setMinStock('3');
    setUnit('UN');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setBarcode(p.barcode);
    setCategory(p.category);
    setCostPrice(p.costPrice.toString());
    setSalePrice(p.salePrice.toString());
    setStock(p.stock.toString());
    setMinStock(p.minStock.toString());
    setUnit(p.unit);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !costPrice || !salePrice) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const cost = parseFloat(costPrice) || 0;
    const sale = parseFloat(salePrice) || 0;
    const st = parseInt(stock) || 0;
    const mst = parseInt(minStock) || 0;

    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? {
        ...p,
        name,
        sku,
        barcode,
        category,
        costPrice: cost,
        salePrice: sale,
        stock: st,
        minStock: mst,
        unit
      } : p);
      db.saveProducts(updated);
      setProducts(updated);
      db.logAction('Ana Gerente', 'ATUALIZAR_PRODUTO', `Produto ${name} atualizado.`);
    } else {
      const newProduct: Product = {
        id: 'p_' + Math.random().toString(36).substr(2, 9),
        name,
        sku,
        barcode,
        category,
        costPrice: cost,
        salePrice: sale,
        stock: st,
        minStock: mst,
        unit
      };
      const updated = [newProduct, ...products];
      db.saveProducts(updated);
      setProducts(updated);
      db.logAction('Ana Gerente', 'CADASTRAR_PRODUTO', `Produto ${name} cadastrado com sucesso.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja realmente remover o produto ${name}?`)) {
      const updated = products.filter(p => p.id !== id);
      db.saveProducts(updated);
      setProducts(updated);
      db.logAction('Ana Gerente', 'EXCLUIR_PRODUTO', `Produto ${name} removido.`);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className=\"space-y-6 animate-fadeIn pb-12\">\n      <div className=\"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg\">\n        <div>\n          <h2 className=\"text-2xl font-black text-white tracking-tight flex items-center space-x-2\">\n            <Package className=\"w-7 h-7 text-emerald-400\" />\n            <span>Catálogo de Produtos & Estoque</span>\n          </h2>\n          <p className=\"text-slate-400 text-sm mt-1\">Gerencie preços, custos, margens e controle de inventário em tempo real.</p>\n        </div>\n        <button \n          onClick={handleOpenNew}\n          className=\"px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center space-x-2\"\n        >\n          <Plus className=\"w-4 h-4\" />\n          <span>Novo Produto</span>\n        </button>\n      </div>\n\n      <div className=\"bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg\">\n        <div className=\"relative\">\n          <Search className=\"absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400\" />\n          <input \n            type=\"text\" \n            placeholder=\"Pesquisar por nome, SKU ou categoria...\" \n            value={searchTerm}\n            onChange={e => setSearchTerm(e.target.value)}\n            className=\"w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors\"\n          />\n        </div>\n      </div>\n\n      <div className=\"bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl\">\n        <div className=\"overflow-x-auto\">\n          <table className=\"w-full text-left text-xs\">\n            <thead className=\"bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800\">\n              <tr>\n                <th className=\"px-6 py-4\">Produto / SKU</th>\n                <th className=\"px-6 py-4\">Categoria</th>\n                <th className=\"px-6 py-4 text-right\">Preço Custo</th>\n                <th className=\"px-6 py-4 text-right\">Preço Venda</th>\n                <th className=\"px-6 py-4 text-right\">Margem</th>\n                <th className=\"px-6 py-4 text-center\">Estoque</th>\n                <th className=\"px-6 py-4 text-right\">Ações</th>\n              </tr>\n            </thead>\n            <tbody className=\"divide-y divide-slate-800/80\">\n              {filteredProducts.map(product => {\n                const margin = product.salePrice > 0 ? ((product.salePrice - product.costPrice) / product.salePrice) * 100 : 0;\n                const isLow = product.stock <= product.minStock;\n                return (\n                  <tr key={product.id} className=\"hover:bg-slate-800/50 transition-colors\">\n                    <td className=\"px-6 py-4\">\n                      <div className=\"font-bold text-white text-sm\">{product.name}</div>\n                      <div className=\"text-slate-400 font-mono text-[11px]\">{product.sku} | Barcode: {product.barcode}</div>\n                    </td>\n                    <td className=\"px-6 py-4\">\n                      <span className=\"px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium\">\n                        {product.category}\n                      </span>\n                    </td>\n                    <td className=\"px-6 py-4 text-right text-slate-300 font-medium\">{formatCurrency(product.costPrice)}</td>\n                    <td className=\"px-6 py-4 text-right text-emerald-400 font-bold text-sm\">{formatCurrency(product.salePrice)}</td>\n                    <td className=\"px-6 py-4 text-right text-violet-400 font-semibold\">{margin.toFixed(1)}%</td>\n                    <td className=\"px-6 py-4 text-center\">\n                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 ${\n                        product.stock === 0 ? 'bg-red-500/10 text-red-400' : isLow ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'\n                      }`}>\n                        {isLow && <AlertTriangle className=\"w-3 h-3 mr-1\" />}\n                        <span>{product.stock} {product.unit}</span>\n                      </span>\n                    </td>\n                    <td className=\"px-6 py-4 text-right space-x-2\">\n                      <button \n                        onClick={() => handleOpenEdit(product)}\n                        className=\"p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors\"\n                        title=\"Editar\"\n                      >\n                        <Edit3 className=\"w-4 h-4\" />\n                      </button>\n                      <button \n                        onClick={() => handleDelete(product.id, product.name)}\n                        className=\"p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors\"\n                        title=\"Excluir\"\n                      >\n                        <Trash2 className=\"w-4 h-4\" />\n                      </button>\n                    </td>\n                  </tr>\n                );\n              })}\n            </tbody>\n          </table>\n        </div>\n      </div>\n\n      {/* Modal de Cadastro / Edição */}\n      {isModalOpen && (\n        <div className=\"fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4\">\n          <div className=\"bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scaleUp\">\n            <div className=\"flex items-center justify-between pb-4 border-b border-slate-800 mb-4\">\n              <h3 className=\"text-lg font-bold text-white\">\n                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}\n              </h3>\n              <button onClick={() => setIsModalOpen(false)} className=\"text-slate-400 hover:text-white\">\n                <X className=\"w-5 h-5\" />\n              </button>\n            </div>\n\n            <form onSubmit={handleSave} className=\"space-y-4 text-xs\">\n              <div>\n                <label className=\"block font-semibold text-slate-300 mb-1\">Nome do Produto</label>\n                <input \n                  type=\"text\" \n                  value={name} \n                  onChange={e => setName(e.target.value)} \n                  required\n                  className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                />\n              </div>\n\n              <div className=\"grid grid-cols-2 gap-3\">\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">SKU</label>\n                  <input \n                    type=\"text\" \n                    value={sku} \n                    onChange={e => setSku(e.target.value)} \n                    required\n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  />\n                </div>\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">Código de Barras</label>\n                  <input \n                    type=\"text\" \n                    value={barcode} \n                    onChange={e => setBarcode(e.target.value)} \n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"grid grid-cols-2 gap-3\">\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">Categoria</label>\n                  <select \n                    value={category} \n                    onChange={e => setCategory(e.target.value)}\n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  >\n                    <option value=\"Informática\">Informática</option>\n                    <option value=\"Periféricos\">Periféricos</option>\n                    <option value=\"Áudio\">Áudio</option>\n                    <option value=\"Armazenamento\">Armazenamento</option>\n                    <option value=\"Acessórios\">Acessórios</option>\n                  </select>\n                </div>\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">Unidade</label>\n                  <input \n                    type=\"text\" \n                    value={unit} \n                    onChange={e => setUnit(e.target.value)} \n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"grid grid-cols-2 gap-3\">\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">Preço de Custo (R$)</label>\n                  <input \n                    type=\"number\" \n                    step=\"0.01\"\n                    value={costPrice} \n                    onChange={e => setCostPrice(e.target.value)} \n                    required\n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  />\n                </div>\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">Preço de Venda (R$)</label>\n                  <input \n                    type=\"number\" \n                    step=\"0.01\"\n                    value={salePrice} \n                    onChange={e => setSalePrice(e.target.value)} \n                    required\n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"grid grid-cols-2 gap-3\">\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">Quantidade em Estoque</label>\n                  <input \n                    type=\"number\" \n                    value={stock} \n                    onChange={e => setStock(e.target.value)} \n                    required\n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  />\n                </div>\n                <div>\n                  <label className=\"block font-semibold text-slate-300 mb-1\">Estoque Mínimo</label>\n                  <input \n                    type=\"number\" \n                    value={minStock} \n                    onChange={e => setMinStock(e.target.value)} \n                    required\n                    className=\"w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"pt-4 border-t border-slate-800 flex justify-end space-x-3\">\n                <button \n                  type=\"button\"\n                  onClick={() => setIsModalOpen(false)}\n                  className=\"px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors\"\n                >\n                  Cancelar\n                </button>\n                <button \n                  type=\"submit\"\n                  className=\"px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors\"\n                >\n                  Salvar Produto\n                </button>\n              </div>\n            </form>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}\n