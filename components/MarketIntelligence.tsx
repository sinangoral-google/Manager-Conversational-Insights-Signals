
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, BarChart, Bar, AreaChart, Area, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, SectionHeader, CardFooter, CardFilters, CompanyLogo, ConnectAIAlert, Badge, ChartTooltip, BtnDropdown } from './Shared';

const COMPANIES_LIST = ['Red Bull', 'Burger King', 'Dr Pepper', 'Disney', 'McDonald\'s'];
const COMPETITORS_LIST = ['Meta', 'TikTok', 'Instagram', 'Amazon', 'Apple', 'Microsoft'];

const getDateMultiplier = (range: string) => {
  switch (range) {
    case 'Last 7 days': return 0.23;
    case 'Last 90 days': return 2.8;
    case 'Last 12 months': return 11.5;
    default: return 1.0; // Last 30 days
  }
};

const MOCK_COMPETITORS = [
  // Meta - High Volume, Positive Trend
  { company: 'Red Bull', name: 'Meta', wallet: 4.2, walletPct: '32%', trend: 4.4, citations: 4, advantage: 'Hyper-local targeting automation', weakPoint: 'Attribution transparency', accountNames: ['Red Bull NA', 'Red Bull Global', 'RB Racing'] },
  { company: 'Burger King', name: 'Meta', wallet: 3.1, walletPct: '28%', trend: 2.1, citations: 2, advantage: 'Dynamic creative optimization', weakPoint: 'Incremental lift reporting', accountNames: ['BK US', 'BK Canada'] },
  { company: 'Dr Pepper', name: 'Meta', wallet: 1.9, walletPct: '12%', trend: 2.5, citations: 2, advantage: 'Broad demographic reach', weakPoint: 'Rising CPMs', accountNames: ['DP National', 'Diet DP'] },
  { company: 'McDonald\'s', name: 'Meta', wallet: 12.2, walletPct: '12%', trend: 1.4, citations: 3, advantage: 'Broad reach efficiency', weakPoint: 'Creative fatigue', accountNames: ['McD Digital', 'McD Corporate'] },
  { company: 'Disney', name: 'Meta', wallet: 2.8, walletPct: '14%', trend: 3.1, citations: 2, advantage: 'Cross-platform audience matching', weakPoint: 'Cookie depreciation impact', accountNames: ['Disney Direct', 'Hulu Promo'] },
  
  // TikTok - Medium Volume, Negative Aggregated Trend
  { company: 'Red Bull', name: 'TikTok', wallet: 2.8, walletPct: '18%', trend: -8.6, citations: 1, advantage: 'Creator velocity', weakPoint: 'Search measurement', accountNames: ['Red Bull Events'] },
  { company: 'Burger King', name: 'TikTok', wallet: 1.8, walletPct: '15%', trend: -3.2, citations: 1, advantage: 'Trend-jacking agility', weakPoint: 'Conversion tracking', accountNames: ['BK Social Promo'] },
  { company: 'Disney', name: 'TikTok', wallet: 3.2, walletPct: '22%', trend: 1.4, citations: 3, advantage: 'UGC-driven fandom engagement', weakPoint: 'Brand safety controls', accountNames: ['Disney Studio Promo'] },
  { company: 'McDonald\'s', name: 'TikTok', wallet: 4.8, walletPct: '8%', trend: -4.1, citations: 4, advantage: 'Viral influencer hooks', weakPoint: 'Standardized measurement', accountNames: ['McD Late Night'] },
  
  // Instagram - High Volume, Positive Trend
  { company: 'Disney', name: 'Instagram', wallet: 5.5, walletPct: '42%', trend: 5.8, citations: 5, advantage: 'Immersive visual storytelling', weakPoint: 'Inventory costs', accountNames: ['Disney Parks', 'Disney+', 'ESPN'] },
  { company: 'McDonald\'s', name: 'Instagram', wallet: 2.5, walletPct: '4%', trend: 3.1, citations: 2, advantage: 'Visual menu storytelling', weakPoint: 'High saturation', accountNames: ['McD Breakfast Specials'] },
  
  // Amazon - Low Volume, Negative Aggregated Trend
  { company: 'Dr Pepper', name: 'Amazon', wallet: 2.5, walletPct: '15%', trend: -5.2, citations: 1, advantage: 'Inventory exclusivity', weakPoint: 'Creative agility', accountNames: ['Keurig Dr Pepper'] },
  { company: 'Red Bull', name: 'Amazon', wallet: 1.5, walletPct: '5%', trend: -2.8, citations: 1, advantage: 'Direct commerce tie-ins', weakPoint: 'Lower brand presence', accountNames: ['RB Amazon Store'] },
  
  // Apple - Medium Volume, Positive Trend
  { company: 'Disney', name: 'Apple', wallet: 3.8, walletPct: '25%', trend: 5.4, citations: 3, advantage: 'Privacy-first ecosystem', weakPoint: 'Closed attribution', accountNames: ['Disney Services'] },
  { company: 'Red Bull', name: 'Apple', wallet: 1.2, walletPct: '3%', trend: 1.1, citations: 1, advantage: 'Premium device targeting', weakPoint: 'Limited reach', accountNames: ['RB Music App'] },
  
  // Microsoft - Low Volume, Negative Aggregated Trend
  { company: 'McDonald\'s', name: 'Microsoft', wallet: 3.1, walletPct: '21%', trend: -7.7, citations: 1, advantage: 'B2B enterprise depth', weakPoint: 'User interface friction', accountNames: ['Azure Global'] },
  { company: 'Burger King', name: 'Microsoft', wallet: 1.4, walletPct: '5%', trend: -4.2, citations: 1, advantage: 'Xbox integration', weakPoint: 'Niche audience', accountNames: ['BK Gaming Rewards'] },
  { company: 'Disney', name: 'Microsoft', wallet: 0.9, walletPct: '2%', trend: -1.4, citations: 1, advantage: 'Cloud gaming synergy', weakPoint: 'Attribution lag', accountNames: ['Disney Gaming'] },
];

