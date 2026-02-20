
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, SectionHeader, CardFooter, BtnDropdown, CompanyLogo, ConnectAIAlert, Badge } from './Shared';

const COMPANIES_LIST = ['Red Bull', 'Burger King', 'Dr Pepper', 'Disney', 'McDonald\'s'];

// Health score logic with dramatic variations based on range
const getDateMultiplier = (range: string) => {
  switch (range) {
    case 'Last 7 days': return 0.5; // High volatility
    case 'Last 90 days': return 1.5; // Broadening trends
    case 'Last 12 months': return 3.0; // Stabilized averages
    default: return 1.0; // 30 days baseline
  }
};

const MOCK_HEALTH_BASE = [
  { 
    name: 'Red Bull', 
    sentimentTrend: 'Consistently positive', 
    baseHealth: 82,
    engagementLevel: 'High velocity', 
    friction: 'None - High alignment', 
    influence: 'VP Media & Global CMO', 
    hygieneBase: 100,
    intervention: 'N/A' 
  },
  { 
    name: 'Disney', 
    sentimentTrend: 'Sharp decline', 
    baseHealth: 18,
    engagementLevel: 'Stagnant volume', 
    friction: 'Billing discrepancies', 
    influence: 'Director-level only', 
    hygieneBase: 35,
    intervention: 'Schedule executive-level audit immediately.' 
  },
  { 
    name: 'Burger King', 
    sentimentTrend: 'Stagnant', 
    baseHealth: 48, 
    engagementLevel: 'Moderate activity', 
    friction: 'PMax automation level', 
    influence: 'Regional Manager', 
    hygieneBase: 68,
    intervention: 'Identify high-impact creative pilots.' 
  },
  { 
    name: 'McDonald\'s', 
    sentimentTrend: 'Strong growth', 
    baseHealth: 94,
    engagementLevel: 'Daily active usage', 
    friction: 'Minor approval lags', 
    influence: 'Global CMO & Tech Lead', 
    hygieneBase: 92,
    intervention: 'N/A' 
  },
  { 
    name: 'Dr Pepper', 
    sentimentTrend: 'Improving', 
    baseHealth: 72,
    engagementLevel: 'Consistent growth', 
    friction: 'Clean room options', 
    influence: 'VP Brand Marketing', 
    hygieneBase: 95,
    intervention: 'N/A' 
  }
];

