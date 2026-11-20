import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, LogOut, Menu, X, ShieldCheck, Database, DollarSign, FileText } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { PDV } from './components/PDV';
import { ProductsModule } from './components/Products';
import { db } from './services/db';

function ClientsModule() {
  const [clients] = useState(() => db.getClients());
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <Users className="w-7 h-7 text-emerald-400" />
          <span>Gestão de Clientes & CRM</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">Histórico de compras, ticket médio e segmentação de clientes.</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Total Comprado</th>
                <th className="px-6 py-4 text-right">Última Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white text-sm">{c.name}</td>
                  <td className="px-6 py-4 text-slate-300">
                    <div>{c.phone}</div>
                    <div className="text-slate-500">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.status === 'VIP' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-emerald-400 text-sm">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{c.lastPurchase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsModule() {
  const [sales] = useState(() => db.getSales());
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-emerald-400" />
          <span>Relatórios & Auditoria de Transações</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">Histórico completo de vendas e logs operacionais validados.</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-white text-sm">Vendas Concluídas ({sales.length})</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Transação ID</th>
                <th className="px-6 py-4">Data / Hora</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Operador</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-emerald-400">{s.id}</td>
                  <td className="px-6 py-4 text-slate-300">{s.date}</td>
                  <td className="px-6 py-4 text-white font-medium">{s.clientName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">{s.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{s.operator}</td>
                  <td className="px-6 py-4 text-right font-black text-white text-sm">{formatCurrency(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsModule() {
  const [audit] = useState(() => db.getAuditLogs());

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <Settings className="w-7 h-7 text-emerald-400" />
          <span>Configurações & Logs de Auditoria</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">Segurança de dados, persistência local e logs de eventos operacionais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-white mb-2">Manutenção do Banco de Dados</h3>
          <p className="text-xs text-slate-400 mb-6">Redefina o banco para os valores padrão de demonstração enterprise.</p>
          <button 
            onClick={() => {
              if (confirm('Deseja realmente restaurar os dados padrão?')) {
                db.resetAll();
              }
            }}
            className="px-4 py-2.5 bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 text-red-400 font-semibold text-xs rounded-xl transition-colors"
          >
            Restaurar Dados Padrão (Reset)
          </button>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-white mb-2">Informações da Sessão</h3>
          <p className="text-xs text-slate-400 mb-4">Ambiente seguro WLC.DB Storage Engine v1.0</p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span>Versão do Motor:</span>
              <span className="font-mono text-emerald-400">Enterprise Core 5.2</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span>Modo de Persistência:</span>
              <span className="font-mono text-white">LocalStorage + WLC.DB</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Status da Conexão:</span>
              <span className="text-emerald-400 font-bold">Online / Sincronizado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">Logs de Auditoria Recentes</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {audit.map(log => (
            <div key={log.id} className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-slate-500 text-[11px]">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">{log.action}</span>
                <span className="text-white">{log.details}</span>
              </div>
              <span className="text-slate-400 font-semibold">{log.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'DASHBOARD' | 'PDV' | 'PRODUCTS' | 'CLIENTS' | 'REPORTS' | 'SETTINGS'>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'DASHBOARD', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'PDV', name: 'PDV / Vendas', icon: ShoppingCart },
    { id: 'PRODUCTS', name: 'Produtos', icon: Package },
    { id: 'CLIENTS', name: 'Clientes', icon: Users },
    { id: 'REPORTS', name: 'Relatórios', icon: BarChart3 },
    { id: 'SETTINGS', name: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'DASHBOARD': return <Dashboard />;
      case 'PDV': return <PDV />;
      case 'PRODUCTS': return <ProductsModule />;
      case 'CLIENTS': return <ClientsModule />;
      case 'REPORTS': return <ReportsModule />;
      case 'SETTINGS': return <SettingsModule />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="text-xl font-black text-white">WLC.<span className="text-emerald-500">IA</span></span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  currentPage === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && <span className="font-semibold text-sm">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => db.resetAll()} className="w-full flex items-center space-x-3 p-3 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-semibold text-sm">Reiniciar Sistema</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">{menuItems.find(i => i.id === currentPage)?.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300">
              Ana Gerente <span className="text-emerald-500 font-bold ml-2">• Operacional</span>
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}
