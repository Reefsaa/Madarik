import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import { AppModeProvider } from '@/context/AppModeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const LOGO = require('@/assets/images/madarik-logo.png');

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="loan-review" />
      <Stack.Screen name="upcoming-payments" />
      <Stack.Screen name="cash-flow" />
      <Stack.Screen name="ai-recommendations" />
      <Stack.Screen name="ai-report" />
      <Stack.Screen name="ai-alerts" />
      <Stack.Screen name="behavioral-assessment" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Branded splash instead of white blank screen
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.splash}>
        <Image source={LOGO} style={styles.splashLogo} resizeMode="contain" />
        <ActivityIndicator color="#4f46e5" size="large" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <LanguageProvider>
                <AuthProvider>
                  <AppModeProvider>
                    <RootLayoutNav />
                  </AppModeProvider>
                </AuthProvider>
              </LanguageProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#3533cd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 260,
    height: 170,
  },
});
