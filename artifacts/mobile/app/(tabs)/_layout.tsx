import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="accounts">
        <Icon sf={{ default: 'briefcase', selected: 'briefcase.fill' }} />
        <Label>Accounts</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ai">
        <Icon sf={{ default: 'sparkles', selected: 'sparkles' }} />
        <Label>Modrik</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="analytics">
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <Label>Analytics</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
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
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="grid-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="briefcase.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="briefcase-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'Modrik',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="sparkles" tintColor={color} size={24} />
            ) : (
              <Ionicons name="sparkles-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="chart.bar.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="stats-chart-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
