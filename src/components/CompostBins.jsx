import React, { useState } from 'react';
import { Box, Plus } from 'lucide-react';

export default function CompostBins({ compostBins, setCompostBins, onAddSupply }) {
  const [newBinName, setNewBinName] = useState('');

  // 新增堆肥箱
  const handleAddBin = (e) => {
    e.preventDefault();
    if (!newBinName.trim()) return;

    const newBin = {
      id: Date.now(),
      name: newBinName,
      cWeight: 0,
      nWeight: 0,
      status: '準備中'
    };

    setCompostBins([...compostBins, newBin]);
    setNewBinName('');
  };

  // 獨立更新單一堆肥箱的重量
  const handleWeightChange = (id, field, value) => {
    const val = Math.max(0, Number(value) || 0);
    setCompostBins(compostBins.map(bin => 
      bin.id === id ? { ...bin, [field]: val } : bin
    ));
  };

  // 熟成開箱轉化為資材庫存
  const handleHarvest = (bin) => {
    const totalYield = Number((bin.cWeight + bin.nWeight).toFixed(1));
    if (totalYield <= 0) {
      alert('堆肥箱內尚無資材重量，無法開箱！');
      return;
    }

    const newSupplyItem = {
      id: Date.now(),
      name: `熟成自製有機肥 (${bin.name})`,
      category: '肥料',
      count: totalYield,
      unit: 'kg',
      seller: '自家堆肥箱',
      rating: '5★',
      price: 0
    };

    // 呼叫父組件將肥料納入資材庫存
    onAddSupply(newSupplyItem);

    // 清空該堆肥箱重量並更新狀態
    setCompostBins(compostBins.map(b => 
      b.id === bin.id ? { ...b, cWeight: 0, nWeight: 0, status: '已開箱清空' } : b
    ));

    alert(`🎉 【${bin.name}】開箱成功！成功轉化 ${totalYield} kg 自製有機肥並納入資材庫存！`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
      <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
        <Box className="w-5 h-5" /> 多堆肥箱管理
      </h2>

      {/* 新增堆肥箱表單 */}
      <form onSubmit={handleAddBin} className="flex gap-2">
        <input 
          type="text" 
          placeholder="新增堆肥箱名稱 (例如：3號落葉專用箱)" 
          value={newBinName} 
          onChange={e => setNewBinName(e.target.value)}
          className="bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-xs flex-1 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
        <button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1 transition"
        >
          <Plus className="w-4 h-4" /> 新增箱體
        </button>
      </form>

      {/* 堆肥箱列表 */}
      <div className="space-y-4 pt-2">
        {compostBins.map(bin => {
          const cnRatio = bin.nWeight > 0 ? (bin.cWeight / bin.nWeight).toFixed(1) : '0';
          const totalWeight = (bin.cWeight + bin.nWeight).toFixed(1);

          return (
            <div key={bin.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-200 text-sm">{bin.name}</span>
                <span className="text-amber-400 font-mono">
                  C/N 比 = {cnRatio} : 1
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">碳料 (C):</span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      step="0.1"
                      value={bin.cWeight} 
                      onChange={e => handleWeightChange(bin.id, 'cWeight', e.target.value)} 
                      className="bg-slate-950 border border-slate-700 w-16 px-2 py-1 rounded text-right text-slate-100 focus:outline-none" 
                    />
                    <span className="text-slate-500">kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">氮料 (N):</span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      step="0.1"
                      value={bin.nWeight} 
                      onChange={e => handleWeightChange(bin.id, 'nWeight', e.target.value)} 
                      className="bg-slate-950 border border-slate-700 w-16 px-2 py-1 rounded text-right text-slate-100 focus:outline-none" 
                    />
                    <span className="text-slate-500">kg</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleHarvest(bin)} 
                disabled={totalWeight <= 0}
                className={`w-full font-bold py-2 rounded-lg transition text-xs ${
                  totalWeight > 0 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                熟成開箱 (轉化 {totalWeight} kg 至資材庫存)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
