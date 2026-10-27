import { Wallet, ArrowDownToLine } from 'lucide-react';

export default function WorkerWallet() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-stone-800 border-b pb-2 flex items-center gap-2"><Wallet className="w-5 h-5" /> کیف پول من</h2>
      
      <div className="bg-gradient-to-br from-violet-600 to-pink-500 p-6 rounded-2xl text-white shadow-lg">
        <span className="text-sm opacity-80 block mb-1">موجودی قابل برداشت</span>
        <span className="text-4xl font-black">۰ <span className="text-lg font-normal">تومان</span></span>
      </div>

      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="font-bold mb-4 flex items-center gap-2"><ArrowDownToLine className="w-5 h-5 text-violet-600" /> درخواست برداشت وجه</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="مبلغ درخواستی (تومان)" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm">ثبت درخواست</button>
        </div>
      </div>
    </div>
  );
}
