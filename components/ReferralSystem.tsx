
import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Users, Award } from 'lucide-react';

export const ReferralSystem: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "PINPRO-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://pincodepro.in/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 animate-in slide-in-from-bottom-10">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Gift size={200} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            <Award size={14} /> Referral Rewards 2025
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-6 leading-tight">Refer a Friend & Unlock Pro Features</h2>
          <p className="text-xl text-blue-100 mb-12 font-medium">Help your network master India's postal geography. For every 5 friends who join, you get a lifetime ad-free experience.</p>
          
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 block mb-4">Your Unique Invite Link</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 font-mono text-sm truncate">
                {referralLink}
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {[
          { icon: <Users className="text-blue-600" />, title: "Invite Friends", desc: "Share your link on WhatsApp or Twitter." },
          { icon: <Gift className="text-purple-600" />, title: "Earn Points", desc: "Get 10 points for every successful sign-up." },
          { icon: <Award className="text-amber-600" />, title: "Get Pro", desc: "Redeem points for premium API access." }
        ].map((step, i) => (
          <div key={i} className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
              {step.icon}
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-4">{step.title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
