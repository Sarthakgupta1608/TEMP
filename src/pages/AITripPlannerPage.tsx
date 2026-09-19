import React, { useState } from 'react';
import type { PageRoute } from '../types';
import { Sparkles, MapPin, Users, Hotel, CheckCircle2, ArrowRight, Layers, Bot, Cpu, Car } from 'lucide-react';
import { ApiClient } from '../services/apiClient';

interface AITripPlannerPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AITripPlannerPage: React.FC<AITripPlannerPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiComplete, setAiComplete] = useState<boolean>(false);

  // Form State
  const [tripData, setTripData] = useState({
    destination: 'Sikkim & Gangtok',
    dates: '2026-10-15',
    adults: 2,
    children: 0,
    budgetPerHead: 18000,
    hotelPref: '4-Star Mountain View Resort',
    transportPref: 'Private Innova Crysta SUV',
    activities: ['Nathula Pass Permit', 'Tsomgo Lake Excursion', 'Yumthang Valley'],
    specialNote: 'Traveling for wedding anniversary. Prefer peaceful resort with balcony mountain view.',
  });

  const handleRunAI = async () => {
    setIsProcessing(true);
    await ApiClient.createTripRequest(tripData);
    setIsProcessing(false);
    setAiComplete(true);
  };

  const hotelOptions = [
    { label: '3-Star Deluxe Hotel', stars: 3, icon: '⭐' },
    { label: '4-Star Mountain View Resort', stars: 4, icon: '🏔️' },
    { label: '5-Star Luxury Heritage Resort', stars: 5, icon: '👑' },
    { label: 'Authentic Homestay', stars: 3, icon: '🏡' },
  ];

  const transportOptions = [
    { label: 'Private Innova Crysta SUV', desc: 'Dedicated Driver & AC' },
    { label: 'Private Mahindra Xylo / Scorpio', desc: '4x4 Mountain Terrain' },
    { label: 'Private Sedan (Dzire / Etios)', desc: 'Comfort City Cab' },
    { label: 'Shared AC Volvo Bus', desc: 'Budget Group Transport' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-rose-500/30 text-xs font-bold text-rose-600 dark:text-rose-400 shadow-md">
          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
          <span>OpenAI Powered Intent Extractor</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customize Your Trip <span className="ai-gradient-text">Wizard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Specify your preferences. Our AI structures your exact request and broadcasts it directly to verified native destination agencies.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -z-10" />
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`w-10 h-10 rounded-full font-extrabold text-xs flex items-center justify-center transition-all cursor-pointer ${
              step >= num
                ? 'ai-gradient-bg text-white shadow-lg shadow-purple-500/25 scale-110'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
            }`}
            onClick={() => setStep(num)}
          >
            {step > num ? <CheckCircle2 className="w-5 h-5 text-white" /> : num}
          </div>
        ))}
      </div>

      {/* WIZARD CARD CONTAINER */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-8">
        
        {/* STEP 1: DESTINATION & DATES */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" /> 1. Target Destination & Interactive Calendar
              </h3>
              <span className="text-xs font-bold text-slate-400">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Target Destination Region
                </label>
                <select
                  value={tripData.destination}
                  onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                  className="w-full bg-transparent text-slate-900 dark:text-white text-sm font-extrabold focus:outline-none cursor-pointer"
                >
                  <option value="Sikkim & Gangtok" className="dark:bg-slate-900">Sikkim & Gangtok (Pilot Region)</option>
                  <option value="Shimla & Kufri" className="dark:bg-slate-900">Shimla & Kufri (Pilot Region)</option>
                  <option value="Manali & Solang" className="dark:bg-slate-900">Manali & Solang Valley</option>
                  <option value="Leh Ladakh" className="dark:bg-slate-900">Leh Ladakh</option>
                </select>
              </div>

              {/* INTERACTIVE DATE SELECTOR */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Select Travel Date (Interactive Calendar)
                </label>
                <input
                  type="date"
                  value={tripData.dates}
                  onChange={(e) => setTripData({ ...tripData, dates: e.target.value })}
                  className="w-full bg-transparent text-slate-900 dark:text-white text-sm font-extrabold focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-7 py-3.5 rounded-2xl text-xs font-extrabold text-white btn-primary-glow flex items-center gap-2 cursor-pointer"
              >
                <span>Next: Group & Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GROUP SIZE & BUDGET */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> 2. Group Size & Budget Per Head
              </h3>
              <span className="text-xs font-bold text-slate-400">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1">Adults (12+ yrs)</label>
                <input
                  type="number"
                  min={1}
                  value={tripData.adults}
                  onChange={(e) => setTripData({ ...tripData, adults: Number(e.target.value) })}
                  className="w-full bg-transparent text-slate-900 dark:text-white text-lg font-black focus:outline-none"
                />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1">Children (Under 12 yrs)</label>
                <input
                  type="number"
                  min={0}
                  value={tripData.children}
                  onChange={(e) => setTripData({ ...tripData, children: Number(e.target.value) })}
                  className="w-full bg-transparent text-slate-900 dark:text-white text-lg font-black focus:outline-none"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">Max Budget Limit Per Head</span>
                <span className="text-rose-600 dark:text-rose-400 text-lg font-black">₹{tripData.budgetPerHead.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={40000}
                step={2000}
                value={tripData.budgetPerHead}
                onChange={(e) => setTripData({ ...tripData, budgetPerHead: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">Back</button>
              <button onClick={() => setStep(3)} className="px-7 py-3.5 rounded-2xl text-xs font-extrabold text-white btn-primary-glow flex items-center gap-2 cursor-pointer">
                <span>Next: Stay & Transport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: STAY & TRANSPORT PREFERENCE CHIPS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Hotel className="w-5 h-5 text-purple-500" /> 3. Stay Category & Transport Vehicle
              </h3>
              <span className="text-xs font-bold text-slate-400">Step 3 of 4</span>
            </div>

            {/* Hotel Preference Interactive Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Select Hotel Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotelOptions.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => setTripData({ ...tripData, hotelPref: opt.label })}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                      tripData.hotelPref === opt.label
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-md font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    {tripData.hotelPref === opt.label && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Vehicle Interactive Chips */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-blue-500" /> Select Transport Vehicle
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {transportOptions.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => setTripData({ ...tripData, transportPref: opt.label })}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                      tripData.transportPref === opt.label
                        ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 shadow-md font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{opt.desc}</div>
                    </div>
                    {tripData.transportPref === opt.label && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">Back</button>
              <button onClick={() => setStep(4)} className="px-7 py-3.5 rounded-2xl text-xs font-extrabold text-white btn-primary-glow flex items-center gap-2 cursor-pointer">
                <span>Next: AI Extraction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SPECIAL NOTES & AI PROCESSING */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" /> 4. AI Structured Intent Extraction
              </h3>
              <span className="text-xs font-bold text-slate-400">Step 4 of 4</span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase mb-2">Special Requests or Notes for Native Agencies</label>
              <textarea
                rows={3}
                value={tripData.specialNote}
                onChange={(e) => setTripData({ ...tripData, specialNote: e.target.value })}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* LIVE AI INTENT JSON SPEC BOX */}
            <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 space-y-3 text-xs font-mono border border-purple-500/40 shadow-2xl">
              <div className="flex items-center justify-between text-purple-400 font-extrabold border-b border-slate-800 pb-2.5">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-rose-400" /> OpenAI Structured TripSpecJSON
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-700 font-bold">Validated</span>
              </div>
              <pre className="overflow-x-auto text-[11px] text-emerald-400 font-mono leading-relaxed">
                {JSON.stringify({
                  destination: tripData.destination,
                  dates: tripData.dates,
                  pax: { adults: tripData.adults, children: tripData.children },
                  budget_per_head_inr: tripData.budgetPerHead,
                  stay: tripData.hotelPref,
                  vehicle: tripData.transportPref,
                  special_note: tripData.specialNote,
                }, null, 2)}
              </pre>
            </div>

            {aiComplete ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Broadcast Sent to 22 Verified Sikkim Agencies!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Agencies are reviewing your structured spec. 3 live itemized quotations are already available for side-by-side AI comparison!
                </p>
                <button
                  onClick={() => onNavigate('compare-quotes')}
                  className="px-8 py-4 rounded-2xl text-xs font-extrabold text-white btn-primary-glow shadow-xl active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare 3 Live Quotations Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(3)} className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">Back</button>
                <button
                  onClick={handleRunAI}
                  disabled={isProcessing}
                  className="px-8 py-4 rounded-2xl text-xs font-extrabold text-white btn-primary-glow active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Structuring Intent & Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Execute AI Spec Extraction</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
