import { Timestamp } from 'firebase/firestore';

export interface AssessmentData {
  createdAt: Timestamp;
  date: string;
  day: string;
  confidence: number;
}

export interface ChartDataPoint {
  you: number | null;
  average: number | null;
}

export interface AssessmentResultItem {
  id: string;
  level: string;
  confidence: number;
  date: string;
}

/**
 * Formatted date structure for UI display
 */
export interface FormattedDate {
  day: string;
  month: string;
}