const HealthTooltip: React.FC<{ item: any; visible: boolean; x: number; y: number }> = ({ item, visible, x, y }) => {
  if (!visible || !item) return null;

  // Calculate position with flip logic to avoid covering the bubble
  const tooltipWidth = 360;
  const tooltipHeight = 320;
  const horizontalOffset = 40;
  const verticalOffset = -140;

  let left = x + horizontalOffset;
  if (left + tooltipWidth > window.innerWidth) {
    left = x - tooltipWidth - horizontalOffset;
  }

  let top = y + verticalOffset;
  if (top < 10) top = 10;
  if (top + tooltipHeight > window.innerHeight) {
    top = window.innerHeight - tooltipHeight - 10;
  }

  return (
    <div 
      className="fixed z-[10000] bg-white border border-[#DADCE0] rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.22)] p-5 min-w-[360px] pointer-events-none animate-in fade-in zoom-in-95 duration-150"
      style={{ left, top }}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F3F4]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#F8F9FA] rounded-lg border border-[#E8EAED]">
            <CompanyLogo name={item.name} className="w-6 h-6" />
          </div>
          <span className="font-bold text-[18px] text-[#202124]">{item.name}</span>
        </div>
        <Badge type={item.healthScore >= 50 ? 'success' : 'error'}>
          Health: {item.healthScore}%
        </Badge>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-0.5">Sentiment trend</span>
            <span className="text-[13px] text-[#202124] font-medium leading-tight">{item.sentimentTrend}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-0.5">Engagement level</span>
            <span className="text-[13px] text-[#202124] font-medium leading-tight">{item.engagementLevel}</span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-0.5">Executive influence</span>
            <span className="text-[13px] text-[#202124] font-medium leading-tight">{item.influence}</span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-0.5">Friction and red flags</span>
            <span className="text-[13px] text-[#202124] font-medium leading-tight">{item.friction}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-0.5">Action item hygiene</span>
            <span className="text-[13px] text-[#202124] font-bold text-[#1A73E8]">{item.hygiene}%</span>
          </div>
        </div>
        {item.healthScore < 50 && (
          <div className="mt-2 p-3 bg-[#FCF3F2] border border-[#FCE8E6] rounded-xl">
            <span className="text-[10px] font-bold text-[#C5221F] uppercase tracking-tight block mb-1">Intervention focus</span>
            <span className="text-[13px] text-[#C5221F] font-bold leading-tight italic">{item.intervention}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const HealthItem: React.FC<{ item: any; showIntervention?: boolean }> = ({ item, showIntervention }) => (
  <div className="p-4 bg-white rounded-xl border border-[#DADCE0] shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F3F4]">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-[#F8F9FA] rounded-lg border border-[#E8EAED]">
          <CompanyLogo name={item.name} className="w-5 h-5" />
        </div>
        <span className="font-bold text-[14px] text-[#202124]">{item.name}</span>
      </div>
      <Badge type={item.healthScore >= 50 ? 'success' : 'error'}>
        Score: {item.healthScore}
      </Badge>
    </div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-tight">Sentiment trend</span>
        <span className="text-[12px] text-[#202124] font-medium leading-tight">{item.sentimentTrend}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-tight">Engagement level</span>
        <span className="text-[12px] text-[#202124] font-medium leading-tight">{item.engagementLevel}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-tight">Executive influence</span>
        <span className="text-[12px] text-[#202124] font-medium leading-tight truncate">{item.influence}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-tight">Hygiene</span>
        <span className="text-[12px] text-[#202124] font-bold text-[#1A73E8]">{item.hygiene}%</span>
      </div>
    </div>
    {showIntervention && (
      <div className="mt-3 p-3 bg-[#FCF3F2] border border-[#FCE8E6] rounded-lg">
        <span className="text-[10px] font-bold text-[#C5221F] uppercase tracking-tight block mb-1">Intervention focus</span>
        <span className="text-[12px] text-[#C5221F] font-bold leading-tight line-clamp-2">{item.intervention}</span>
      </div>
    )}
  </div>
);

export const RelationshipHealthCard: React.FC<{ variant: 'V1' | 'V2' }> = ({ variant }) => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tooltip, setTooltip] = useState<{ item: any; visible: boolean; x: number; y: number }>({ item: null, visible: false, x: 0, y: 0 });

  // V1 sections collapsed by default
  const [isRiskExpanded, setIsRiskExpanded] = useState(false);
  const [isStrongExpanded, setIsStrongExpanded] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => setIsRefreshing(false), 400);
    return () => clearTimeout(timer);
  }, [dateRange, variant]);

  const processedData = useMemo(() => {
    const mult = getDateMultiplier(dateRange);
    
    return MOCK_HEALTH_BASE.map(item => {
      // Dramatic shifts based on range
      const rangeShift = dateRange === 'Last 7 days' ? (Math.random() > 0.5 ? 20 : -20) : 
                        dateRange === 'Last 12 months' ? 0 : 
                        dateRange === 'Last 90 days' ? 10 : 0;
      
      const healthScore = Math.min(98, Math.max(5, Math.round(item.baseHealth + rangeShift)));
      
      const hygieneVariance = (Math.sin(mult * 15) * 10);
      const hygieneValue = Math.min(100, Math.max(0, Math.round(item.hygieneBase + hygieneVariance)));
      
      const periodLabel = dateRange.includes('7 days') ? 'Weekly' : dateRange.includes('30 days') ? 'Monthly' : dateRange.includes('90 days') ? 'Quarterly' : 'Yearly';
      
      const jitter = (item.name.charCodeAt(1) % 40) - 20; 

      return {
        ...item,
        healthScore,
        hygiene: hygieneValue,
        jitter,
      };
    });
  }, [dateRange]);

  const atRiskAccounts = useMemo(() => processedData.filter(r => r.healthScore < 50), [processedData]);
  const strongAccounts = useMemo(() => processedData.filter(r => r.healthScore >= 50), [processedData]);

  return (
    <Card>
      <SectionHeader 
        title="Relationship health" 
        tooltip="A continuous spectrum analysis of customer stability. V1 groups accounts into Risk and Strong buckets, while V2 plots them dynamically across a health gradient."
        filterContent={
          <div className="flex flex-row items-center gap-[16px]">
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
      <div className={`px-6 py-6 flex flex-col gap-6 ${isRefreshing ? 'animate-refresh' : ''}`}>
        {variant === 'V1' ? (
          <div className="flex flex-col gap-4">
            <div className="border border-[#FCE8E6] rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#C5221F] group/risk">
              <button 
                onClick={() => setIsRiskExpanded(!isRiskExpanded)}
                className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors bg-[#FCF3F2]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#FCE8E6] text-[#C5221F]">
                    <i className="google-symbols !text-[20px]">{isRiskExpanded ? 'keyboard_arrow_down' : 'chevron_right'}</i>
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#C5221F]">AT RISK</span>
                </div>
                <span className="text-[11px] text-[#C5221F] font-bold bg-white/60 px-2.5 py-1 rounded-full border border-[#FCE8E6]">{atRiskAccounts.length} accounts</span>
              </button>
              {isRiskExpanded && (
                <div className={`p-4 grid gap-3 bg-white border-t border-[#FCE8E6] animate-in slide-in-from-top-1 duration-200 ${atRiskAccounts.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {atRiskAccounts.length > 0 ? atRiskAccounts.map((r, idx) => (
                    <HealthItem key={idx} item={r} showIntervention={true} />
                  )) : (
                    <div className="py-6 text-center text-[#C5221F] text-[12px] italic bg-gray-50 rounded-xl border border-dashed border-[#FCE8E6] col-span-2">No accounts in critical risk.</div>
                  )}
                </div>
              )}
            </div>

            <div className="border border-[#CEEAD6] rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#137333] group/strong">
              <button 
                onClick={() => setIsStrongExpanded(!isStrongExpanded)}
                className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors bg-[#E6F4EA]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#CEEAD6] text-[#137333]">
                    <i className="google-symbols !text-[20px]">{isStrongExpanded ? 'keyboard_arrow_down' : 'chevron_right'}</i>
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#137333]">STRONG</span>
                </div>
                <span className="text-[11px] text-[#137333] font-bold bg-white/60 px-2.5 py-1 rounded-full border border-[#CEEAD6]">{strongAccounts.length} accounts</span>
              </button>
              {isStrongExpanded && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white border-t border-[#CEEAD6] animate-in slide-in-from-top-1 duration-200">
                  {strongAccounts.length > 0 ? strongAccounts.map((r, idx) => (
                    <HealthItem key={idx} item={r} />
                  )) : (
                    <div className="py-6 text-center text-[#137333] text-[12px] italic bg-gray-50 rounded-xl border border-dashed border-[#CEEAD6] col-span-2">No high-stability accounts found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Full Horizontal Gradient Background Visualization */}
            <div className="relative w-full h-[220px] rounded-[32px] overflow-visible border border-[#DADCE0] bg-gradient-to-r from-[#FCE8E6] via-[#F8F9FA] to-[#E6F4EA] shadow-inner p-12">
              
              {/* Spectrum Labels with Integrated Counts */}
              <div className="absolute inset-x-12 top-6 flex items-center justify-between px-2">
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-black text-[#C5221F] uppercase tracking-[0.2em]">AT RISK ({atRiskAccounts.length})</span>
                  <span className="text-[9px] font-medium text-[#C5221F] opacity-70">Lower Stability</span>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-[11px] font-black text-[#137333] uppercase tracking-[0.2em]">STRONG ({strongAccounts.length})</span>
                  <span className="text-[9px] font-medium text-[#137333] opacity-70">High Momentum</span>
                </div>
              </div>

              {/* Dynamic Account Plotting Area */}
              <div className="absolute inset-x-12 top-0 bottom-0 z-20 overflow-visible">
                {processedData.map((item, idx) => {
                  const xPos = `${item.healthScore}%`;
                  const yPos = `calc(50% + ${item.jitter}px)`;
                  const isHovered = tooltip.visible && tooltip.item?.name === item.name;
                  
                  return (
                    <div 
                      key={idx}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group/bubble cursor-help transition-all duration-700 ease-out ${isHovered ? 'z-50' : 'z-20'}`}
                      style={{ left: xPos, top: yPos }}
                      onMouseEnter={(e) => setTooltip({ item, visible: true, x: e.clientX, y: e.clientY })}
                      onMouseMove={(e) => setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }))}
                      onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
                    >
                      <div className={`w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                        isHovered ? 'scale-150 shadow-[0_8px_32px_rgba(0,0,0,0.15)]' : 'shadow-sm'
                      } ${
                        item.healthScore < 50 ? (isHovered ? 'border-[#C5221F]' : 'border-[#FCE8E6]') : 
                        (isHovered ? 'border-[#137333]' : 'border-[#CEEAD6]')
                      }`}>
                        <CompanyLogo name={item.name} className="w-8 h-8" />
                        <div className={`absolute inset-0 opacity-0 group-hover/bubble:opacity-10 transition-opacity ${
                          item.healthScore < 50 ? 'bg-[#C5221F]' : 'bg-[#137333]'
                        }`} />
                      </div>
                      <div className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                         <span className="text-[11px] font-bold text-[#202124] bg-white/95 px-2.5 py-1 rounded-full border border-[#DADCE0] shadow-md">
                           {item.name} ({item.healthScore}%)
                         </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <HealthTooltip {...tooltip} />
          </div>
        )}
        <div className="mt-4">
          <ConnectAIAlert content={processedData.length > 0 ? `Portfolio health spectrum for ${dateRange} reveals ${strongAccounts.length} high-momentum partners and ${atRiskAccounts.length} accounts in corrective cycles.` : `No active health data.`} />
        </div>
      </div>
      <CardFooter />
    </Card>
  );
};

