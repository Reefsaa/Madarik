import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const { mode, isLoading: modeLoading } = useAppMode();

  // Wait for both async stores to resolve before routing
  if (authLoading || modeLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#4f46e5" size="large" />
      </View>
    );
  }

  // Mode is the PRIMARY gateway — must be chosen before auth
  if (!mode) return <Redirect href="/(auth)/mode-select" />;
  if (!user)  return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)/" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#04071a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
