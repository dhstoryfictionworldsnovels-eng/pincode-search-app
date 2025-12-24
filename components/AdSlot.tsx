
import React from 'react';

interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'inline';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, className }) => {
  return (
    <div className={`bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-slate-100/50 ${className}`}>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">Advertisement</span>
      <div className={`w-full h-full flex items-center justify-center italic text-slate-400 text-xs text-center px-4`}>
        {type === 'banner' && 'Responsive Leaderboard Ad Slot'}
        {type === 'sidebar' && 'Premium Display Slot'}
        {type === 'inline' && 'Content Match In-feed Slot'}
      </div>
      {/* Real AdSense tag would go here:
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXX"
           data-ad-slot="XXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      */}
    </div>
  );
};
