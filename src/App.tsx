import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { PDV } from './components/PDV';
import { db } from './services/db';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'DASHBOARD' | 'PDV'>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'DASHBOARD', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'PDV', name: 'PDV / Vendas', icon: ShoppingCart },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'DASHBOARD': return <Dashboard />;
      case 'PDV': return <PDV />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className=\"min-h-screen bg-slate-950 text-slate-200 flex\">
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className=\"p-6 flex items-center justify-between\">
          {isSidebarOpen && <span className=\"text-xl font-black text-white\">WLC.<span className=\"text-emerald-500\">IA</span></span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className=\"text-slate-400 hover:text-white\">
            {isSidebarOpen ? <X className=\"w-5 h-5\" /> : <Menu className=\"w-5 h-5\" />}
          </button>
        </div>

        <nav className=\"flex-1 py-6 px-4 space-y-2\">
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
                <Icon className=\"w-5 h-5\" />
                {isSidebarOpen && <span className=\"font-semibold text-sm\">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className=\"p-4 border-t border-slate-800\">
          <button onClick={() => db.resetAll()} className=\"w-full flex items-center space-x-3 p-3 text-slate-400 hover:text-red-400 transition-colors\">
            <LogOut className=\"w-5 h-5\" />
            {isSidebarOpen && <span className=\"font-semibold text-sm\">Reiniciar Sistema</span>}
          </button>
        </div>
      </aside>

      <main className=\"flex-1 overflow-y-auto p-8\">
        <header className=\"mb-8 flex items-center justify-between\">
          <h1 className=\"text-2xl font-black text-white\">{menuItems.find(i => i.id === currentPage)?.name}</h1>
          <div className=\"px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300\">
            Ana Gerente <span className=\"text-emerald-500 font-bold ml-2\">• Operacional</span>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}
