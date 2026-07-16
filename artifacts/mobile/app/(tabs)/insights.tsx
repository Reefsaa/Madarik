import { useAppMode } from '@/context/AppModeContext';
import BusinessInsights from '@/components/BusinessInsights';
import SmartInsights from '@/components/SmartInsights';

export default function InsightsTab() {
  const { mode } = useAppMode();
  return mode === 'personal' ? <SmartInsights /> : <BusinessInsights />;
}
