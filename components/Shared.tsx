
import React, { useState, useRef, useEffect } from 'react';

export const getCompanyDomain = (name: string): string => {
  const mapping: Record<string, string> = {
    'Red Bull': 'redbull.com',
    'Burger King': 'bk.com',
    'Dr Pepper': 'drpepper.com',
    'McDonald\'s': 'mcdonalds.com',
    'Amazon': 'amazon.com',
    'Disney': 'disney.com',
    'TikTok': 'tiktok.com',
    'Meta': 'meta.com',
    'Apple': 'apple.com',
    'Microsoft': 'microsoft.com',
    'Instagram': 'instagram.com',
    'LinkedIn': 'linkedin.com',
    'Target': 'target.com',
    'Costco': 'costco.com',
    'Nike': 'nike.com',
    'Pinterest': 'pinterest.com',
    'Snapchat': 'snapchat.com',
    'Reddit': 'reddit.com'
  };
  return mapping[name] || `${name.toLowerCase().replace(/\s/g, '')}.com`;
};

export const getLogoUrl = (name: string) => {
  const domain = getCompanyDomain(name);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

export const CompanyLogo: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => {
  if (!name || name === 'All accounts' || name === 'All companies' || name === 'All competitors' || name === 'Select Company') return null;
  return (
    <img 
      src={getLogoUrl(name)} 
      alt="" 
      className={`w-4 h-4 rounded-sm object-contain shrink-0 bg-white shadow-sm border border-black/5 ${className}`} 
    />
  );
};

export interface SentimentBlurb {
  company: string;
  text: string;
}

export const ChartTooltip: React.FC<any> = ({ active, payload, label, titleKey = 'name', valueKey = 'value', metricLabel = 'Value', sentimentsKey = 'sentiments', extraInfoKey, prefix = "", suffix = "" }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data[valueKey];
    const formattedValue = typeof value === 'number' 
      ? `${prefix}${value.toFixed(1)}${suffix}` 
      : `${prefix}${value}${suffix}`;
    
    const sentiments: SentimentBlurb[] = data[sentimentsKey] || [];
    
    return (
      <div 
        className="bg-white border border-[#DADCE0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-4 min-w-[300px] z-[9999] pointer-events-none select-none animate-in fade-in duration-150"
      >
        <div className="flex justify-between items-center mb-3 border-b border-[#F1F3F4] pb-2 gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <CompanyLogo name={data[titleKey] || label} />
            <span className="font-bold text-[14px] text-[#202124] truncate">{data[titleKey] || label}</span>
          </div>
          <span className="text-[14px] font-bold text-[#1A73E8] shrink-0">
            {metricLabel ? `${metricLabel}: ${formattedValue}` : formattedValue}
          </span>
        </div>
        
        {data.sourceLabel && (
          <div className="mb-3">
             <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider block mb-1">Channel Sources</span>
             <p className="text-[12px] text-[#202124] font-medium">{data.sourceLabel}</p>
          </div>
        )}

        <div className="space-y-3">
          <span className="font-bold block text-[#5F6368] uppercase text-[10px] tracking-wider opacity-70">Account Sentiments</span>
          {sentiments.length > 0 ? (
            sentiments.map((s, idx) => (
              <div key={idx} className="border-l-2 border-[#1A73E8]/20 pl-2">
                <div className="flex items-center gap-2 mb-1">
                  <CompanyLogo name={s.company} />
                  <span className="text-[11px] font-bold text-[#3C4043]">{s.company}</span>
                </div>
                <p className="text-[12px] text-[#3C4043] leading-relaxed italic">
                  "{s.text}"
                </p>
              </div>
            ))
          ) : extraInfoKey && data[extraInfoKey] ? (
            <div className="border-l-2 border-[#1A73E8]/20 pl-2">
              <p className="text-[12px] text-[#3C4043] leading-relaxed italic">
                "{data[extraInfoKey]}"
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-[#5F6368] italic">No specific sentiments recorded for this period.</p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

interface BtnDropdownProps {
  btnText: string;
  menuItems: string[];
  onSelect: (val: string) => void;
  selectedOption: string;
  labelText?: string;
  layout?: 'row' | 'col';
  showIcons?: boolean;
}

export const BtnDropdown: React.FC<BtnDropdownProps> = ({
  btnText,
  menuItems,
  onSelect,
  selectedOption,
  labelText,
  layout = 'row',
  showIcons = true
}) => {
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
    <div className={`flex text-[13px] ${layout === 'col' ? 'flex-col' : 'flex-row gap-[4px] items-center'}`} ref={containerRef}>
      {labelText && (
        <span className="text-[#474747]">{labelText}</span>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-[12px] py-[4px] rounded-[8px] border-[1px] border-[#919191] focus:border-transparent focus:ring-2 ring-[#3271EA] gap-[2px] flex items-center bg-transparent cursor-pointer min-h-[32px] hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showIcons && <CompanyLogo name={selectedOption} />}
            <span className="text-[#474747] font-medium">{selectedOption || btnText}</span>
          </div>
          <i className="google-symbols mr-[-4px] ml-auto text-[#474747]">arrow_drop_down</i>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] flex flex-col rounded-[8px] bg-white py-[8px] shadow-[0_4px_8px_3px_rgba(0,0,0,0.15),0_1px_3px_0_rgba(0,0,0,0.30)] z-[1000]">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {menuItems.map((item) => {
                const isSelected = item === selectedOption;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                    }}
                    className={`flex items-center text-[#202124] justify-start px-[16px] py-[10px] text-[14px] w-full text-left border-none cursor-pointer hover:bg-gray-100 relative ${
                      isSelected ? 'bg-[#E7F2FF]' : ''
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-[0px] w-[3px] h-full bg-[#1967D2]" />
                    )}
                    <div className="flex items-center gap-2">
                      {showIcons && <CompanyLogo name={item} />}
                      <span className="truncate">{item}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CardFilters: React.FC<{
  company: string;
  setCompany: (v: string) => void;
  dateRange: string;
  setDateRange: (v: string) => void;
}> = ({ company, setCompany, dateRange, setDateRange }) => {
  const accounts = ['All accounts', 'Red Bull', 'Burger King', 'Dr Pepper', 'McDonald\'s', 'Disney'];
  const dates = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months'];

  return (
    <div className="flex flex-row items-center gap-[16px]">
      <BtnDropdown 
        btnText="Select Account" 
        labelText="Account" 
        selectedOption={company} 
        menuItems={accounts} 
        onSelect={setCompany} 
      />
      <BtnDropdown 
        btnText="Select Range" 
        labelText="Date range" 
        selectedOption={dateRange} 
        menuItems={dates} 
        onSelect={setDateRange}
        showIcons={false}
      />
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`box-border flex flex-col bg-white border border-[#DADCE0] rounded-[12px] w-full h-auto relative overflow-visible ${className}`}>
    {children}
  </div>
);

export const SectionHeader: React.FC<{ 
  title: string; 
  subtitle?: string;
  tooltip?: string;
  actions?: React.ReactNode;
  filterContent?: React.ReactNode;
}> = ({ title, subtitle, tooltip, actions, filterContent }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`w-full flex flex-col border-b border-[#DADCE0] bg-white shrink-0 relative rounded-t-[12px] ${showTooltip ? 'z-[10001]' : 'z-[500]'}`}>
      <div className={`flex flex-row items-center px-6 ${subtitle ? 'py-4 min-h-[64px]' : 'h-16'} gap-4`}>
        <div className="flex flex-col flex-1 min-w-0 justify-center">
          <div className="flex items-center gap-2">
            <h3 className="text-[20px] font-normal text-[#202124] leading-7 truncate font-['Google_Sans']">
              {title}
            </h3>
            <div 
              className="relative flex items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button className="text-[#5F6368] hover:text-[#202124] transition-colors focus:outline-none p-1">
                <i className="google-symbols !text-[20px]">help</i>
              </button>
              {showTooltip && tooltip && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[10000] w-72 p-4 bg-[#202124] text-white text-[13px] leading-relaxed rounded-xl shadow-2xl border border-white/10 pointer-events-none animate-in fade-in duration-150">
                  <div className="absolute left-0 -translate-x-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#202124] rotate-45" />
                  {tooltip}
                </div>
              )}
            </div>
          </div>
          {subtitle && (
            <p className="text-[12px] text-[#5F6368] leading-tight mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-row justify-end items-center shrink-0 h-12 gap-2">
          {actions}
        </div>
      </div>
      {filterContent && (
        <div className="flex flex-row items-center px-6 min-h-[56px] bg-white pb-3 overflow-visible relative z-[600]">
          {filterContent}
        </div>
      )}
    </div>
  );
};

export const CardFooter: React.FC<{ onAction?: () => void; label?: string }> = ({ onAction, label = "" }) => (
  <div className="w-full flex flex-row items-center px-6 h-14 border-t border-[#DADCE0] bg-white mt-auto shrink-0 rounded-b-[12px] z-[40]">
    <div className="flex flex-row items-center flex-1 h-12">
      <button className="flex justify-center items-center w-10 h-10 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#5F6368]">
        <i className="google-symbols !text-[20px]">chat_bubble_outline</i>
      </button>
    </div>
  </div>
);

export const ConnectAIAlert: React.FC<{ content?: string; className?: string }> = ({ content, className = "" }) => {
  const placeholderText = "Based on recent conversational signals, there is a 24% uplift potential if you address attribution clarity early.";
  return (
    <div className={`box-border flex flex-row items-start px-[16px] py-[14px] gap-[12px] w-full min-h-[48px] h-auto bg-[#FFFFFF] border border-[#1A73E8] rounded-[12px] shrink-0 shadow-sm ${className}`}>
      <div className="flex items-center justify-center w-[24px] h-[24px] shrink-0">
        <i className="google-symbols !text-[22px] text-[#1967D2]">auto_awesome</i>
      </div>
      <div className="flex flex-col flex-1">
        <p className="text-[13px] leading-[20px] tracking-[0.1px] text-[#3C4043] font-['Roboto'] whitespace-normal break-words">
          <span className="font-bold text-[#1A73E8] mr-[6px] uppercase text-[11px] tracking-wider">Connect AI</span>
          {content || placeholderText}
        </p>
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; type?: 'success' | 'error' | 'warning' | 'info' }> = ({ children, type = 'info' }) => {
  const styles = {
    success: 'bg-[#E6F4EA] text-[#137333]',
    error: 'bg-[#FCE8E6] text-[#C5221F]',
    warning: 'bg-[#FEF7E0] text-[#B06000]',
    info: 'bg-[#E8F0FE] text-[#1A73E8]',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[type]}`}>
      {children}
    </span>
  );
};
