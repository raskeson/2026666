import React, { useState } from 'react';

export default function AddPlantModal({ isOpen, onClose, onAddPlant, plantCount }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    category: '鹿角蕨',
    buyCost: 0,
    currentVal: 0,
    parentA: '未知/原生種',
    parentB: '未知',
    location: '陽台遮雨區',
    hasRainCover: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('請輸入植物名稱！');
      return;
    }

    const newUid = `P-${new Date().getFullYear()}-${String(plantCount + 1).padStart(3, '0')}`;
    const newPlant = {
      uid: newUid,
      ...formData,
      buyCost: Number(formData.buyCost),
      currentVal: Number(formData.currentVal),
      isHighVal: Number(formData.currentVal) >= 5000,
      status: 'alive',
      deathReason: '',
      isGifted: false,
      isIsolated: false,
      lastWatered: new Date().toISOString().split('T')[0],
      timeline: [
        { 
          date: new Date().toISOString().split('T')[0], 
          action: '建立個體', 
          note: `自主新增入帳 (購入價 NT$ ${formData.buyCost})` 
        }
      ],
      photos: []
    };

    onAddPlant(newPlant);
    onClose();
    setFormData({
      name: '',
      category: '鹿角蕨',
      buyCost: 0,
      currentVal: 0,
      parentA: '未知/原生種',
      parentB: '未知',
      location: '陽台遮雨區',
      hasRainCover: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 className="text-lg font-bold text-emerald-400">自行新增植物個體</h3>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">植物名稱 *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-sm text-slate-100 focus:outline-none focus:border-emerald-500" 
              placeholder="例如：姬鹿角蕨" 
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">品類</label>
              <input 
                type="text" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-sm text-slate-100" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">擺放位置</label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-sm text-slate-100" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">購入成本 (NT$)</label>
              <input 
                type="number" 
                value={formData.buyCost} 
                onChange={e => setFormData({...formData, buyCost: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-sm text-slate-100" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">當前估值 (NT$)</label>
              <input 
                type="number" 
                value={formData.currentVal} 
                onChange={e => setFormData({...formData, currentVal: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-sm text-slate-100" 
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="hasRainCover"
              checked={formData.hasRainCover} 
              onChange={e => setFormData({...formData, hasRainCover: e.target.checked})} 
              className="accent-emerald-500 rounded"
            />
            <label htmlFor="hasRainCover" className="text-xs text-slate-300">該區域有遮雨設施</label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button 
              type="button"
              onClick={onClose} 
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition"
            >
              取消
            </button>
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              確認新增
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
