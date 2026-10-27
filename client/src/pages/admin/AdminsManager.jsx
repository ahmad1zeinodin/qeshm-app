import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';

export default function AdminsManager() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleTitle: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('✅ ادمین جدید ساخته شد (شبیه‌سازی).');
    setFormData({ name: '', email: '', password: '', roleTitle: '' });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Shield className="w-5 h-5" /> مدیریت ادمین‌ها</h2>
      {message && <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 mb-4">{message}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="نام و نام خانوادگی" className="border rounded-lg px-3 py-2" />
          <input type="text" value={formData.roleTitle} onChange={e => setFormData({...formData, roleTitle: e.target.value})} placeholder="عنوان سمت (مثلاً مدیر مالی)" className="border rounded-lg px-3 py-2" />
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ایمیل" className="border rounded-lg px-3 py-2" />
          <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="رمز عبور" className="border rounded-lg px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> ساخت ادمین</button>
      </form>
    </div>
  );
}
