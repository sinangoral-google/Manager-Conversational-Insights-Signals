
import React, { useState, useRef, useEffect } from 'react';
import { CompetitiveSignalsCard, CustomerSpendCard, CompetitorRevenueCard } from './components/MarketIntelligence';
import { RelationshipHealthCard, RiskRemediationCard } from './components/RelationshipHealth';
import { NarrativeQualityCard } from './components/StrategyPitch';
import { HeadroomAnalysisCard } from './components/HeadroomOpportunity';

const CATEGORIZED_SIGNALS = [
  {
    category: 'Market intelligence',
    signals: ['Competitor tracking', 'Account spend on competitors', 'Competitor revenue', 'Relationship health']
  },
  {
    category: 'Risk remediation',
    signals: ['Risk remediation']
  },
  {
    category: 'Pitch preparation',
    signals: ['Narrative quality']
  },
  {
    category: 'Opportunity gaps',
    signals: ['Headroom analysis']
  }
];

const ALL_SIGNALS = CATEGORIZED_SIGNALS.flatMap(c => c.signals);

const CustomSignalDropdown: React.FC<{
  selected: string;
  onChange: (signal: string) => void;
  label?: string;
}> = ({ selected, onChange, label = "Signal" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-row items-center gap-[4px] text-[13px]" ref={containerRef}>
      {label && <span className="text-[#474747]">{label}</span>}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-[8px] py-[4px] rounded-[8px] border-[1px] border-[#919191] focus:border-transparent focus:ring-2 ring-[#3271EA] gap-[8px] flex items-center bg-transparent cursor-pointer min-h-[32px] w-[280px] justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="text-[#474747] truncate font-medium">{selected}</span>
          <i className="google-symbols mr-[-4px] ml-auto text-[#474747]">arrow_drop_down</i>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full flex flex-col rounded-[8px] bg-white py-[8px] shadow-[0_4px_8px_3px_rgba(0,0,0,0.15),0_1px_3px_0_rgba(0,0,0,0.30)] z-[1000] min-w-[280px]">
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {CATEGORIZED_SIGNALS.map((group) => (
                <div key={group.category}>
                  <div className="px-[16px] py-[6px] text-[10px] font-bold text-[#919191] uppercase tracking-[0.8px] bg-[#f8f9fa] border-y border-[#f1f3f4]">
                    {group.category}
                  </div>
                  {group.signals.map((signal) => {
                    const isSelected = signal === selected;
                    return (
                      <button
                        key={signal}
                        onClick={() => {
                          onChange(signal);
                          setIsOpen(false);
                        }}
                        className={`flex items-center text-[#202124] justify-start px-[16px] py-[10px] text-[14px] w-full text-left border-none cursor-pointer hover:bg-gray-100 relative ${
                          isSelected ? 'bg-[#E7F2FF]' : ''
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute left-[0px] w-[3px] h-full bg-[#1967D2]" />
                        )}
                        <span className="truncate whitespace-nowrap font-medium">{signal}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeSignal, setActiveSignal] = useState(ALL_SIGNALS[0]);
  const [activeOption, setActiveOption] = useState<'V1' | 'V2'>('V1');

  const renderContent = () => {
    switch (activeSignal) {
      case 'Competitor tracking':
        return <CompetitiveSignalsCard variant={activeOption} />;
      case 'Account spend on competitors':
        return <CustomerSpendCard variant={activeOption} />;
      case 'Competitor revenue':
        return <CompetitorRevenueCard variant={activeOption} />;
      case 'Risk remediation':
        return <RiskRemediationCard variant={activeOption} />;
      case 'Relationship health':
        return <RelationshipHealthCard variant={activeOption} />;
      case 'Narrative quality':
        return <NarrativeQualityCard variant={activeOption} />;
      case 'Headroom analysis':
        return <HeadroomAnalysisCard variant={activeOption} />;
      default:
        return <div className="p-20 text-center text-gray-400 font-medium">Signal implementation pending</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans overflow-x-hidden">
      <nav className="h-20 bg-white border-b border-[#dadce0] px-8 flex items-center justify-between sticky top-0 z-[5000]">
        <div className="flex items-center">
          <CustomSignalDropdown 
            label="Signal" 
            selected={activeSignal} 
            onChange={(signal) => {
              setActiveSignal(signal);
              setActiveOption('V1');
            }} 
          />
        </div>

        <div className="flex bg-[#f1f3f4] p-1 rounded-xl">
          {(['V1', 'V2'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setActiveOption(opt)}
              className={`px-6 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${activeOption === opt ? 'bg-white text-[#1a73e8] shadow-sm' : 'text-[#5f6368] hover:text-[#202124]'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 p-8 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>

      <footer className="p-8 text-center text-[#5f6368] text-[10px] uppercase tracking-[0.3em] pointer-events-none font-medium">
        Conversational Insights for Managers • UXR Testing • Confidential 2026
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 10px; }
        
        /* Smooth page scroll */
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;
