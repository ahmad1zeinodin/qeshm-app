import { ShoppingBag } from 'lucide-react';

export default function WorkerOrders() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-stone-800 border-b pb-2">سفارشات دریافتی</h2>
      <div className="text-center py-10 bg-stone-50 rounded-xl border">
        <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500 font-bold">در حال حاضر سفارشی وجود ندارد.</p>
      </div>
    </div>
  );
}