const MOCK_SIGNALS = [
  { 
    companies: ['Red Bull', 'Dr Pepper'], 
    industry: 'Beverage',
    type: 'Tailwind', 
    impact: 'High', 
    factor: 'GenAI adoption', 
    detail: 'Rapid internal testing of creative automation tools for visual assets.' 
  },
  { 
    companies: ['Disney'], 
    industry: 'Entertainment',
    type: 'Headwind', 
    impact: 'Medium', 
    factor: 'Linear decline', 
    detail: 'Traditional TV budgets shifting but not fully captured by digital yet.',
    objections: ['Attribution gaps', 'Creative control loss']
  },
  { 
    companies: ['Burger King', 'McDonald\'s'], 
    industry: 'Food',
    type: 'Headwind', 
    impact: 'High', 
    factor: 'Pricing pressure', 
    detail: 'Rising CPMs in key search terms for QSR competitive landscape.',
    objections: ['Rising floor prices', 'Inventory saturation']
  },
  { 
    companies: ['McDonald\'s'], 
    industry: 'Food',
    type: 'Tailwind', 
    impact: 'Medium', 
    factor: 'App growth', 
    detail: 'Strong velocity in first-party data collection via loyalty app integration.' 
  },
  { 
    companies: ['Disney', 'Red Bull'], 
    industry: 'Mixed',
    type: 'Tailwind', 
    impact: 'High', 
    factor: 'First-party data', 
    detail: 'Leveraging CRM signals to drive high-intent audience modeling.' 
  },
  { 
    companies: ['Burger King'], 
    industry: 'Food',
    type: 'Headwind', 
    impact: 'High', 
    factor: 'Franchisee alignment', 
    detail: 'Pushback from local franchisees on national digital spend mandates.',
    objections: ['Local ROI visibility', 'Budget control'] 
  },
  { 
    companies: ['Dr Pepper'], 
    industry: 'Beverage',
    type: 'Tailwind', 
    impact: 'Medium', 
    factor: 'Seasonal campaigns', 
    detail: 'Early planning for summer sports sponsorships showing increased digital allocation.' 
  },
  { 
    companies: ['Disney', 'McDonald\'s'], 
    industry: 'Mixed',
    type: 'Headwind', 
    impact: 'Medium', 
    factor: 'Measurement fragmentation', 
    detail: 'Struggling to unify reach and frequency across CTV and mobile video.',
    objections: ['Siloed reporting', 'Duplicated reach'] 
  },
  { 
    companies: ['Red Bull'], 
    industry: 'Beverage',
    type: 'Tailwind', 
    impact: 'High', 
    factor: 'Creator partnerships', 
    detail: 'Scaling influencer whitelisting with highly efficient CPA.' 
  },
  { 
    companies: ['Burger King', 'Dr Pepper'], 
    industry: 'Mixed',
    type: 'Headwind', 
    impact: 'Low', 
    factor: 'Creative fatigue', 
    detail: 'Performance dropping on evergreen assets after 4 weeks in market.',
    objections: ['Production costs', 'Asset turnaround time'] 
  },
  { 
    companies: ['McDonald\'s', 'Disney'], 
    industry: 'Mixed',
    type: 'Tailwind', 
    impact: 'High', 
    factor: 'Omnichannel strategy', 
    detail: 'Successfully linking in-store/park visits to digital ad exposure.' 
  }
];

