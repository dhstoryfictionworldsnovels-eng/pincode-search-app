
import React, { useState, useEffect } from 'react';
import { SearchBox } from './components/SearchBox';
import { ResultList } from './components/ResultList';
import { DetailModal } from './components/DetailModal';
import { AdSlot } from './components/AdSlot';
import { ChatSupport } from './components/ChatSupport';
import { ReferralSystem } from './components/ReferralSystem';
import { SEOContent } from './components/SEOContent';
import { PincodeData, AppView } from './types';
import { SAMPLE_DATA, INDIAN_STATES, STATE_DISTRICTS } from './constants';
import { processNaturalQuery } from './services/geminiService';
import { MailCheck, Globe, Zap, ChevronRight, BookOpen, Search as SearchIcon, MapPin, Building2, Star, TrendingUp, History, BrainCircuit, ShieldCheck, FileText, Info, HelpCircle, Loader2, Share2, Navigation, MessageSquare, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [results, setResults] = useState<PincodeData[]>(SAMPLE_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<PincodeData | null>(null);
  const [searchContext, setSearchContext] = useState<string>('');
  const [activeState, setActiveState] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<string>('');

  // Dynamic SEO Metadata Update
  useEffect(() => {
    let title = "PincodePro | India's #1 AI-Powered Postal Search Engine";
    let description = "Search every Pincode, Mandal, and District in India with PincodePro. AI-enhanced postal directory with real-time news and infrastructure.";

    if (view === 'directory') {
      title = "India Pincode Directory | Browse by State & District";
      description = "Complete directory of Indian postal codes. Browse all 28 states and 8 union territories to find local pincodes and office details.";
    } else if (view === 'referral') {
      title = "PincodePro Rewards | Refer Friends & Get Pro Features";
      description = "Join the PincodePro referral program. Invite friends and unlock advanced postal analytics and an ad-free experience.";
    } else if (lastSearch) {
      title = `Pincodes in ${lastSearch} | Postal Details & Map | PincodePro`;
      description = `Find all postal codes, post offices, and local insights for ${lastSearch}. Detailed infrastructure and delivery status included.`;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, lastSearch]);

  const handleSearch = async (query: string, isAI: boolean = false) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setView('home');
    setSearchContext('');
    setLastSearch(query);
    
    let searchTerm = query.trim();
    let mode: 'pincode' | 'postoffice' = /^\d{6}$/.test(searchTerm) ? 'pincode' : 'postoffice';

    if (isAI || (mode === 'postoffice' && searchTerm.split(' ').length > 1)) {
      setIsAIProcessing(true);
      const aiResult = await processNaturalQuery(searchTerm);
      if (aiResult) {
        searchTerm = aiResult.query;
        mode = aiResult.detectedType === 'pincode' ? 'pincode' : 'postoffice';
        setSearchContext(aiResult.explanation);
      }
      setIsAIProcessing(false);
    }

    try {
      const response = await fetch(`https://api.postalpincode.in/${mode}/${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (data && data[0]?.Status === 'Success') {
        const offices = data[0].PostOffice.map((po: any) => ({
          pincode: po.Pincode,
          officeName: po.Name,
          officeType: po.BranchType,
          deliveryStatus: po.DeliveryStatus,
          divisionName: po.Division,
          regionName: po.Region,
          circleName: po.Circle,
          district: po.District,
          state: po.State,
          block: po.Block
        }));
        setResults(offices);
        
        if (offices.length === 1) {
          setSelectedPincode(offices[0]);
        } else {
          const resultsSection = document.getElementById('search-results');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } else {
        setResults([]);
        setSearchContext(prev => prev ? `${prev} (No records found in official database)` : 'No official records found for this query.');
      }
    } catch (e) {
      console.error("Search API Error:", e);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1`);
          const data = await res.json();
          const q = data.address?.postcode || data.address?.suburb || data.address?.city;
          if (q) await handleSearch(q, true);
        } catch (err) {
          console.error("Reverse Geocode Error:", err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation Error:", err);
        setIsLocating(false);
      }
    );
  };

  const handleShareLiveLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      const text = `Check my live location on PincodePro: ${link}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    });
  };

  const renderBreadcrumbs = () => (
    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <button onClick={() => setView('home')} className="hover:text-blue-600 transition-colors">Home</button>
      <ChevronRight size={12} />
      {view === 'directory' ? (
        <span className="text-slate-900">Directory</span>
      ) : view === 'referral' ? (
        <span className="text-slate-900">Referral Program</span>
      ) : lastSearch ? (
        <div className="flex items-center gap-2">
          <span className="text-slate-900">Search Results</span>
          <ChevronRight size={12} />
          <span className="text-blue-600 lowercase font-bold">{lastSearch}</span>
        </div>
      ) : (
        <span className="text-slate-900">Discovery</span>
      )}
    </nav>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-1000">
      <section className="pt-24 pb-16 px-4 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent relative">
        <div className="max-w-6xl mx-auto">
          <AdSlot type="banner" className="h-20 mb-12 max-w-4xl mx-auto" />
          
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 shadow-xl shadow-blue-50 mb-12">
            <Zap size={14} className="fill-blue-600 animate-pulse" />
            AI-Neural Postal Engine 2025
          </div>
          <h1 className="text-[5rem] md:text-[8rem] font-black text-slate-900 leading-[0.8] tracking-[-0.05em] mb-12">
            Master India <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">Postcodes.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            The professional directory for verified Pincodes, Landmarks, and Infrastructure insights across 28 States & UTs.
          </p>
          <SearchBox onSearch={handleSearch} onNearMe={handleNearMe} isLocating={isLocating} isAIProcessing={isAIProcessing} />
          
          <div className="mt-12 flex justify-center gap-4">
            <button 
              onClick={handleShareLiveLocation}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
            >
              <Navigation size={16} /> Share Live Location
            </button>
          </div>

          {isAIProcessing && (
            <div className="mt-10 flex items-center justify-center gap-3 text-blue-600 font-black text-[10px] uppercase bg-blue-50 py-3 px-6 rounded-full border border-blue-100 max-w-fit mx-auto animate-pulse">
              <Loader2 size={14} className="animate-spin" /> Deep Neural Analysis...
            </div>
          )}

          {searchContext && !isAIProcessing && (
            <div className="mt-10 flex items-center justify-center gap-3 text-purple-600 font-black text-[11px] uppercase bg-purple-50 py-3.5 px-8 rounded-full border border-purple-100 max-w-2xl mx-auto shadow-sm animate-in slide-in-from-top-4">
              <BrainCircuit size={16} className="text-purple-500 shrink-0" /> 
              <span className="leading-tight">{searchContext}</span>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
             <div id="search-results" className="scroll-mt-32">
                {renderBreadcrumbs()}
                <AdSlot type="banner" className="h-24 mb-10" />
                {results.length > 0 ? (
                  <>
                    <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-10">
                      <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200"><Globe size={32} /></div>
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter">Official Database</h2>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Found {results.length} Verified Entries</p>
                      </div>
                    </div>
                    <ResultList results={results} isLoading={isLoading} onSelect={setSelectedPincode} />
                  </>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                     {isLoading ? (
                       <Loader2 size={64} className="text-blue-200 animate-spin mb-4" />
                     ) : (
                       <History size={64} className="text-slate-200 mb-4" />
                     )}
                     <p className="text-slate-400 font-black uppercase tracking-widest">{isLoading ? 'Neural Uplink...' : 'No Active Searches'}</p>
                  </div>
                )}

                {/* SEO-Rich Content Section */}
                {!isLoading && results.length > 0 && (
                  <div className="mt-24">
                    <SEOContent type="search" context={lastSearch} />
                  </div>
                )}
                
                {/* Home Page FAQ Section (only when no search) */}
                {!lastSearch && !isLoading && (
                  <div className="mt-24">
                    <SEOContent type="home" />
                  </div>
                )}
             </div>
          </div>
          
          <div className="space-y-8">
            <AdSlot type="sidebar" className="h-64" />
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8"><TrendingUp size={16} /> Hot Zones</h3>
              <div className="space-y-4">
                {['560001', '400001', '110001', '600001'].map(p => (
                  <button key={p} onClick={() => handleSearch(p)} className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                    <span className="font-black tracking-widest">{p}</span>
                    <ChevronRight size={16} className="text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Invite Friends</h3>
               <p className="text-sm text-indigo-100 font-medium mb-8">Share the app and unlock premium features for free.</p>
               <button onClick={() => setView('referral')} className="w-full py-4 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Open Referral Center</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderStaticPage = (title: string, icon: React.ReactNode, content: React.ReactNode) => (
    <section className="max-w-4xl mx-auto px-4 py-24 animate-in slide-in-from-bottom-10">
      <div className="flex items-center gap-6 mb-16">
        <div className="p-5 bg-blue-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-100">
          {icon}
        </div>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">{title}</h2>
      </div>
      <div className="prose prose-slate max-w-none bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm leading-relaxed text-slate-600 font-medium">
        {content}
      </div>
    </section>
  );

  const renderDirectory = () => (
    <section className="max-w-7xl mx-auto px-4 py-24 animate-in slide-in-from-bottom-10">
      <div className="mb-20">
        {renderBreadcrumbs()}
        <h2 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">India Directory</h2>
        <p className="text-xl text-slate-500 font-medium max-w-2xl">Browse the world's largest postal network by administrative hierarchy. Detailed pincode data for every Indian district.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {INDIAN_STATES.map(state => (
          <button 
            key={state}
            onClick={() => setActiveState(state === activeState ? null : state)}
            className={`p-8 rounded-[2rem] text-left transition-all border-2 relative overflow-hidden group ${activeState === state ? 'bg-blue-600 border-blue-600 text-white shadow-2xl' : 'bg-white border-slate-50 text-slate-900 hover:border-blue-500 hover:shadow-xl'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">State Code</span>
            <span className="text-lg font-black leading-tight block pr-4">{state}</span>
            <div className={`absolute bottom-4 right-4 transition-transform ${activeState === state ? 'rotate-90' : ''}`}>
              <ChevronRight size={20} />
            </div>
          </button>
        ))}
      </div>

      {activeState && (
        <div className="mt-16 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-4 mb-12">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><MapPin size={24} /></div>
             <h3 className="text-3xl font-black">Districts in {activeState}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {STATE_DISTRICTS[activeState]?.map(dist => (
              <button 
                key={dist} 
                onClick={() => handleSearch(dist)}
                className="py-4 px-6 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-left"
              >
                {dist}
              </button>
            )) || <p className="text-slate-400 italic">Districts loading...</p>}
          </div>
        </div>
      )}

      <div className="mt-32">
        <SEOContent type="directory" />
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-['Inter'] selection:bg-blue-600 selection:text-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 h-24">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => { setView('home'); setLastSearch(''); }}>
            <div className="w-12 h-12 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 group-hover:scale-110 transition-transform">
              <MailCheck size={28} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter block leading-none">PINCODE<span className="text-blue-600">PRO</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button onClick={() => setView('home')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'home' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Search</button>
            <button onClick={() => setView('directory')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'directory' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>States</button>
            <button onClick={() => setView('referral')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'referral' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Referral</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Get Pro API</button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {view === 'home' && renderHome()}
        {view === 'directory' && renderDirectory()}
        {view === 'referral' && <ReferralSystem />}
        {view === 'privacy' && renderStaticPage('Privacy Policy', <ShieldCheck size={32} />, (
          <div className="space-y-6">
            <p>Your privacy is important to us. This policy outlines how PincodePro collects and uses data.</p>
            <h3 className="text-xl font-black text-slate-900">1. Data Collection</h3>
            <p>We do not store personal identification data. Geolocation and voice data are used locally to process searches and are not transmitted to our servers for storage.</p>
            <h3 className="text-xl font-black text-slate-900">2. Cookies</h3>
            <p>We use essential cookies to maintain user preferences and Google AdSense for advertisement delivery.</p>
          </div>
        ))}
        {view === 'terms' && renderStaticPage('Terms of Service', <FileText size={32} />, (
          <div className="space-y-6">
            <p>By using PincodePro, you agree to these terms.</p>
            <h3 className="text-xl font-black text-slate-900">1. Usage</h3>
            <p>The data provided is for informational purposes only. While we strive for accuracy, we do not guarantee the validity of the postal records.</p>
            <h3 className="text-xl font-black text-slate-900">2. Prohibited Use</h3>
            <p>Scraping our AI-enhanced infrastructure data for commercial use without an API license is strictly prohibited.</p>
          </div>
        ))}
        {view === 'about' && renderStaticPage('About Us', <Info size={32} />, (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-blue-600">The Mission</h2>
            <p className="text-lg font-bold text-slate-800 italic">"Making India's vast geography accessible to every citizen via 6-digit intelligence."</p>
            <p>PincodePro was founded in 2024 to bridge the gap between simple postal data and real-world area intelligence. We process millions of queries daily to help logistics partners and citizens navigate the sub-continent.</p>
          </div>
        ))}
        {view === 'guidelines' && renderStaticPage('Guidelines', <HelpCircle size={32} />, (
          <div className="space-y-6">
            <p>How to get the most out of PincodePro:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Natural Search:</strong> You can speak to the search bar like a human (e.g., "Find me Charminar's pincode").</li>
              <li><strong>Mandal/Block:</strong> Use the block name for rural areas for more precise results.</li>
              <li><strong>Infrastructure:</strong> Always click into the area profile to see nearby hospitals and landmarks.</li>
            </ul>
          </div>
        ))}
      </main>

      <footer className="bg-slate-950 text-white py-24 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><MailCheck size={24} /></div>
              <span className="text-2xl font-black tracking-tighter uppercase">PincodePro</span>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">The most trusted AI-powered postal directory. Official records and neural locality insights.</p>
            <div className="mt-10 flex gap-4">
               <button 
                 onClick={() => {
                   const text = "Discover India's postal network with PincodePro!";
                   window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                 }}
                 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-xl"
               >
                 <Share2 size={14} /> Share App
               </button>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-8">Platform</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><button onClick={() => setView('about')} className="hover:text-white">About Us</button></li>
              <li><button onClick={() => setView('guidelines')} className="hover:text-white">Guidelines</button></li>
              <li><button onClick={() => setView('directory')} className="hover:text-white">Directory</button></li>
              <li><button onClick={() => setView('referral')} className="hover:text-white">Refer & Earn</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-8">Legal</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><button onClick={() => setView('privacy')} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => setView('terms')} className="hover:text-white">Terms & Conditions</button></li>
              <li><a href="#" className="hover:text-white">Sitemap</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">© 2025 PincodePro Media. Optimized for Google Search Rankings.</p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <span>Powered by Gemini 3</span>
            <span>Made in India</span>
          </div>
        </div>
      </footer>

      <ChatSupport />
      {selectedPincode && <DetailModal item={selectedPincode} onClose={() => setSelectedPincode(null)} />}
    </div>
  );
};

export default App;
