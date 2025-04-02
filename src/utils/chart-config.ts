import { ChartConfig } from '@/components/ui/chart';

export const userDashboardChartConfig = {
  you: {
    label: 'You',
    color: 'hsl(var(--chart-1))',
  },
  average: {
    label: 'Others',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const adminDashboardChartConfig = {
  highest: {
    label: 'Highest',
    color: 'hsl(var(--chart-1))',
  },
  lowest: {
    label: 'Lowest',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;
