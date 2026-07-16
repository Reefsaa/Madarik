import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const { mode, isLoading: modeLoading } = useAppMode();

  if (authLoading || modeLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0e27' }}>
        <ActivityIndicator color="#4f46e5" size="large" />
      </View>
    );
  }

  // Mode selection is the PRIMARY gateway — must happen before auth
  if (!mode) return <Redirect href="/(auth)/mode-select" />;
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)/" />;
}
