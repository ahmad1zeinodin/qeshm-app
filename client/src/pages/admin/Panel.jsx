import { useState } from 'react';
import { Layers, UserPlus, Shield, MessageCircle } from 'lucide-react';
import SkillsManager from './SkillsManager';
import AddVendor from './AddVendor';
import AdminsManager from './AdminsManager';
import AdminTickets from './AdminTickets';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('skills');

  const tabs = [
    { id: 'skills', label: 'مدیریت مهارت‌ها', Icon: Layers },
    { id: 'vendors', label: 'ثبت‌نام سفیر', Icon: UserPlus },
    { id: 'admins', label: 'مدیریت ادمین‌ها', Icon: Shield },
    { id: 'tickets', label: 'پشتیبانی', Icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl">
      <div className="w-64 bg-white border-l border-stone-200 min-h-screen p-4">
        <h1 className="text-xl font-black text-orange-500 mb-6">قشمی نو</h1>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100'}`}>
              <tab.Icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'vendors' && <AddVendor />}
          {activeTab === 'admins' && <AdminsManager />}
          {activeTab === 'tickets' && <AdminTickets />}
        </div>
      </div>
    </div>
  );
}
