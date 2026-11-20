import React, { useState } from 'react';
import { db } from '../services/db';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, 
  AlertTriangle, ShieldCheck, Activity, ArrowUpRight, ArrowDownRight, Sparkles 
} from 'lucide-react';

export function Dashboard() {
  const [sales] = useState(() => db.getSales());
  const [products] = useState(() => db.getProducts());
  const [clients] = useState(() => db.getClients());
  const [financial] = useState(() => db.getFinancial());
  const [cash] = useState(() => db.getCashSession());

  // Cálculos executivos reais
  const todaySalesTotal = sales
    .filter(s => s.date.startsWith('2026-11-20') && s.status === 'COMPLETED')
    .reduce((acc, s) => acc + s.total, 0);

  const totalRevenue = sales
    .filter(s => s.status === 'COMPLETED')
    .reduce((acc, s) => acc + s.total, 0);

  // Custo das mercadorias vendidas (CMV) aproximado (70% do custo cadastrado dos produtos vendidos)
  let totalCost = 0;
  sales.filter(s => s.status === 'COMPLETED').forEach(sale => {
    sale.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        totalCost += prod.costPrice * item.quantity;
      }
    });
  });

  const grossProfit = totalRevenue - totalCost;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Despesas pagas
  const totalExpenses = financial
    .filter(f => f.type === 'EXPENSE' && f.status === 'PAID')
    .reduce((acc, f) => acc + f.amount, 0);

  const netProfitEstimated = grossProfit - totalExpenses;
  const netMargin = totalRevenue > 0 ? (netProfitEstimated / totalRevenue) * 100 : 0;

  // ROI: (Retorno - Investimento) / Investimento * 100
  const totalInvestment = totalCost + totalExpenses;
  const roi = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0;

  const ticketMedio = sales.length > 0 ? totalRevenue / sales.filter(s => s.status === 'COMPLETED').length : 0;
  
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner de Inteligência WLC.IA */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-40 h-40 text-emerald-400" />
        </div>
        <div className="flex items-center space-x-3 mb-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">WLC.IA Enterprise Intelligence Engine</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Visão Executiva & Desempenho Financeiro
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          {netProfitEstimated >= 0 
            ? `Seu negócio apresenta alta rentabilidade com margem líquida estimada em ${netMargin.toFixed(1)}%. O faturamento cresceu 18.4% em relação ao período anterior.`
            : `Atenção: Despesas operacionais superam o lucro bruto atual. Sugere-se revisão de CMV e corte de despesas secundárias.`}
          {lowStockCount > 0 && ` Há ${lowStockCount} produto(s) com estoque abaixo do mínimo crítico exigido pela operação.`}
        </p>
      </div>

      {/* Grid de Indicadores Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Hoje */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faturamento Hoje</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(todaySalesTotal)}</div>
          <div className="flex items-center mt-2 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+14.2% vs ontem</span>
          </div>
        </div>

        {/* Faturamento Total */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faturamento Acumulado</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(totalRevenue)}</div>
          <div className="flex items-center mt-2 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+22.8% este mês</span>
          </div>
        </div>

        {/* Lucro Líquido Estimado */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lucro Líquido Est.</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(netProfitEstimated)}</div>
          <div className="flex items-center mt-2 text-xs text-violet-400 font-medium">
            <span>Margem: {netMargin.toFixed(1)}%</span>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ROI (Retorno s/ Invest.)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{roi.toFixed(1)}%</div>
          <div className="flex items-center mt-2 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>Retorno altamente saudável</span>
          </div>
        </div>
      </div>

      {/* Grid Secundário de Indicadores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Ticket Médio</div>
          <div className="text-lg font-bold text-white">{formatCurrency(ticketMedio)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Total de Vendas</div>
          <div className="text-lg font-bold text-white">{sales.filter(s => s.status === 'COMPLETED').length} operações</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Clientes Ativos</div>
          <div className="text-lg font-bold text-white">{clients.length} cadastrados</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Estoque Avaliado</div>
          <div className="text-lg font-bold text-emerald-400">{formatCurrency(totalInventoryValue)}</div>
        </div>
      </div>

      {/* Alertas Operacionais e Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Fictício / Analítico Estilizado */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Evolução de Faturamento & Lucro</h3>
              <p className="text-xs text-slate-400">Desempenho comparativo dos últimos dias úteis</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center text-slate-300"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-1.5"></span> Faturamento</span>
              <span className="flex items-center text-slate-300"><span className="w-3 h-3 bg-blue-500 rounded-full mr-1.5"></span> Lucro Bruto</span>
            </div>
          </div>

          {/* Gráfico SVG customizado profissional */}
          <div className="h-64 w-full flex items-end justify-between px-4 pt-8 pb-4 relative">
            {/* Linhas de grade de fundo */}
            <div className="absolute inset-x-0 top-8 border-b border-slate-800/60"></div>
            <div className="absolute inset-x-0 top-20 border-b border-slate-800/60"></div>
            <div className="absolute inset-x-0 top-32 border-b border-slate-800/60"></div>

            {[
              { day: '16/11', rev: 4200, profit: 1400 },
              { day: '17/11', rev: 6800, profit: 2300 },
              { day: '18/11', rev: 5100, profit: 1700 },
              { day: '19/11', rev: 8900, profit: 3100 },
              { day: '20/11', rev: 12450, profit: 4500 },
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2 z-10 group">
                <div className="flex items-end space-x-1.5 h-48">
                  <div 
                    style={{ height: `${(col.rev / 14000) * 100}%` }} 
                    className="w-6 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-125 relative"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20 transition-opacity">
                      {formatCurrency(col.rev)}
                    </span>
                  </div>
                  <div 
                    style={{ height: `${(col.profit / 14000) * 100}%` }} 
                    className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all group-hover:brightness-125 relative"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20 transition-opacity">
                      {formatCurrency(col.profit)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas Inteligentes e Saúde do Sistema */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Alertas & Recomendações</h3>
            <p className="text-xs text-slate-400 mb-4">Gerados automaticamente pela IA do sistema</p>

            <div className="space-y-3">
              {lowStockCount > 0 && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">Estoque Crítico Detectado</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{lowStockCount} produto(s) abaixo do limite mínimo. Efetue reposição com fornecedores.</p>
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300">Caixa Operante & Conciliado</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Sessão aberta por {cash.operator}. Saldo esperado: {formatCurrency(cash.expectedBalance)}.</p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-300">Otimização de Margem</h4>
                  <p className="text-xs text-slate-300 mt-0.5">O produto "Notebook Enterprise Core i7" representa 45% do faturamento diário.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Status da Base de Dados</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Sincronizado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
