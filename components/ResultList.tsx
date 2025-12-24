
import React from 'react';
import { PincodeData } from '../types';
import { MapPin, ArrowRight, Building2, Truck, Layers } from 'lucide-react';

interface ResultListProps {
  results: PincodeData[];
  onSelect: (item: PincodeData) => void;
  isLoading: boolean;
}

export const ResultList: React.FC<ResultListProps> = ({ results, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse h-48">
            <div className="flex justify-between mb-4">
              <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
              <div className="h-6 w-12 bg-slate-100 rounded"></div>
            </div>
            <div className="h-6 w-3/4 bg-slate-100 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-1/2 bg-slate-50 rounded"></div>
              <div className="h-4 w-1/3 bg-slate-50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 mt-12">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={32} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Post Office Not Found</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
          We couldn't find any results for that search. Try checking the spelling or use a 6-digit Pincode.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {results.map((item, index) => (
        <div 
          key={`${item.pincode}-${item.officeName}-${index}`}
          className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black tracking-widest shadow-sm">
              {item.pincode}
            </span>
            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 ${item.deliveryStatus === 'Delivery' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              <Truck size={10} />
              {item.deliveryStatus}
            </span>
          </div>
          
          <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {item.officeName}
          </h3>
          
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Building2 size={14} className="text-slate-400" />
              <span>{item.district}, {item.state}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Layers size={14} className="text-slate-400" />
              <span>Mandal/Block: <span className="font-bold text-slate-700">{item.block}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-tighter">
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span>{item.officeType} Office • {item.divisionName}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Details & Insights</span>
            <ArrowRight size={16} className="text-blue-600 translate-x-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ))}
    </div>
  );
};
