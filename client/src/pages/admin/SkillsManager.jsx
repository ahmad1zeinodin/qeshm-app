import { useState, useEffect } from 'react';
import { Tag, Layers } from 'lucide-react';
import api from '../../lib/axios';

const MAIN_FIELDS = ['خدمات', 'فروشگاه', 'رستوران', 'تفریح و سرگرمی', 'هتل و اقامتگاه', 'بازار عمده'];

export default function SkillsManager() {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState({});
  const [selectedField, setSelectedField] = useState('خدمات');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSkill, setNewSkill] = useState({ name: '', categoryId: '' });
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/skills/categories/${selectedField}`);
      if (res.data.success) setCategories(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchSkills = async (categoryId) => {
    try {
      const res = await api.get(`/skills/skills/${categoryId}`);
      if (res.data.success) setSkills(prev => ({ ...prev, [categoryId]: res.data.data }));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCategories(); }, [selectedField]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      await api.post('/skills/categories', { name: newCategoryName, field: selectedField });
      setMessage('✅ شاخه جدید اضافه شد.');
      setNewCategoryName('');
      fetchCategories();
    } catch (err) { setMessage('❌ خطا: ' + err.message); }
  };

  const handleAddSkill = async (e, categoryId) => {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      await api.post('/skills/skills', { name: newSkill.name, categoryId });
      setMessage('✅ مهارت جدید اضافه شد.');
      setNewSkill({ name: '', categoryId: '' });
      fetchSkills(categoryId);
    } catch (err) { setMessage('❌ خطا: ' + err.message); }
  };

  return (
    <div className="space-y-8">
      {message && <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700">{message}</div>}
      
      <div>
        <label className="block text-sm font-bold mb-2">فیلد اصلی را انتخاب کنید:</label>
        <div className="flex flex-wrap gap-2">
          {MAIN_FIELDS.map(field => (
            <button key={field} onClick={() => setSelectedField(field)} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedField === field ? 'bg-violet-600 text-white' : 'bg-white text-stone-600'}`}>
              {field}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-stone-50 p-4 rounded-xl border">
        <h3 className="font-bold mb-2 flex items-center gap-2"><Layers className="w-4 h-4" /> افزودن شاخه جدید به {selectedField}</h3>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="نام شاخه..." className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold">افزودن</button>
        </form>
      </div>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat._id} className="border rounded-xl p-4">
            <h4 className="font-bold text-violet-700 mb-3 flex items-center gap-2"><Tag className="w-4 h-4" /> {cat.name}</h4>
            <form onSubmit={(e) => handleAddSkill(e, cat._id)} className="flex gap-2 mb-3">
              <input type="text" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} placeholder="نام مهارت..." className="flex-1 border rounded-lg px-3 py-1 text-sm" />
              <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold">افزودن مهارت</button>
            </form>
            <div className="flex flex-wrap gap-2">
              {skills[cat._id]?.map(skill => (
                <span key={skill._id} className="bg-stone-100 px-3 py-1 rounded-lg text-sm">{skill.name}</span>
              ))}
              {!skills[cat._id] && <button onClick={() => fetchSkills(cat._id)} className="text-xs text-blue-500">نمایش مهارت‌ها</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
