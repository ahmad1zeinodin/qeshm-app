import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Wallet, LogOut } from 'lucide-react';
import WorkerOverview from './WorkerOverview';
import WorkerProducts from './WorkerProducts';
import WorkerOrders from './WorkerOrders';
import WorkerWallet from './WorkerWallet';

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'نمای کلی', Icon: LayoutDashboard },
    { id: 'products', label: 'محصولات / منو', Icon: Package },
    { id: 'orders', label: 'سفارشات', Icon: ShoppingBag },
    { id: 'wallet', label: 'کیف پول', Icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl">
      {/* منوی کناری */}
      <div className="w-64 bg-white border-l border-stone-200 min-h-screen p-4 flex flex-col">
        <h1 className="text-xl font-black text-orange-500 mb-6">پنل سفیر</h1>
        <div className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100'}`}>
              <tab.Icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 mt-4"><LogOut className="w-5 h-5" /> خروج</button>
      </div>

      {/* محتوای اصلی */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'overview' && <WorkerOverview />}
          {activeTab === 'products' && <WorkerProducts />}
          {activeTab === 'orders' && <WorkerOrders />}
          {activeTab === 'wallet' && <WorkerWallet />}
        </div>
      </div>
    </div>
  );
}