const MOCK_REVENUE_INSIGHTS = [
  { name: 'Meta', overall: -7, dv360: -18, bart: 56, search: -11, video: 1, declining: 420, rising: 125, totalValue: 124 },
  { name: 'TikTok', overall: 12, dv360: 4, bart: 22, search: 8, video: 15, declining: 85, rising: 310, totalValue: 62 },
  { name: 'Instagram', overall: 9, dv360: 2, bart: 42, search: 1, video: 22, declining: 140, residential: 290, totalValue: 78 },
  { name: 'Amazon', overall: 22, dv360: 12, bart: 18, search: 25, video: 4, declining: 110, rising: 440, totalValue: 88 },
  { name: 'Apple', overall: 5, dv360: 1, bart: 12, search: 2, video: 8, declining: 45, rising: 220, totalValue: 95 },
  { name: 'Microsoft', overall: 8, dv360: -2, bart: 24, search: 11, video: 3, declining: 60, rising: 180, totalValue: 112 },
];

const CompetitorBubbleTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const accounts = data.accountNames || [];
    const displayAccounts = accounts.slice(0, 2);
    const othersCount = accounts.length - displayAccounts.length;

    return (
      <div className="bg-white border border-[#DADCE0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-4 min-w-[280px] z-[9999] animate-in fade-in duration-150 pointer-events-none">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F1F3F4]">
          <CompanyLogo name={data.name} className="w-6 h-6" />
          <div className="flex flex-col">
            <span className="font-bold text-[16px] text-[#202124]">{data.name}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-0.5 tracking-wider">SOW ($M)</span>
              <span className="text-[14px] font-bold text-[#1A73E8]">${data.wallet.toFixed(1)}M</span>
            </div>
            <div>
              <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-0.5 tracking-wider">Trend (%)</span>
              <span className={`text-[14px] font-bold ${data.trend >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'}`}>
                {data.trend > 0 ? '+' : ''}{data.trend.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F3F4]">
            <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-2 tracking-wider uppercase">RELIANT ACCOUNTS</span>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {displayAccounts.map((acc: string) => (
                    <div key={acc} className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-md text-[11px] text-[#3C4043] font-medium">
                        <CompanyLogo name={acc} className="w-3.5 h-3.5" />
                        {acc}
                    </div>
                ))}
                {othersCount > 0 && (
                    <div className="px-2 py-0.5 bg-[#F1F3F4] border border-[#DADCE0] rounded-md text-[11px] text-[#5F6368] font-bold">
                        +{othersCount}
                    </div>
                )}
            </div>
            <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-1 tracking-wider">STRATEGIC ADVANTAGE</span>
            <p className="text-[12px] text-[#202124] italic leading-tight font-medium">"{data.advantage}"</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const AccountListTooltip: React.FC<{ data: any; visible: boolean; x: number; y: number }> = ({ data, visible, x, y }) => {
  if (!visible || !data) return null;
  return (
    <div 
      className="fixed z-[10000] bg-white border border-[#DADCE0] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] p-4 min-w-[240px] pointer-events-none animate-in fade-in duration-200"
      style={{ left: x + 20, top: y - 20 }}
    >
      <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-3 tracking-wider">RELIANT ACCOUNTS ({data.accountNames.length})</span>
      <div className="flex flex-col gap-2">
        {data.accountNames.map((name: string) => (
          <div key={name} className="flex items-center gap-2 px-2 py-1.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg">
            <CompanyLogo name={name} className="w-4 h-4" />
            <span className="text-[12px] font-medium text-[#202124]">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tooltip for Focused V2 Trend Chart
const FocusedTrendTooltip: React.FC<any> = ({ active, payload, competitorData }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const currentSow = payload[0].value;
    const currentTrend = data[competitorData.name]; // Trend point

    const accounts = competitorData.accountNames || [];
    const displayAccounts = accounts.slice(0, 2);
    const othersCount = accounts.length - displayAccounts.length;

    return (
      <div className="bg-white border border-[#DADCE0] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] p-4 min-w-[300px] z-[9999] animate-in fade-in duration-150 pointer-events-none">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F3F4]">
          <div className="flex items-center gap-3">
            <CompanyLogo name={competitorData.name} className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="font-bold text-[16px] text-[#202124] leading-tight">{competitorData.name}</span>
              <span className="text-[12px] text-[#5F6368] font-medium uppercase tracking-wider">{data.interval}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-0.5 tracking-wider opacity-70">Share of Wallet</span>
              <span className="text-[18px] font-bold text-[#1A73E8]">${currentSow.toFixed(1)}M</span>
            </div>
            <div>
              <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-0.5 tracking-wider opacity-70">Trend (%)</span>
              <span className={`text-[18px] font-bold ${currentTrend >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'}`}>
                {currentTrend > 0 ? '+' : ''}{currentTrend.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F1F3F4]">
            <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-2 tracking-wider text-[#5F6368]">RELIANT ACCOUNTS</span>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {displayAccounts.map((acc: string) => (
                    <div key={acc} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg text-[12px] text-[#3C4043] font-medium">
                        <CompanyLogo name={acc} className="w-3.5 h-3.5" />
                        {acc}
                    </div>
                ))}
                {othersCount > 0 && (
                    <div className="px-2.5 py-1 bg-[#F1F3F4] border border-[#DADCE0] rounded-lg text-[12px] text-[#5F6368] font-bold">
                        +{othersCount}
                    </div>
                )}
            </div>
            <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-1 tracking-wider">STRATEGIC ADVANTAGE</span>
            <p className="text-[13px] text-[#202124] italic leading-relaxed font-medium">"{competitorData.advantage}"</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SpendBreakdownTooltip: React.FC<any> = ({ active, payload, x, y, visible }) => {
  const data = active ? payload[0].payload : payload;
  const isFixed = active !== undefined;
  
  if ((isFixed && !active) || (!isFixed && !visible) || !data) return null;

  return (
    <div 
      className={`${isFixed ? 'bg-white border border-[#DADCE0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-4 min-w-[260px] z-[9999] animate-in fade-in duration-150 pointer-events-none' : 'fixed z-[10000] bg-white border border-[#DADCE0] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] p-4 min-w-[280px] pointer-events-none animate-in fade-in duration-200'}`}
      style={!isFixed ? { left: x + 20, top: y - 100 } : {}}
    >
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F1F3F4]">
        <CompanyLogo name={data.name} className="w-6 h-6" />
        <span className="font-bold text-[16px] text-[#202124]">{data.name}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-[#5F6368] font-bold uppercase tracking-wider">Total Est. Spend</span>
          <span className="text-[14px] font-bold text-[#1A73E8]">${data.value.toFixed(1)}M</span>
        </div>
        <div className="pt-2 space-y-2">
          <span className="text-[10px] text-[#5F6368] font-bold uppercase tracking-wider block opacity-70">Account Contribution</span>
          {data.breakdown.map((b: any, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CompanyLogo name={b.company} className="w-3.5 h-3.5" />
                <span className="text-[12px] text-[#3C4043] font-medium">{b.company}</span>
              </div>
              <span className="text-[12px] font-bold text-[#202124]">${b.value.toFixed(1)}M</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-110} y={-10} width={105} height={20}>
        <div className="flex items-center justify-end gap-2 pr-2">
          <CompanyLogo name={payload.value} className="w-4 h-4" />
          <span className="text-[12px] text-[#202124] font-medium truncate text-right">{payload.value}</span>
        </div>
      </foreignObject>
    </g>
  );
};

export const CompetitiveSignalsCard: React.FC<{ variant: 'V1' | 'V2' }> = ({ variant }) => {
  const [company, setCompany] = useState('All accounts');
  const [dateRange, setDateRange] = useState('Last 12 months');
  const [v2Competitor, setV2Competitor] = useState('Meta');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => setIsRefreshing(false), 400);
    return () => clearTimeout(timer);
  }, [company, dateRange, variant, v2Competitor]);

  const [tableTooltip, setTableTooltip] = useState<{ data: any; visible: boolean; x: number; y: number }>({ data: null, visible: false, x: 0, y: 0 });

  // Calculate dynamic valid accounts for the current v2Competitor
  const v2ValidAccounts = useMemo(() => {
    if (variant !== 'V2') return ['All accounts', ...COMPANIES_LIST];
    const associated = MOCK_COMPETITORS
      .filter(item => item.name === v2Competitor)
      .map(item => item.company);
    const unique = Array.from(new Set(associated));
    return ['All accounts', ...unique];
  }, [v2Competitor, variant]);

  // Handle case where switching competitor makes the current account invalid
  useEffect(() => {
    if (variant === 'V2' && !v2ValidAccounts.includes(company)) {
      setCompany('All accounts');
    }
  }, [v2Competitor, v2ValidAccounts, variant, company]);

  const filteredData = useMemo(() => {
    const mult = getDateMultiplier(dateRange);
    let base = MOCK_COMPETITORS;
    
    // Filter by competitor if in V2
    if (variant === 'V2') {
        base = base.filter(item => item.name === v2Competitor);
    }
    
    // Filter by company
    if (company !== 'All accounts') {
      base = base.filter(item => item.company === company);
    }

    const aggregated: Record<string, any> = {};
    base.forEach(item => {
      if (!aggregated[item.name]) {
        aggregated[item.name] = { 
          ...item, 
          wallet: 0, 
          citations: 0, 
          trend: 0, 
          count: 0, 
          accountNames: [] 
        };
      }
      aggregated[item.name].wallet += item.wallet;
      aggregated[item.name].citations += item.citations;
      aggregated[item.name].trend += item.trend;
      aggregated[item.name].count += 1;
      
      const companiesToAdd = item.company === 'All accounts' ? COMPANIES_LIST : [item.company];
      companiesToAdd.forEach(c => {
        if (!aggregated[item.name].accountNames.includes(c)) {
          aggregated[item.name].accountNames.push(c);
        }
      });
    });

    return Object.values(aggregated).map(item => ({
      ...item,
      wallet: item.wallet * mult,
      trend: parseFloat(((item.trend / item.count) * (mult >= 1 ? mult * 0.8 : mult * 1.5)).toFixed(1))
    }));
  }, [company, dateRange, variant, v2Competitor]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => b.wallet - a.wallet);
  }, [filteredData]);

  const v2CompetitorData = useMemo(() => {
    return sortedData.find(c => c.name === v2Competitor) || sortedData[0];
  }, [sortedData, v2Competitor]);

  const trendData = useMemo(() => {
    let intervals: string[] = [];
    if (dateRange === 'Last 7 days') {
      intervals = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (dateRange === 'Last 30 days') {
      intervals = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else if (dateRange === 'Last 90 days') {
      intervals = ['Month 1', 'Month 2', 'Month 3'];
    } else { // 12 months
      intervals = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    }

    return intervals.map((label, stepIdx) => {
      const entry: any = { interval: label };
      sortedData.forEach((comp) => {
        const wave = Math.sin((stepIdx * 0.8) + (comp.wallet * 0.1)) * 5;
        const noise = (Math.random() - 0.5) * 2;
        entry[comp.name] = parseFloat((comp.trend + wave + noise).toFixed(1));
        entry[`${comp.name}_sow`] = comp.wallet * (1 + (entry[comp.name] / 100));
      });
      return entry;
    });
  }, [sortedData, dateRange]);

  const alertContent = useMemo(() => {
    if (sortedData.length === 0) return "No data available for the selected filters.";
    const topComp = sortedData[0];
    
    if (variant === 'V2') {
        const comp = v2CompetitorData;
        if (!comp) return "No data available.";
        return `Detailed analysis for ${comp.name} reveals a $${comp.wallet.toFixed(1)}M SOW trajectory with ${comp.trend >= 0 ? 'positive' : 'negative'} momentum across ${comp.accountNames.length} key accounts.`;
    }

    if (company === 'All accounts') {
      return `Signal detection identifies ${topComp.name} as the dominant competitor with $${topComp.wallet.toFixed(1)}M Share of Wallet across the portfolio, trending ${topComp.trend >= 0 ? 'up' : 'down'} ${Math.abs(topComp.trend)}% in recent discussions.`;
    } else {
      return `For ${company}, ${topComp.name} is the most cited competitor ($${topComp.wallet.toFixed(1)}M SoW). Mentions are trending ${topComp.trend >= 0 ? 'up' : 'down'} in ${dateRange} transcripts.`;
    }
  }, [company, sortedData, dateRange, variant, v2CompetitorData]);

  return (
    <Card>
      <SectionHeader 
        title="Competitor tracking" 
        tooltip="Visualization V1: Scatter analysis of trend vs volume. Visualization V2: Deep-dive into a specific competitor's SOW trajectory."
        filterContent={
            <div className="flex items-center gap-[16px]">
                {variant === 'V2' ? (
                  <>
                    <BtnDropdown 
                      btnText="Select Competitor"
                      labelText="Competitor"
                      selectedOption={v2Competitor}
                      menuItems={COMPETITORS_LIST}
                      onSelect={setV2Competitor}
                      showIcons={true}
                    />
                    <BtnDropdown 
                      btnText="Select Account" 
                      labelText="Account" 
                      selectedOption={company} 
                      menuItems={v2ValidAccounts} 
                      onSelect={setCompany} 
                    />
                    <BtnDropdown 
                      btnText="Select Range" 
                      labelText="Date range" 
                      selectedOption={dateRange} 
                      menuItems={['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']} 
                      onSelect={setDateRange}
                      showIcons={false}
                    />
                  </>
                ) : (
                  <CardFilters company={company} setCompany={setCompany} dateRange={dateRange} setDateRange={setDateRange} />
                )}
            </div>
        }
      />
      
      <div className={`px-6 py-6 flex flex-col gap-4 overflow-visible ${isRefreshing ? 'animate-refresh' : ''}`}>
        {variant === 'V1' ? (
          <>
            <div className="h-[360px] w-full relative overflow-visible border border-[#DADCE0] rounded-2xl bg-white p-6 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 30, right: 60, bottom: 50, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F4" vertical={false} />
                  <ReferenceLine y={0} stroke="#3C4043" strokeWidth={1.5} strokeOpacity={0.8} strokeDasharray="4 4" />
                  <XAxis 
                    type="number" 
                    dataKey="wallet" 
                    name="Share of Wallet" 
                    unit="M" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#5F6368', fontSize: 11 }}
                    label={{ value: 'SHARE OF WALLET ($M)', position: 'bottom', offset: 10, fontSize: 10, fontWeight: 'bold', fill: '#5F6368' }}
                    domain={[0, 'auto']}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="trend" 
                    name="Trend" 
                    unit="%" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#5F6368', fontSize: 11 }}
                    label={{ value: 'TREND (%)', angle: -90, position: 'insideLeft', offset: -10, fontSize: 10, fontWeight: 'bold', fill: '#5F6368' }}
                    domain={['auto', 'auto']}
                  />
                  <ZAxis type="number" dataKey="citations" range={[200, 1500]} />
                  <Tooltip content={<CompetitorBubbleTooltip />} isAnimationActive={false} />
                  <Scatter name="Competitors" data={filteredData}>
                    {filteredData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.trend >= 0 ? '#1e8e3e' : '#d93025'} 
                        fillOpacity={hoveredIdx === index ? 1 : 0.8}
                        onMouseEnter={() => setHoveredIdx(index)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        className="transition-all duration-300 cursor-pointer"
                        style={{ filter: hoveredIdx === index ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' : 'none' }}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-hidden border border-[#DADCE0] rounded-xl shadow-sm relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-[#DADCE0]">
                    <th className="px-4 py-3 text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">Competitor</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#5F6368] uppercase tracking-wider text-right cursor-help">
                      RELIANT ACCOUNTS
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#5F6368] uppercase tracking-wider text-right">Trend</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#5F6368] uppercase tracking-wider text-right">SoW</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((comp, idx) => (
                    <tr key={idx} className="border-b border-[#F1F3F4] hover:bg-gray-50 transition-colors group/row">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <CompanyLogo name={comp.name} className="w-5 h-5" />
                          <span className="text-[14px] font-medium text-[#202124]">{comp.name}</span>
                        </div>
                      </td>
                      <td 
                        className="px-4 py-3 text-right text-[14px] text-[#5F6368] font-medium cursor-pointer underline decoration-dotted decoration-[#DADCE0] hover:text-[#1a73e8]"
                        onMouseEnter={(e) => setTableTooltip({ data: comp, visible: true, x: e.clientX, y: e.clientY })}
                        onMouseMove={(e) => setTableTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }))}
                        onMouseLeave={() => setTableTooltip(prev => ({ ...prev, visible: false }))}
                      >
                        {comp.accountNames.length} {comp.accountNames.length === 1 ? 'Account' : 'Accounts'}
                      </td>
                      <td className={`px-4 py-3 text-right text-[14px] font-bold ${comp.trend >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'}`}>
                        <div className="flex items-center justify-end gap-1">
                          <i className="google-symbols !text-[18px] leading-none">{comp.trend >= 0 ? 'trending_up' : 'trending_down'}</i>
                          <span>{comp.trend > 0 ? '+' : ''}{comp.trend.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[14px] font-bold text-[#1a73e8]">
                        ${comp.wallet.toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-400 overflow-visible">
            {/* V2 - Single Large Focused AreaChart */}
            <div className="h-[420px] w-full relative overflow-visible bg-white rounded-2xl border border-[#DADCE0] p-6 shadow-sm">
                <div className="absolute top-6 left-6 flex items-center gap-3 pointer-events-none z-10">
                   <div className="flex items-center gap-2">
                     <CompanyLogo name={v2Competitor} className="w-5 h-5" />
                     <span className="text-[14px] font-bold text-[#202124] uppercase tracking-wider">
                       {v2Competitor} PERFORMANCE TRAJECTORY
                     </span>
                   </div>
                   <span className="text-[#DADCE0] font-bold">•</span>
                   <div className="flex items-center gap-2">
                     <CompanyLogo name={company} className="w-4 h-4" />
                     <span className="text-[14px] font-bold text-[#202124] uppercase tracking-wider">
                       {company.toUpperCase()}
                     </span>
                   </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 60, right: 20, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`colorSow`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F4" />
                        <XAxis 
                            dataKey="interval" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#5F6368', fontSize: 12, fontWeight: 500 }}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#5F6368', fontSize: 12, fontWeight: 500 }}
                            unit="M"
                            label={{ value: 'SHARE OF WALLET ($M)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 11, fontWeight: 'bold', fill: '#5F6368' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip 
                            content={<FocusedTrendTooltip competitorData={v2CompetitorData} />}
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey={`${v2Competitor}_sow`}
                            stroke="#1A73E8"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorSow)"
                            activeDot={{ r: 8, strokeWidth: 0, fill: '#1A73E8' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>
        )}
        
        <AccountListTooltip {...tableTooltip} />

        <div className="overflow-hidden mt-4">
          <ConnectAIAlert content={alertContent} />
        </div>
      </div>
      <CardFooter />
    </Card>
  );
};

export const CustomerSpendCard: React.FC<{ variant: 'V1' | 'V2' }> = ({ variant }) => {
  const [company, setCompany] = useState('All accounts');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [floatingTooltip, setFloatingTooltip] = useState<{ data: any; visible: boolean; x: number; y: number }>({ data: null, visible: false, x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => setIsRefreshing(false), 400);
    return () => clearTimeout(timer);
  }, [company, dateRange, variant]);

  const filteredData = useMemo(() => {
    const mult = getDateMultiplier(dateRange);
    let base = MOCK_COMPETITORS;
    
    if (company !== 'All accounts') {
      base = MOCK_COMPETITORS.filter(item => item.company === company);
    }

    const aggregated: Record<string, any> = {};
    base.forEach(item => {
      if (!aggregated[item.name]) {
        aggregated[item.name] = { 
          name: item.name,
          wallet: 0, 
          trend: 0, 
          count: 0,
          breakdownMap: {} 
        };
      }
      aggregated[item.name].wallet += item.wallet;
      aggregated[item.name].trend += item.trend;
      aggregated[item.name].count += 1;
      
      if (item.company === 'All accounts') {
        const splitValue = (item.wallet * mult) / COMPANIES_LIST.length;
        COMPANIES_LIST.forEach(c => {
          aggregated[item.name].breakdownMap[c] = (aggregated[item.name].breakdownMap[c] || 0) + splitValue;
        });
      } else {
        aggregated[item.name].breakdownMap[item.company] = (aggregated[item.name].breakdownMap[item.company] || 0) + (item.wallet * mult);
      }
    });

    return Object.values(aggregated).map(item => ({
      ...item,
      value: item.wallet * mult,
      trend: parseFloat(((item.trend / item.count) * (mult >= 1 ? mult * 0.8 : mult * 1.5)).toFixed(1)),
      breakdown: Object.entries(item.breakdownMap).map(([compName, val]) => ({ company: compName, value: val }))
    })).sort((a, b) => b.value - a.value);
  }, [company, dateRange]);

  const stats = useMemo(() => {
    const total = filteredData.reduce((acc, curr) => acc + curr.value, 0);
    const avgTrend = filteredData.length > 0 
      ? filteredData.reduce((acc, curr) => acc + curr.trend, 0) / filteredData.length 
      : 0;
    return { total, avgTrend };
  }, [filteredData]);

  const summaryBox = (
    <div className="flex items-center justify-between py-4 px-6 bg-[#F8F9FA] rounded-2xl border border-[#DADCE0]">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 overflow-hidden shrink-0">
          <span className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider whitespace-nowrap">TOTAL ACCOUNT SPEND ON COMPETITORS</span>
          <span className="text-[#DADCE0] font-bold shrink-0">•</span>
          {company === 'All accounts' ? (
            <span className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider whitespace-nowrap">ALL ACCOUNTS</span>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden shrink">
              <CompanyLogo name={company} className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider truncate shrink">{company}</span>
            </div>
          )}
        </div>
        <span className="text-[20px] font-bold text-[#1a73e8]">${stats.total.toFixed(1)}M</span>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">TREND</span>
        <div className={`flex items-center gap-1 font-bold ${stats.avgTrend >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'}`}>
          <i className="google-symbols !text-[24px]">{stats.avgTrend >= 0 ? 'trending_up' : 'trending_down'}</i>
          <span className="text-[20px]">{stats.avgTrend > 0 ? '+' : ''}{stats.avgTrend.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <SectionHeader 
        title="Account spend on competitors" 
        tooltip="Spending estimates based on captured billing signals and conversational disclosures. Includes weighted trends."
        filterContent={<CardFilters company={company} setCompany={setCompany} dateRange={dateRange} setDateRange={setDateRange} />}
      />
      <div className={`px-6 py-6 flex flex-col gap-8 ${isRefreshing ? 'animate-refresh' : ''}`}>
        {variant === 'V1' ? (
          <div className="flex flex-col gap-6">
            {summaryBox}
            <div className="space-y-5 border border-[#DADCE0] rounded-2xl bg-white p-6 shadow-sm">
              {filteredData.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col gap-2 group/row relative cursor-help"
                  onMouseEnter={(e) => {
                    setFloatingTooltip({ data: item, visible: true, x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setFloatingTooltip(prev => ({ ...prev, visible: false }))}
                  onMouseMove={(e) => {
                    setFloatingTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={item.name} />
                      <span className="font-bold text-[14px] text-[#202124]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1 font-bold ${item.trend >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'}`}>
                        <i className="google-symbols !text-[18px]">{item.trend >= 0 ? 'trending_up' : 'trending_down'}</i>
                        <span className="text-[14px]">{item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%</span>
                      </div>
                      <span className="text-[14px] font-bold text-[#1a73e8] w-16 text-right">${item.value.toFixed(1)}M</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#F1F3F4] rounded-full overflow-hidden transition-shadow group-hover/row:shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 group-hover/row:brightness-90"
                      style={{ 
                        width: `${(item.value / (filteredData[0]?.value || 1)) * 100}%`,
                        backgroundColor: '#1A73E8'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Tooltip component for breakdown */}
            <SpendBreakdownTooltip payload={floatingTooltip.data} visible={floatingTooltip.visible} x={floatingTooltip.x} y={floatingTooltip.y} />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {summaryBox}
            <div className="h-[300px] w-full border border-[#DADCE0] rounded-2xl bg-white p-6 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData} layout="vertical" margin={{ top: 20, right: 30, left: 110, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F3F4" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#5F6368', fontSize: 11}} unit="M" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={<CustomYAxisTick />}
                  />
                  <Tooltip content={<SpendBreakdownTooltip />} cursor={{fill: '#F8F9FA'}} isAnimationActive={false} />
                  <Bar dataKey="value" radius={[0, 40, 40, 0]} fill="#1A73E8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        <ConnectAIAlert content={`Total captured spend across tracked competitors is approximately $${stats.total.toFixed(1)}M, showing a ${stats.avgTrend >= 0 ? 'positive' : 'negative'} momentum of ${Math.abs(stats.avgTrend).toFixed(1)}%.`} />
      </div>
      <CardFooter />
    </Card>
  );
};

const RevenueDeltaTag: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-[#F1F3F4] flex-1">
    <span className="text-[9px] font-bold text-[#5F6368] uppercase mb-0.5">{label}</span>
    <span className={`text-[12px] font-bold ${value >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'}`}>
      {value > 0 ? '+' : ''}{value}%
    </span>
  </div>
);

const RevenueCompetitorCard: React.FC<{ item: any; isFullWidth: boolean; noHover?: boolean }> = ({ item, isFullWidth, noHover }) => (
  <div className={`p-4 border border-[#DADCE0] rounded-2xl bg-white flex flex-col gap-4 shadow-sm ${noHover ? '' : 'hover:shadow-md transition-shadow'} group ${isFullWidth ? 'w-full' : ''}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
           <CompanyLogo name={item.name} className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-[16px] font-bold text-[#202124] leading-tight">{item.name}</h4>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[10px] text-[#5F6368] font-bold uppercase block tracking-wider">Overall</span>
        <span className={`text-[18px] font-bold leading-tight ${item.overall >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'}`}>
          {item.overall > 0 ? '+' : ''}{item.overall}%
        </span>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-2 bg-[#F8F9FA] p-2 rounded-xl border border-[#F1F3F4]">
      <RevenueDeltaTag label="DV360" value={item.dv360} />
      <RevenueDeltaTag label="BART" value={item.bart} />
      <RevenueDeltaTag label="Search" value={item.search} />
      <RevenueDeltaTag label="Video" value={item.video} />
    </div>

    <div className="flex gap-2">
      <div className="flex-1 px-3 py-2 bg-[#FCF3F2] border border-[#FCE8E6] rounded-lg flex flex-col items-center">
        <span className="text-[10px] font-bold text-[#C5221F] uppercase mb-0.5 whitespace-nowrap text-center text-[8px] leading-tight">Declining accounts</span>
        <span className="text-[13px] font-bold text-[#C5221F]">-${item.declining}k</span>
      </div>
      <div className="flex-1 px-3 py-2 bg-[#E6F4EA] border border-[#CEEAD6] rounded-lg flex flex-col items-center">
        <span className="text-[10px] font-bold text-[#137333] uppercase mb-0.5 whitespace-nowrap text-center text-[8px] leading-tight">Rising accounts</span>
        <span className="text-[13px] font-bold text-[#137333]">+${item.rising}k</span>
      </div>
    </div>
  </div>
);

export const CompetitorRevenueCard: React.FC<{ variant: 'V1' | 'V2' }> = ({ variant }) => {
  const [competitor, setCompetitor] = useState('Meta');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    setIsRefreshing(true);
    setCarouselIndex(0);
    const timer = setTimeout(() => setIsRefreshing(false), 400);
    return () => clearTimeout(timer);
  }, [competitor, dateRange, variant]);

  const processedData = useMemo(() => {
    const mult = getDateMultiplier(dateRange);
    let base = MOCK_REVENUE_INSIGHTS;
    
    // V1 shows one account at a time based on filter.
    // V2 shows all competitors in a grid.
    if (variant === 'V1') {
      base = MOCK_REVENUE_INSIGHTS.filter(item => item.name === competitor);
      if (base.length === 0) base = [MOCK_REVENUE_INSIGHTS[0]];
    }

    return base.map(item => ({
      ...item,
      overall: parseFloat((item.overall * (mult < 0.5 ? 0.6 : mult > 5 ? 1.5 : 1)).toFixed(1)),
      dv360: parseFloat((item.dv360 * (mult < 0.5 ? 0.5 : mult > 5 ? 1.6 : 1)).toFixed(1)),
      bart: parseFloat((item.bart * (mult < 0.5 ? 0.7 : mult > 5 ? 1.3 : 1)).toFixed(1)),
      search: parseFloat((item.search * (mult < 0.5 ? 0.6 : mult > 5 ? 1.4 : 1)).toFixed(1)),
      video: parseFloat((item.video * (mult < 0.5 ? 0.8 : mult > 5 ? 1.2 : 1)).toFixed(1)),
      declining: Math.round(item.declining * mult),
      rising: Math.round(item.rising * mult),
      totalValue: item.totalValue * mult
    }));
  }, [competitor, dateRange, variant]);

  const aiSummary = useMemo(() => {
    if (variant === 'V1') {
      return `${competitor} is showing aggressive expansion in BART-enabled units. Net flow analysis suggests a significant recovery in ${dateRange} despite overall market headwinds.`;
    }
    return `Aggregated revenue signals across all competitors indicate dynamic shifts in the market. BART and Search performance remain high priority themes for ${dateRange}.`;
  }, [competitor, dateRange, variant]);

  return (
    <Card>
      <SectionHeader 
        title="Competitor revenue" 
        tooltip="Deep-dive into competitor revenue deltas across product families and account performance metrics."
        filterContent={
          <div className="flex flex-row items-center gap-[16px]">
            {variant === 'V1' && (
              <BtnDropdown 
                btnText="Select Competitor" 
                labelText="Competitor" 
                selectedOption={competitor} 
                menuItems={COMPETITORS_LIST} 
                onSelect={setCompetitor} 
              />
            )}
            <BtnDropdown 
              btnText="Select Range" 
              labelText="Date range" 
              selectedOption={dateRange} 
              menuItems={['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']} 
              onSelect={setDateRange}
              showIcons={false}
            />
          </div>
        }
      />
      <div className={`px-6 py-6 flex flex-col gap-4 ${isRefreshing ? 'animate-refresh' : ''}`}>
        {variant === 'V1' ? (
          <div className="flex flex-col gap-4 overflow-visible">
            <RevenueCompetitorCard item={processedData[0]} isFullWidth={true} />
          </div>
        ) : (
          <div className="relative flex flex-col gap-6">
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                disabled={carouselIndex === 0}
                className={`shrink-0 p-2 rounded-full border border-[#DADCE0] bg-white shadow-sm transition-all ${carouselIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer hover:shadow-md active:scale-95'}`}
              >
                <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
              </button>

              <div className="flex-1 overflow-hidden px-1 py-2">
                <motion.div 
                  className="flex gap-4"
                  animate={{ x: `calc(-${carouselIndex * 50}% - ${carouselIndex * 8}px)` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {processedData.map((item, idx) => (
                    <div key={idx} className="min-w-[calc(50%-8px)] flex-shrink-0">
                      <RevenueCompetitorCard item={item} isFullWidth={false} noHover={true} />
                    </div>
                  ))}
                </motion.div>
              </div>

              <button
                onClick={() => setCarouselIndex(prev => Math.min(processedData.length - 2, prev + 1))}
                disabled={carouselIndex >= processedData.length - 2}
                className={`shrink-0 p-2 rounded-full border border-[#DADCE0] bg-white shadow-sm transition-all ${carouselIndex >= processedData.length - 2 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer hover:shadow-md active:scale-95'}`}
              >
                <ChevronRight className="w-5 h-5 text-[#5F6368]" />
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-2">
              {Array.from({ length: processedData.length - 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${carouselIndex === i ? 'bg-[#1a73e8] w-4' : 'bg-[#DADCE0] hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="overflow-hidden">
          <ConnectAIAlert content={aiSummary} />
        </div>
      </div>
      <CardFooter />
    </Card>
  );
};
