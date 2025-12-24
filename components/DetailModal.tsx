
import React, { useEffect, useState } from 'react';
import { X, Info, Landmark, Map, Navigation, Copy, Share2, Stethoscope, GraduationCap, Building2, Clock, MapPin, Truck, ExternalLink, ChevronRight, Newspaper, CheckCircle2, Star, BrainCircuit, Twitter, Facebook, MessageSquare, ArrowRight } from 'lucide-react';
import { PincodeData, LocalityInsight } from '../types';
import { getLocalityInsights } from '../services/geminiService';

interface DetailModalProps {
  item: PincodeData;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  const [data, setData] = useState<{ insights: LocalityInsight; sources: {uri: string; title: string}[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getLocalityInsights(item.officeName, item.pincode, item.state);
      setData(res);
      setLoading(false);
    };
    fetch();
  }, [item]);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.pincode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out postal details for ${item.officeName}, ${item.district}. Pincode: ${item.pincode} - via PincodePro`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Searching for ${item.officeName} postal info? Pincode: ${item.pincode}. View details here:`)}&url=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
  };

  const nearbyPincodes = [
    parseInt(item.pincode) - 1,
    parseInt(item.pincode) + 1,
    parseInt(item.pincode) + 2
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-7xl h-full sm:h-[95vh] sm:rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden relative border border-white/20">
        
        {/* Floating Controls */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <div className="flex bg-white/90 backdrop-blur shadow-lg rounded-full border border-slate-100 p-1">
             <a href={shareLinks.whatsapp} target="_blank" className="w-10 h-10 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors"><MessageSquare size={18} /></a>
             <a href={shareLinks.twitter} target="_blank" className="w-10 h-10 flex items-center justify-center text-sky-500 hover:bg-sky-50 rounded-full transition-colors"><Twitter size={18} /></a>
             <a href={shareLinks.facebook} target="_blank" className="w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Facebook size={18} /></a>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-slate-900 hover:bg-red-50 hover:text-red-500 border border-slate-100 transition-all"><X size={24} /></button>
        </div>

        {/* Sidebar: Primary Info */}
        <div className="md:w-[35%] bg-slate-50 p-10 overflow-y-auto border-r border-slate-100 custom-scrollbar">
          <div className="mt-12 mb-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-3xl font-black tracking-widest shadow-2xl shadow-blue-100">
                {item.pincode}
              </span>
              <button 
                onClick={handleCopy}
                className={`p-4 rounded-2xl border-2 transition-all ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500'}`}
              >
                {copied ? <CheckCircle2 size={22} /> : <Copy size={22} />}
              </button>
            </div>
            
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-4">
              {item.officeName}
            </h2>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 w-fit px-4 py-2 rounded-xl">
              <MapPin size={16} /> {item.district}, {item.state}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-sm flex items-center justify-between">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Infrastructure Rating</label>
                <div className="flex gap-1 text-amber-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} className="text-slate-200" />
                </div>
              </div>
              <span className="text-xl font-black text-slate-900">4.2</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-sm">
                <Truck size={18} className="text-green-500 mb-2" />
                <span className="text-xs font-black text-slate-800 uppercase block">{item.deliveryStatus}</span>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-sm">
                <Building2 size={18} className="text-blue-500 mb-2" />
                <span className="text-xs font-black text-slate-800 uppercase block">{item.officeType}</span>
              </div>
            </div>

            <a 
              href={`https://www.google.com/maps/search/${encodeURIComponent(`${item.officeName} ${item.pincode}`)}`} 
              target="_blank" 
              className="flex justify-between items-center p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl shadow-slate-200 group"
            >
              <div className="flex items-center gap-3">
                <Navigation size={20} className="text-blue-400" />
                <span className="font-bold text-sm">Get Directions</span>
              </div>
              <ExternalLink size={18} className="opacity-50 group-hover:opacity-100" />
            </a>

            <div className="pt-6">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4">Nearby Search Indexes</label>
               <div className="space-y-2">
                 {nearbyPincodes.map(p => (
                   <button key={p} className="w-full flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-500 transition-all">
                     <span className="font-black tracking-widest text-slate-800">{p}</span>
                     <ArrowRight size={14} className="text-slate-300" />
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto bg-white custom-scrollbar">
          {loading ? (
            <div className="space-y-10 animate-pulse mt-12">
              <div className="h-40 bg-slate-50 rounded-[3rem]"></div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-64 bg-slate-50 rounded-[3rem]"></div>
                <div className="h-64 bg-slate-50 rounded-[3rem]"></div>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-12 pb-10">
              <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Landmark size={120} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-200 mb-4 flex items-center gap-2">
                  <Info size={14} /> Area Intelligence
                </h4>
                <p className="text-lg font-medium leading-relaxed relative z-10">{data.insights.summary}</p>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-6 flex items-center gap-2">
                    <Stethoscope size={18} /> Medical Facilities
                  </h4>
                  <div className="space-y-4">
                    {data.insights.hospitals.map((h, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-xs">{i+1}</div>
                        <span className="text-sm font-bold text-slate-800">{h}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
                    <GraduationCap size={18} /> Education & Culture
                  </h4>
                  <div className="space-y-4">
                    {data.insights.schools.map((s, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">{i+1}</div>
                        <span className="text-sm font-bold text-slate-800">{s}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {data.sources.length > 0 && (
                <section>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <Newspaper size={18} /> Verified Area Sources & News
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.sources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between group"
                      >
                        <span className="text-sm font-bold text-slate-700 truncate pr-4">{source.title}</span>
                        <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-500" />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              <section className="pt-10 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Regional Landmarks</h4>
                <div className="flex flex-wrap gap-3">
                  {data.insights.keyPlaces.map((place, i) => (
                    <span key={i} className="px-5 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                      {place}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
              <BrainCircuit size={64} className="mb-4 animate-pulse text-blue-600" />
              <p className="font-black text-slate-400 uppercase tracking-widest">Compiling Neural Data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
