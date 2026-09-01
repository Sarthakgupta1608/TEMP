import React, { useState } from 'react';
import type { PageRoute } from '../types';
import { Sparkles, MapPin, Users, Hotel, CheckCircle2, ArrowRight, Layers, Bot, Cpu } from 'lucide-react';

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
    dates: '15th Oct – 20th Oct 2026',
    adults: 2,
    children: 0,
    budgetPerHead: 18000,
    hotelPref: '4-Star Mountain View Resort',
    transportPref: 'Private Innova Crysta SUV',
    activities: ['Nathula Pass Permit', 'Tsomgo Lake Excursion', 'Yumthang Valley'],
    specialNote: 'Traveling for wedding anniversary. Prefer peaceful resort with balcony mountain view.',
  });

  const handleRunAI = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAiComplete(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-purple-600 dark:text-purple-400">
          <Sparkles className="w-4 h-4 animate-spin-slow" /> OpenAI Powered Trip Intent Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          AI Trip Request <span className="ai-gradient-text">Wizard</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Specify your preferences. Our AI will structure your request and broadcast it exclusively to verified local agencies in your destination.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
              step >= num
                ? 'ai-gradient-bg text-white shadow-lg shadow-purple-500/20 scale-110'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}
          >
            {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
          </div>
        ))}
      </div>

      {/* WIZARD CARD CONTAINER */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border-gray-200/80 dark:border-gray-800 shadow-2xl space-y-8">
        
        {/* STEP 1: DESTINATION & DATES */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" /> 1. Destination & Preferred Dates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Target Destination</label>
                <select
                  value={tripData.destination}
                  onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold focus:outline-none"
                >
                  <option value="Sikkim & Gangtok">Sikkim & Gangtok (Pilot Region)</option>
                  <option value="Shimla & Kufri">Shimla & Kufri (Pilot Region)</option>
                  <option value="Manali & Solang">Manali & Solang Valley</option>
                  <option value="Leh Ladakh">Leh Ladakh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Travel Window / Month</label>
                <input
                  type="text"
                  value={tripData.dates}
                  onChange={(e) => setTripData({ ...tripData, dates: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                Next: Group & Budget <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GROUP SIZE & BUDGET */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> 2. Group Size & Budget Limit
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2">Adults (12+ yrs)</label>
                <input
                  type="number"
                  min={1}
                  value={tripData.adults}
                  onChange={(e) => setTripData({ ...tripData, adults: Number(e.target.value) })}
                  className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">Children (Under 12 yrs)</label>
                <input
                  type="number"
                  min={0}
                  value={tripData.children}
                  onChange={(e) => setTripData({ ...tripData, children: Number(e.target.value) })}
                  className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Max Budget Per Head</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">₹{tripData.budgetPerHead.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={40000}
                step={2000}
                value={tripData.budgetPerHead}
                onChange={(e) => setTripData({ ...tripData, budgetPerHead: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-xs font-bold text-gray-500">Back</button>
              <button onClick={() => setStep(3)} className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                Next: Stay & Transport <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: STAY & TRANSPORT PREFERENCE */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Hotel className="w-5 h-5 text-rose-500" /> 3. Stay & Transport Preferences
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2">Hotel Category</label>
                <select
                  value={tripData.hotelPref}
                  onChange={(e) => setTripData({ ...tripData, hotelPref: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold"
                >
                  <option value="3-Star Deluxe Hotel">3-Star Deluxe Hotel</option>
                  <option value="4-Star Mountain View Resort">4-Star Mountain View Resort</option>
                  <option value="5-Star Luxury Heritage Resort">5-Star Luxury Heritage Resort</option>
                  <option value="Authentic Homestay">Authentic Sikkimese/Himachali Homestay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">Vehicle Type</label>
                <select
                  value={tripData.transportPref}
                  onChange={(e) => setTripData({ ...tripData, transportPref: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold"
                >
                  <option value="Private Innova Crysta SUV">Private Innova Crysta SUV (Dedicated Driver)</option>
                  <option value="Private Mahindra Xylo / Scorpio">Private Mahindra Xylo / Scorpio (4x4)</option>
                  <option value="Private Sedan (Dzire / Etios)">Private Sedan (Dzire / Etios)</option>
                  <option value="Shared AC Volvo Bus">Shared AC Volvo Bus</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-xs font-bold text-gray-500">Back</button>
              <button onClick={() => setStep(4)} className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                Next: AI Extraction <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SPECIAL NOTES & AI PROCESSING */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" /> 4. AI Structured Spec Extraction
            </h3>

            <div>
              <label className="block text-xs font-bold mb-2">Special Requests or Notes for Agencies</label>
              <textarea
                rows={3}
                value={tripData.specialNote}
                onChange={(e) => setTripData({ ...tripData, specialNote: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
              />
            </div>

            {/* LIVE AI INTENT JSON SPEC BOX */}
            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 space-y-2 text-xs font-mono border border-purple-500/30">
              <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> OpenAI Structured TripSpecJSON
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700">Validated</span>
              </div>
              <pre className="overflow-x-auto text-[11px] text-emerald-400">
                {JSON.stringify({
                  destination: tripData.destination,
                  pax: { adults: tripData.adults, children: tripData.children },
                  budget_per_head_inr: tripData.budgetPerHead,
                  stay: tripData.hotelPref,
                  vehicle: tripData.transportPref,
                  special_note: tripData.specialNote,
                }, null, 2)}
              </pre>
            </div>

            {aiComplete ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base text-gray-900 dark:text-white">Broadcast Sent to 22 Verified Sikkim Agencies!</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Agencies are analyzing your spec and creating itemized quotations. 3 quotes are already available for side-by-side comparison!
                </p>
                <button
                  onClick={() => onNavigate('compare-quotes')}
                  className="px-8 py-3.5 rounded-2xl text-xs font-bold text-white ai-gradient-bg shadow-xl active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare 3 Live Quotations Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(3)} className="text-xs font-bold text-gray-500">Back</button>
                <button
                  onClick={handleRunAI}
                  disabled={isProcessing}
                  className="px-8 py-4 rounded-2xl text-xs font-bold text-white ai-gradient-bg shadow-xl shadow-purple-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Structuring Intent & Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
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
