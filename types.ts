
export interface InsightData {
  id: string;
  category: string;
  title: string;
  value: string | number;
  trend?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
}

export interface CompetitorSignal {
  competitor: string;
  mentions: number;
  revenueDelta: number;
  impactScore: number;
}

export interface PitchData {
  product: string;
  stage: string;
  reaction: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
}

export interface JTBDVizProps {
  data: any;
  title: string;
  description?: string;
}
