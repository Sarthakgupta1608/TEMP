import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Zap, ChevronRight } from 'lucide-react';
import type { PageRoute } from '../../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestedAction?: {
    label: string;
    route: PageRoute;
  };
}

interface AIChatbotWidgetProps {
  onNavigate: (route: PageRoute) => void;
}

// Mini Iron Man Helmet SVG Icon Component
const MiniIronManHelmet = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Helmet Contour - Metallic Red */}
    <path
      d="M12 2C7.03 2 3 6.03 3 11V16C3 18.76 5.24 21 8 21H16C18.76 21 21 18.76 21 16V11C21 6.03 16.97 2 12 2Z"
      fill="url(#ironManRed)"
      stroke="#fbbf24"
      strokeWidth="0.8"
    />
    {/* Faceplate - Gold Titanium */}
    <path
      d="M7 9.5C7 8.12 8.12 7 9.5 7H14.5C15.88 7 17 8.12 17 9.5V14.5C17 15.88 15.88 17 14.5 17H9.5C8.12 17 7 15.88 7 14.5V9.5Z"
      fill="url(#ironManGold)"
      stroke="#b45309"
      strokeWidth="0.5"
    />
    {/* Glowing Arc Eyes - Cyan Glow */}
    <rect x="8.5" y="10.5" width="2.5" height="1" rx="0.5" fill="#38bdf8" className="animate-pulse" />
    <rect x="13" y="10.5" width="2.5" height="1" rx="0.5" fill="#38bdf8" className="animate-pulse" />
    {/* Mouth Grill Slot */}
    <path d="M10.5 14H13.5" stroke="#78350f" strokeWidth="0.8" strokeLinecap="round" />
    {/* Gradients */}
    <defs>
      <linearGradient id="ironManRed" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ef4444" />
        <stop offset="0.5" stopColor="#dc2626" />
        <stop offset="1" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="ironManGold" x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.5" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

export const AIChatbotWidget: React.FC<AIChatbotWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Greetings, Boss! 🦾 I am your Mini Iron Man AI (J.A.R.V.I.S. Protocol). Arc Reactor online! Ask me about Sikkim permits, Shimla trips, local quotes, or escrow safety.',
      time: 'Just now',
    },
  ]);

  const quickQuestions = [
    '📍 How to get Nathula Pass permit?',
    '🛡️ How does Razorpay Escrow work?',
    '⛰️ Best time to visit Sikkim & Gangtok?',
    '💡 How to compare agency quotes?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev: Message[]) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Mini Iron Man JARVIS AI Response Simulation
    setTimeout(() => {
      let replyText = 'Scanning systems, Boss! Our verified native agencies provide custom itineraries for Sikkim, Shimla, Manali, and Ladakh.';
      let action: { label: string; route: PageRoute } | undefined;

      const lower = query.toLowerCase();

      if (lower.includes('nathula') || lower.includes('permit')) {
        replyText = 'Tactical Analysis: Nathula Pass permits are issued by Sikkim Tourism for Indian Citizens. Our verified Gangtok agencies handle all permits, PAP passes, and vehicle charges in their itemized quotes!';
        action = { label: 'Deploy AI Trip Request', route: 'ai-planner' };
      } else if (lower.includes('escrow') || lower.includes('razorpay') || lower.includes('payment') || lower.includes('safety')) {
        replyText = 'Ironclad Shield Active! 🛡️ Your funds are locked in Razorpay Escrow. Payout is released to the local agency only after your trip successfully commences.';
        action = { label: 'Inspect Quotes & Escrow', route: 'compare-quotes' };
      } else if (lower.includes('sikkim') || lower.includes('gangtok') || lower.includes('best time') || lower.includes('weather')) {
        replyText = 'Optimal Window Identified: March to June (flowering season) & October to December (crystal clear Kanchenjunga views & snow at Nathula!).';
        action = { label: 'View Sikkim Packages', route: 'packages' };
      } else if (lower.includes('quote') || lower.includes('compare') || lower.includes('price')) {
        replyText = 'Analyzing quotation matrix... 20+ verified local agencies bid with custom itemized quotes. My AI engine ranks hotel star ratings, vehicle model guarantees, and permit inclusions!';
        action = { label: 'Compare 3 Live Quotes', route: 'compare-quotes' };
      } else if (lower.includes('agency') || lower.includes('register') || lower.includes('partner')) {
        replyText = 'Calling native local agencies! Register for free with 0% listing setup fees and receive high-intent customer leads directly!';
        action = { label: 'Register Agency Portal', route: 'become-agency' };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action,
      };

      setMessages((prev: Message[]) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* FLOATING MINI IRON MAN ARC REACTOR BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white shadow-2xl shadow-red-500/50 border-2 border-amber-300 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer"
          aria-label="Open Mini Iron Man AI"
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing Arc Reactor Rings */}
            <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-cyan-400 opacity-75"></span>
            <MiniIronManHelmet className="w-8 h-8 text-amber-300 drop-shadow-md group-hover:rotate-12 transition-transform" />
          </div>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-black tracking-wider text-amber-200 ml-0 group-hover:ml-2.5 uppercase">
            J.A.R.V.I.S. AI
          </span>
        </button>
      )}

      {/* MINI IRON MAN HUD CHATBOT MODAL WINDOW */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden bg-slate-950/95 border-2 border-red-500/50 shadow-2xl shadow-red-500/30 flex flex-col h-[530px] animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-2xl">
          
          {/* IRON MAN METALLIC HUD HEADER */}
          <div className="p-4 bg-gradient-to-r from-red-950 via-slate-950 to-amber-950 text-white flex items-center justify-between border-b border-red-500/40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-500/40 border border-amber-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <MiniIronManHelmet className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-black tracking-wider text-amber-300 uppercase">
                  <span>J.A.R.V.I.S. Mark L</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-cyan-300 font-mono">Arc Reactor • 100% Charged</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-red-500/20 text-amber-300 hover:text-white transition-colors cursor-pointer border border-amber-500/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/90 text-slate-100 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-br-none shadow-md font-bold border border-amber-300/40'
                      : 'bg-slate-900/90 text-slate-100 rounded-bl-none border border-red-500/30 shadow-md font-medium'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Suggested Route Action Button */}
                  {msg.suggestedAction && (
                    <button
                      onClick={() => {
                        onNavigate(msg.suggestedAction!.route);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-500/30 hover:from-red-600/50 hover:to-amber-500/50 text-amber-300 border border-amber-400/50 text-[11px] font-extrabold flex items-center justify-between transition-all cursor-pointer shadow-sm"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-amber-400/70 font-mono mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/40 w-32 shadow-cyan-500/20">
                <Zap className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-[10px] font-mono text-cyan-300">JARVIS Scanning...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK QUESTION CHIPS */}
          {messages.length <= 3 && (
            <div className="p-2.5 bg-slate-900/90 border-t border-red-500/30 flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-cyan-400 hover:text-cyan-300 transition-colors text-left cursor-pointer shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* INPUT FORM */}
          <div className="p-3 bg-slate-950 border-t border-red-500/40 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask JARVIS about Sikkim, quotes, escrow..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow text-xs font-bold bg-slate-900 text-slate-100 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-red-500/30 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-red-500/40 border border-amber-300/40"
            >
              <Send className="w-4 h-4 text-amber-200" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
