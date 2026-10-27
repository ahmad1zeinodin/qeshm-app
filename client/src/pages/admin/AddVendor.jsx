import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, Store, Wrench } from 'lucide-react';
import api from '../../lib/axios';

const MAIN_FIELDS = ['خدمات', 'فروشگاه', 'رستوران', 'تفریح و سرگرمی', 'هتل و اقامتگاه', 'بازار عمده'];

export default function AddVendor() {
  const [selectedField, setSelectedField] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedField === 'خدمات') {
      api.get('/skills/categories/خدمات').then(res => {
        if (res.data.success) setCategories(res.data.data);
      });
    }
  }, [selectedField]);

  useEffect(() => {
    if (selectedCategory) {
      api.get(`/skills/skills/${selectedCategory}`).then(res => {
        if (res.data.success) setSkills(res.data.data);
      });
    }
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !selectedField) {
      setMessage('لطفاً فیلدها را کامل کنید.'); return;
    }
    try {
      // اینجا بعداً به API واقعی ثبت‌نام سفیر وصل می‌شود
      setMessage('✅ سفیر با موفقیت ثبت‌نام شد.');
      setFormData({ name: '', phone: '', email: '', password: '' });
      setSelectedField(null); setSelectedCategory(null); setSelectedSkills([]);
    } catch (err) {
      setMessage('❌ خطا: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><UserPlus className="w-5 h-5" /> ثبت‌نام سفیر جدید</h2>
      {message && <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 mb-4">{message}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="نام و نام خانوادگی" className="border rounded-lg px-3 py-2" />
          <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="شماره تماس" className="border rounded-lg px-3 py-2" />
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ایمیل" className="border rounded-lg px-3 py-2" />
          <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="رمز عبور" className="border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">فیلد اصلی (فقط یک مورد)</label>
          <div className="flex flex-wrap gap-2">
            {MAIN_FIELDS.map(field => (
              <button key={field} type="button" onClick={() => setSelectedField(field)} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedField === field ? 'bg-violet-600 text-white' : 'bg-white text-stone-600'}`}>
                {field}
              </button>
            ))}
          </div>
        </div>

        {selectedField === 'خدمات' && categories.length > 0 && (
          <div>
            <label className="block text-sm font-bold mb-2">دسته‌بندی</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat._id} type="button" onClick={() => setSelectedCategory(cat._id)} className={`px-3 py-1.5 rounded-lg text-sm border ${selectedCategory === cat._id ? 'bg-green-600 text-white' : 'bg-white'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCategory && skills.length > 0 && (
          <div>
            <label className="block text-sm font-bold mb-2">مهارت‌ها</label>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <label key={skill._id} className="flex items-center gap-2 text-sm bg-stone-50 p-2 rounded-lg border">
                  <input type="checkbox" checked={selectedSkills.includes(skill._id)} onChange={() => setSelectedSkills(prev => prev.includes(skill._id) ? prev.filter(s => s !== skill._id) : [...prev, skill._id])} className="w-4 h-4 accent-violet-600" />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedField && selectedField !== 'خدمات' && (
          <div className="bg-violet-50 p-4 rounded-xl text-sm text-violet-800 flex items-center gap-2">
            <Store className="w-5 h-5" /> این سفیر به پنل بارگذاری محصول دسترسی خواهد داشت.
          </div>
        )}

        <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> ثبت‌نام نهایی</button>
      </form>
    </div>
  );
}
