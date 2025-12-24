
import React from 'react';
import { HelpCircle, Map, Search, Info, TrendingUp, Zap } from 'lucide-react';

interface SEOContentProps {
  type: 'home' | 'search' | 'directory';
  context?: string;
}

export const SEOContent: React.FC<SEOContentProps> = ({ type, context }) => {
  const faqs = [
    {
      q: "How many pincodes are there in India?",
      a: "India has over 19,000 pincodes covering more than 1.5 lakh post offices. PincodePro provides a real-time AI-powered interface to search every single one of them."
    },
    {
      q: "What do the digits in a pincode stand for?",
      a: "The first digit indicates the region, the second the sub-region, the third the sorting district, and the last three the specific delivery post office."
    },
    {
      q: "How to find a pincode by area name?",
      a: "Simply type the area name (e.g., 'Ameerpet') into our AI search bar. Our system uses neural processing to match locality names with official postal records."
    }
  ];

  const popularSearches = [
    "Pincode of Mumbai", "Delhi GPO Pincode", "Bangalore Postal Codes", "Chennai District Pincodes",
    "Hyderabad Post Offices", "Pune Mandal Codes", "Kolkata City Pincodes", "Gurgaon Sector Pincodes"
  ];

  return (
    <div className="space-y-16 mt-24 border-t border-slate-100 pt-16">
      {/* FAQ Section with Schema-ready structure */}
      <section>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <HelpCircle size={20} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Frequently Asked Questions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100/50">
              <h3 className="text-lg font-black text-slate-800 mb-4">{faq.q}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Optimized Contextual Content */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Zap size={300} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-8 leading-tight">
            {type === 'search' ? `Everything you need to know about Pincodes in ${context}` : "India's Most Advanced Postal Intelligence Platform"}
          </h2>
          <div className="columns-1 md:columns-2 gap-12 space-y-6 text-slate-300 font-medium leading-relaxed text-lg">
            <p>
              PincodePro is designed for businesses, logistics providers, and citizens who require verified, up-to-date Indian postal information. Our engine connects directly to official Indian postal datasets while enhancing the experience with Gemini AI for natural language detection.
            </p>
            <p>
              Searching for <span className="text-blue-400 font-bold">{context || "postal codes"}</span> is now instantaneous. Unlike traditional directories, we provide locality insights, landmarks, and infrastructure data (Hospitals, Schools) to give you a complete picture of the area.
            </p>
            <p>
              Whether you are looking for a <span className="text-indigo-400 font-bold">sorting district</span> or a remote <span className="text-indigo-400 font-bold">Branch Office (B.O)</span>, our directory covers the entire Indian subcontinent, from the mountains of Ladakh to the coasts of Kanyakumari.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Keyword Cloud for Interlinking */}
      <section>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Popular Postal Searches</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {popularSearches.map((tag, i) => (
            <span key={i} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Footer SEO Text */}
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mt-20">
        PincodePro Directory Index • India Postal Service Mapping • 2025 AI Search Edition
      </div>
    </div>
  );
};
