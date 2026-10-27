import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function AdminTickets() {
  const [tickets] = useState([]);
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageCircle className="w-5 h-5" /> پشتیبانی</h2>
      {tickets.length === 0 ? (
        <p className="text-center text-stone-500 py-10">هنوز هیچ تیکتی وجود ندارد.</p>
      ) : (
        <div>لیست تیکت‌ها</div>
      )}
    </div>
  );
}
