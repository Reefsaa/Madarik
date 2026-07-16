import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator color="#4f46e5" size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/" />;
  }

  return <Redirect href="/(auth)/" />;
}
