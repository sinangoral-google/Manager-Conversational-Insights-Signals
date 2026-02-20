
import React, { useState, useMemo, useEffect } from 'react';
import { Card, SectionHeader, CardFooter, CardFilters, CompanyLogo, ConnectAIAlert, Badge } from './Shared';

const getDateMultiplier = (range: string) => {
  switch (range) {
    case 'Last 7 days': return 0.23;
    case 'Last 90 days': return 2.8;
    case 'Last 12 months': return 11.5;
    default: return 1.0; // Last 30 days
  }
};

const MOCK_WINS = [
  { company: 'Red Bull', context: 'Holiday Campaign Planning', budgetRaw: 2.5, outcome: 'Total market domination in energy vertical via AI Max.', exec: 'VP Marketing present', citations: ['#901'] },
  { company: 'McDonald\'s', context: 'Annual Service Review', budgetRaw: 0.8, outcome: 'Full-funnel attribution across 4,000 stores globally.', exec: 'CMO attended via Zoom', citations: ['#915'] },
  { company: 'Disney', context: 'Content Scale Win', budgetRaw: 1.2, outcome: 'Dominating cinematic discovery through interactive Reels units.', exec: 'VP Digital', citations: ['#821'] },
];

const MOCK_ALERTS = [
  { company: 'Disney', context: 'Streaming Upsell Discussion', valueRaw: 1.2, ambitious: 'Standard renewal only discussed; no cross-channel pitch attempted.', exec: 'No C-suite present', citations: ['#884'] },
  { company: 'Burger King', context: 'Q4 Budget Lock', valueRaw: 0.22, ambitious: 'Regional focus only; missed national expansion headroom.', exec: 'Manager level', citations: ['#744'] },
  { company: 'Dr Pepper', context: 'Strategic QBR', valueRaw: 0.45, ambitious: 'Status quo performance only; missed new product launch headroom.', exec: 'Director level', citations: ['#615'] },
];

export const HeadroomAnalysisCard: React.FC<{ variant: 'V1' | 'V2' }> = ({ variant }) => {
  const [company, setCompany] = useState('All accounts');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => setIsRefreshing(false), 400);
    return () => clearTimeout(timer);
  }, [company, dateRange, variant]);

  const filteredWins = useMemo(() => {
    const mult = getDateMultiplier(dateRange);
    let base = MOCK_WINS;
    if (company !== 'All accounts') {
      base = MOCK_WINS.filter(item => item.company === company);
      if (base.length === 0) base = [MOCK_WINS[0]];
    }
    return base.map(item => ({
      ...item,
      budget: `+$${(item.budgetRaw * mult).toFixed(1)}M`
    }));
  }, [company, dateRange]);

  const filteredAlerts = useMemo(() => {
    const mult = getDateMultiplier(dateRange);
    let base = MOCK_ALERTS;
    if (company !== 'All accounts') {
      base = MOCK_ALERTS.filter(item => item.company === company);
      if (base.length === 0) base = [MOCK_ALERTS[0]];
    }
    return base.map(item => ({
      ...item,
      value: `$${(item.valueRaw * mult).toFixed(1)}M Gap`
    }));
  }, [company, dateRange]);

  return (
    <Card>
      <SectionHeader 
        title="Headroom analysis" 
        tooltip="Measuring the gap between current spend and latent transformational opportunity."
        filterContent={<CardFilters company={company} setCompany={setCompany} dateRange={dateRange} setDateRange={setDateRange} />}
      />
      <div className={`px-6 py-6 flex flex-col gap-6 ${isRefreshing ? 'animate-refresh' : ''}`}>
        {variant === 'V1' ? (
          <div className="space-y-4">
             <span className="text-[11px] font-bold text-[#137333] uppercase tracking-wider">Transformational Win Momentum</span>
             {filteredWins.map((w, idx) => (
               <div key={idx} className="p-4 border border-[#CEEAD6] bg-[#E6F4EA] rounded-xl flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-[15px]">
                      <CompanyLogo name={w.company} />
                      <span>{w.company}</span>
                    </div>
                    <span className="font-bold text-[#137333]">Increment ({dateRange}): {w.budget}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#CEEAD6]">
                     <p className="text-[10px] font-bold text-[#5F6368] uppercase mb-1">Ambitious Outcome</p>
                     <p className="text-[13px] text-[#202124] font-medium leading-tight">"{w.outcome}"</p>
                     <div className="flex items-center gap-2 mt-2">
                       <CompanyLogo name={w.company} className="w-3 h-3 opacity-60" />
                       <p className="text-[11px] text-[#137333] font-bold italic">Exec influence: {w.exec}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-[#C5221F] uppercase tracking-wider">Missed Headroom ({dateRange})</span>
            {filteredAlerts.map((a, idx) => (
              <div key={idx} className="p-4 border border-[#FCE8E6] bg-[#FCF3F2] rounded-xl flex flex-col gap-3 shadow-sm">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-[15px] text-[#202124]">
                      <CompanyLogo name={a.company} />
                      <span>{a.company} Gap</span>
                    </div>
                    <span className="font-bold text-[#C5221F]">Gap Metric: {a.value}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#FCE8E6]">
                     <p className="text-[10px] font-bold text-[#C5221F] uppercase mb-1">Gap Analysis</p>
                     <p className="text-[13px] text-[#202124] font-medium leading-tight">"{a.ambitious}"</p>
                     <div className="flex items-center justify-between mt-2 border-t border-gray-100 pt-2">
                        <div className="flex items-center gap-2">
                          <CompanyLogo name={a.company} className="w-3 h-3 opacity-60" />
                          <span className="text-[11px] text-[#5F6368]">Source Citation: {a.citations.join(', ')}</span>
                        </div>
                        <Badge type="error">Influence: {a.exec}</Badge>
                     </div>
                  </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <ConnectAIAlert content={company === 'All accounts' ? `High potential headroom identified across top accounts for ${dateRange}.` : `Latent headroom potential at ${company} for ${dateRange} estimated at ${filteredAlerts[0].value} based on current signals.`} />
        </div>
      </div>
      <CardFooter />
    </Card>
  );
};
