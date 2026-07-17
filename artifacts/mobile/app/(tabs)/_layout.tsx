import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAppMode } from '@/context/AppModeContext';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const safeAreaInsets = useSafeAreaInsets();
  const { mode } = useAppMode();
  const isBusiness = mode === 'business';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          paddingBottom: safeAreaInsets.bottom,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
          ) : null,
      }}
    >
      {/* ── Home / Dashboard ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: isBusiness ? 'Dashboard' : 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name={isBusiness ? 'grid-outline' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* ── Cash Flow (Business only) ── */}
      <Tabs.Screen
        name="cashflow"
        options={{
          title: 'Cash Flow',
          href: isBusiness ? undefined : null,
          tabBarIcon: ({ color }) => <Ionicons name="water-outline" size={22} color={color} />,
        }}
      />

      {/* ── AI Assistant / Ask Modrik ── */}
      <Tabs.Screen
        name="ai"
        options={{
          title: 'Modrik',
          tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" size={22} color={color} />,
        }}
      />

      {/* ── Analytics / Insights ── */}
      <Tabs.Screen
        name="insights"
        options={{
          title: isBusiness ? 'Analytics' : 'Insights',
          tabBarIcon: ({ color }) => (
            <Ionicons name={isBusiness ? 'bar-chart-outline' : 'trending-up-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* ── Profile (Business) / Settings (Personal) ── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: isBusiness ? undefined : null,
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          href: isBusiness ? null : undefined,
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
        }}
      />

      {/* ── Hidden dead screens ── */}
      <Tabs.Screen name="accounts"  options={{ href: null }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
    </Tabs>
  );
}
