import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const { mode, isLoading: modeLoading } = useAppMode();

  if (authLoading || modeLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator color="#4f46e5" size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/" />;
  if (!mode) return <Redirect href="/(auth)/mode-select" />;
  return <Redirect href="/(tabs)/" />;
}