export const RiskRemediationCard: React.FC<{ variant: 'V1' | 'V2' }> = ({ variant }) => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [industry, setIndustry] = useState('All industries');
  const [type, setType] = useState('Headwinds');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const industries = ['All industries', 'Beverage', 'Food', 'Entertainment'];
  const types = ['Headwinds', 'Tailwinds'];

  useEffect(() => {
    setIsRefreshing(true);
    setCarouselIndex(0);
    const timer = setTimeout(() => setIsRefreshing(false), 400);
    return () => clearTimeout(timer);
  }, [dateRange, industry, type, variant]);

  const filteredSignals = useMemo(() => {
    let base = MOCK_SIGNALS;
    
    // Filter by Type
    const targetType = type === 'Headwinds' ? 'Headwind' : 'Tailwind';
    base = base.filter(s => s.type === targetType);

    // Filter by Industry
    if (industry !== 'All industries') {
      base = base.filter(s => s.industry === industry || s.industry === 'Mixed');
    }
    
    return base;
  }, [industry, dateRange, type]);

  return (
    <Card>
      <SectionHeader 
        title="Risk remediation" 
        tooltip="Identifying external market factors and internal customer dynamics influencing performance."
        filterContent={
          <div className="flex flex-row items-center gap-[16px]">
            <BtnDropdown 
              btnText="Select Type" 
              labelText="Type" 
              selectedOption={type} 
              menuItems={types} 
              onSelect={setType}
              showIcons={false}
            />
            <BtnDropdown 
              btnText="Select Industry" 
              labelText="Industry" 
              selectedOption={industry} 
              menuItems={industries} 
              onSelect={setIndustry}
              showIcons={false}
            />
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
      <div className={`px-6 py-6 flex flex-col gap-6 ${isRefreshing ? 'animate-refresh' : ''}`}>
        {variant === 'V1' ? (
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
                  className="flex gap-4 items-stretch"
                  animate={{ x: filteredSignals.length > 2 ? `calc(-${carouselIndex * 50}% - ${carouselIndex * 8}px)` : '0%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {filteredSignals.length > 0 ? filteredSignals.map((s, idx) => (
                    <div key={idx} className={`${filteredSignals.length === 1 ? 'w-full' : 'min-w-[calc(50%-8px)]'} flex-shrink-0`}>
                      <div className={`p-4 border border-[#DADCE0] bg-white rounded-xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-all h-full border-l-4 ${s.type === 'Tailwind' ? 'border-l-[#1e8e3e]' : 'border-l-[#d93025]'}`}>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-[14px] text-[#202124] leading-tight">{s.factor}</span>
                          <Badge type={s.type === 'Tailwind' ? 'success' : 'error'}>{s.type}</Badge>
                        </div>
                        <p className="text-[13px] text-[#5F6368] font-medium leading-relaxed">{s.detail}</p>
                        
                        {s.objections && (
                          <div className="bg-[#FCF3F2] p-2 rounded-lg border border-[#FCE8E6]">
                            <span className="text-[10px] font-bold text-[#C5221F] uppercase tracking-tight block mb-1">Top Objections:</span>
                            <div className="flex flex-wrap gap-2">
                              {s.objections.map(obj => (
                                <span key={obj} className="text-[11px] text-[#C5221F] font-bold">• {obj}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-[#F1F3F4]">
                          <span className="text-[10px] font-bold text-[#919191] uppercase tracking-tighter mr-1">Accounts:</span>
                          {s.companies.map(c => (
                            <div key={c} className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-md">
                              <CompanyLogo name={c} className="w-3 h-3" />
                              <span className="text-[11px] text-[#3C4043] font-medium">{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="w-full py-12 text-center text-[#5F6368] italic bg-gray-50 rounded-xl border border-dashed border-[#DADCE0]">
                      No {type.toLowerCase()} identified for this segment.
                    </div>
                  )}
                </motion.div>
              </div>

              <button
                onClick={() => setCarouselIndex(prev => Math.min(filteredSignals.length - 2, prev + 1))}
                disabled={filteredSignals.length <= 2 || carouselIndex >= filteredSignals.length - 2}
                className={`shrink-0 p-2 rounded-full border border-[#DADCE0] bg-white shadow-sm transition-all ${filteredSignals.length <= 2 || carouselIndex >= filteredSignals.length - 2 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer hover:shadow-md active:scale-95'}`}
              >
                <ChevronRight className="w-5 h-5 text-[#5F6368]" />
              </button>
            </div>

            {filteredSignals.length > 2 && (
              <div className="flex justify-center gap-2 mt-2">
                {Array.from({ length: Math.max(0, filteredSignals.length - 1) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${carouselIndex === i ? 'bg-[#1a73e8] w-4' : 'bg-[#DADCE0] hover:bg-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className={`border ${type === 'Tailwinds' ? 'border-[#CEEAD6] hover:border-[#137333]' : 'border-[#FCE8E6] hover:border-[#C5221F]'} rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md group/risk`}>
              <button 
                onClick={() => setCarouselIndex(prev => prev === 1 ? 0 : 1)} // Reusing carouselIndex for expanded state
                className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${type === 'Tailwinds' ? 'bg-[#E6F4EA]' : 'bg-[#FCF3F2]'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white border ${type === 'Tailwinds' ? 'border-[#CEEAD6] text-[#137333]' : 'border-[#FCE8E6] text-[#C5221F]'}`}>
                    <i className="google-symbols !text-[20px]">{carouselIndex === 1 ? 'keyboard_arrow_down' : 'chevron_right'}</i>
                  </div>
                  <span className={`text-[13px] font-bold uppercase tracking-[0.05em] ${type === 'Tailwinds' ? 'text-[#137333]' : 'text-[#C5221F]'}`}>{type.toUpperCase()}</span>
                </div>
                <span className={`text-[11px] font-bold bg-white/60 px-2.5 py-1 rounded-full border ${type === 'Tailwinds' ? 'text-[#137333] border-[#CEEAD6]' : 'text-[#C5221F] border-[#FCE8E6]'}`}>{filteredSignals.length} signals</span>
              </button>
              {carouselIndex === 1 && (
                <div className={`p-4 grid gap-3 bg-white border-t ${type === 'Tailwinds' ? 'border-[#CEEAD6]' : 'border-[#FCE8E6]'} animate-in slide-in-from-top-1 duration-200 grid-cols-1 md:grid-cols-2`}>
                  {filteredSignals.length > 0 ? filteredSignals.map((s, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-xl border border-[#DADCE0] shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3 pb-2 border-b border-[#F1F3F4]">
                        <span className="font-bold text-[14px] text-[#202124] leading-tight">{s.factor}</span>
                        <Badge type={s.type === 'Tailwind' ? 'success' : 'error'}>{s.type}</Badge>
                      </div>
                      <p className="text-[13px] text-[#5F6368] font-medium leading-relaxed mb-3">{s.detail}</p>
                      
                      {s.objections && (
                        <div className="bg-[#FCF3F2] p-2 rounded-lg border border-[#FCE8E6] mb-3">
                          <span className="text-[10px] font-bold text-[#C5221F] uppercase tracking-tight block mb-1">Top Objections:</span>
                          <div className="flex flex-wrap gap-2">
                            {s.objections.map(obj => (
                              <span key={obj} className="text-[11px] text-[#C5221F] font-bold">• {obj}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-[#F1F3F4]">
                        <span className="text-[10px] font-bold text-[#919191] uppercase tracking-tighter mr-1">Accounts:</span>
                        {s.companies.map(c => (
                          <div key={c} className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F8F9FA] border border-[#DADCE0] rounded-md">
                            <CompanyLogo name={c} className="w-3 h-3" />
                            <span className="text-[11px] text-[#3C4043] font-medium">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div className={`py-6 text-center text-[12px] italic bg-gray-50 rounded-xl border border-dashed col-span-2 ${type === 'Tailwinds' ? 'text-[#137333] border-[#CEEAD6]' : 'text-[#C5221F] border-[#FCE8E6]'}`}>
                      No {type.toLowerCase()} identified for this segment.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <ConnectAIAlert content={`Net momentum is ${type === 'Tailwinds' ? 'positive' : 'cautious'} for the ${industry.toLowerCase()} segment based on ${dateRange} signals.`} />
      </div>
      <CardFooter />
    </Card>
  );
};
