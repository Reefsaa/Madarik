import { useAppMode } from '@/context/AppModeContext';
import BusinessHome from '@/components/BusinessHome';
import PersonalHome from '@/components/PersonalHome';

export default function HomeTab() {
  const { mode } = useAppMode();
  return mode === 'personal' ? <PersonalHome /> : <BusinessHome />;
}
