import { useAppMode } from '@/context/AppModeContext';
import BusinessSettings from '@/components/BusinessSettings';
import PersonalSettings from '@/components/PersonalSettings';

export default function SettingsTab() {
  const { mode } = useAppMode();
  return mode === 'personal' ? <PersonalSettings /> : <BusinessSettings />;
}
