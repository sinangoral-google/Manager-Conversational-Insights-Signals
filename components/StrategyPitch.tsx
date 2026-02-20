
import React, { useState, useMemo, useEffect } from 'react';
import { Card, SectionHeader, CardFooter, CardFilters, ConnectAIAlert, Badge, CompanyLogo } from './Shared';

const getDateMultiplier = (range: string) => {
  switch (range) {
    case 'Last 7 days': return 0.23;
    case 'Last 90 days': return 2.8;
    case 'Last 12 months': return 11.5;
    default: return 1.0; // Last 30 days
  }
};

const MOCK_PITCHES = [
  { company: 'Red Bull', name: 'AI Max Acceleration', resonance: 'High', sentiment: 'Positive', stage: 'Agreed', citations: ['#912', '#918'], opp: 'Q4 Performance Upsell', feedback: "The client loved the GenAI mockups but had severe reservations about the cost-per-click floor in the new bidding model." },
  { company: 'Red Bull', name: 'Smart Bidding Clarity', resonance: 'Medium', sentiment: 'Neutral', stage: 'Pitched', citations: ['#844'], opp: 'Core Optimization', feedback: "Questioning incremental value vs legacy manual controls in the current dashboard." },
  { company: 'Disney', name: 'AI Max Acceleration', resonance: 'Low', sentiment: 'Negative', stage: 'Pitched', citations: ['#811'], opp: 'Media Mix Opt', feedback: "Concerned about loss of creative control for brand-heavy cinematic assets." },
  { company: 'McDonald\'s', name: 'Demand Gen Launch', resonance: 'High', sentiment: 'Positive', stage: 'Agreed', citations: ['#990'], opp: 'Mobile App Drive', feedback: "Direct alignment with the 'Late Night' promo roadmap and influencer strategy." },
  { company: 'Burger King', name: 'Smart Bidding Clarity', resonance: 'High', sentiment: 'Positive', stage: 'Agreed', citations: ['#712'], opp: 'Regional Efficiency', feedback: "High interest in regional dashboard transparency." },
  { company: 'Dr Pepper', name: 'GenAI Creative Trial', resonance: 'Medium', sentiment: 'Neutral', stage: 'Pitched', citations: ['#612'], opp: 'Creative Refresh', feedback: "Evaluation phase for new brand-safe AI generated static assets." },
];

export const NarrativeQualityCard: React.FC<{ variant: 'V1' | 'V2' }> = ({ variant }) => {
  const [company, setCompany] = useState('All accounts');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => setIsRefreshing(false), 400);
    return () => clearTimeout(timer);
  }, [company, dateRange, variant]);

  const filteredData = useMemo(() => {
    let base = MOCK_PITCHES;
    if (company !== 'All accounts') {
      base = MOCK_PITCHES.filter(item => item.company === company);
      if (base.length === 0) base = [MOCK_PITCHES[0]];
    }
    return base;
  }, [company, dateRange]);

  const resonanceSummary = useMemo(() => {
    const mult = getDateMultiplier(dateRange);
    const count = Math.round(30 * mult);
    return company === 'All accounts' 
      ? `Performance Max narratives are resonating well across the portfolio, showing ${count}% improvement over ${dateRange}.` 
      : `Feedback loop for ${company} in ${dateRange} indicates ${filteredData[0].resonance} resonance for active narratives.`;
  }, [company, dateRange, filteredData]);

  return (
    <Card>
      <SectionHeader 
        title="Narrative quality" 
        tooltip="Measuring how effectively product narratives resonate with specific customer pain points."
        filterContent={<CardFilters company={company} setCompany={setCompany} dateRange={dateRange} setDateRange={setDateRange} />}
      />
      <div className={`px-6 py-6 flex flex-col gap-6 ${isRefreshing ? 'animate-refresh' : ''}`}>
        {variant === 'V1' ? (
          <div className="space-y-4">
             {filteredData.map((n, idx) => (
               <div key={idx} className="p-4 border border-[#DADCE0] rounded-xl flex items-center justify-between hover:bg-[#F8F9FA] transition-all shadow-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CompanyLogo name={n.company} />
                      <h4 className="text-[15px] font-bold text-[#202124] truncate">{n.name}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[12px] text-[#5F6368]">Resonance: <span className="font-bold text-[#202124]">{n.resonance}</span></span>
                       <span className="text-[12px] text-[#5F6368]">Sentiment: <span className={`font-bold ${n.sentiment === 'Positive' ? 'text-[#1e8e3e]' : (n.sentiment === 'Negative' ? 'text-[#d93025]' : 'text-[#f9ab00]')}`}>{n.sentiment}</span></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge type={n.stage === 'Agreed' ? 'success' : 'info'}>{n.stage}</Badge>
                    <p className="text-[11px] text-[#5F6368] mt-1 italic">{n.opp}</p>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4 mb-4">
               {['Planned', 'Pitched', 'Agreed', 'Closed'].map((s, i) => (
                 <div key={s} className="flex flex-col items-center gap-2">
                    <div className={`w-full h-1.5 rounded-full ${['Planned', 'Pitched', 'Agreed'].includes(s) ? 'bg-[#1a73e8]' : 'bg-[#DADCE0]'}`} />
                    <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">{s}</span>
                 </div>
               ))}
            </div>
            {filteredData.map((n, idx) => (
              <div key={idx} className="p-5 border border-[#DADCE0] rounded-2xl bg-white shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CompanyLogo name={n.company} />
                    <h4 className="text-[16px] font-bold text-[#202124]">{n.name} Feedback</h4>
                  </div>
                  <div className="flex gap-2">
                    {n.citations.map(c => <span key={c} className="text-[11px] px-2 py-0.5 bg-gray-100 rounded text-[#5F6368]">Source: {c}</span>)}
                  </div>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E8EAED] italic text-[14px] text-[#202124] leading-relaxed">
                  "{n.feedback}"
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <ConnectAIAlert content={resonanceSummary} />
        </div>
      </div>
      <CardFooter />
    </Card>
  );
};
