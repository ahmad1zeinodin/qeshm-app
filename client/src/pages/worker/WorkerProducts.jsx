import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function WorkerProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', desc: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setProducts([...products, { ...form, id: Date.now() }]);
    setForm({ name: '', price: '', desc: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-bold text-stone-800">مدیریت محصولات / منو</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> افزودن محصول</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-stone-50 p-4 rounded-xl border space-y-3">
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="نام محصول" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="قیمت (تومان)" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="توضیحات (اختیاری)" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">ذخیره</button>
        </form>
      )}

      {products.length === 0 ? (
        <div className="text-center py-10 text-stone-500 bg-stone-50 rounded-xl border">هنوز محصولی ثبت نشده است.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div>
                <span className="font-bold block">{p.name}</span>
                <span className="text-xs text-stone-500">{p.desc}</span>
                <span className="text-sm font-bold text-violet-700 block mt-1">{Number(p.price).toLocaleString()} تومان</span>
              </div>
              <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
