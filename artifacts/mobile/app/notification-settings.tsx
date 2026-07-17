import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const NS_KEY = 'madarik_notif_settings_v1';

interface NSState {
  all: boolean; push: boolean; email: boolean;
  financial: boolean; ai: boolean; market: boolean; security: boolean;
}

const DEFAULT: NSState = { all: true, push: true, email: true, financial: true, ai: true, market: false, security: true };

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [prefs, setPrefs] = useState<NSState>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(NS_KEY).then(val => {
      if (val) setPrefs({ ...DEFAULT, ...JSON.parse(val) });
    }).catch(() => {});
  }, []);

  const update = (key: keyof NSState, val: boolean) => {
    let next: NSState;
    if (key === 'all') {
      next = { all: val, push: val, email: val, financial: val, ai: val, market: val, security: val };
    } else {
      next = { ...prefs, [key]: val, all: val ? prefs.all : false };
    }
    setPrefs(next);
    AsyncStorage.setItem(NS_KEY, JSON.stringify(next)).catch(() => {});
  };

  const ROWS: { key: keyof NSState; icon: string; label: string; desc: string; master?: boolean }[] = [
    { key: 'all',      icon: 'notifications',          label: t('notifSetAll'),      desc: t('notifSetAllDesc'),      master: true },
    { key: 'push',     icon: 'phone-portrait-outline',  label: t('notifSetPush'),     desc: t('notifSetPushDesc')      },
    { key: 'email',    icon: 'mail-outline',            label: t('notifSetEmail'),    desc: t('notifSetEmailDesc')     },
    { key: 'financial',icon: 'cash-outline',            label: t('notifSetFinancial'),desc: t('notifSetFinancialDesc') },
    { key: 'ai',       icon: 'sparkles-outline',        label: t('notifSetAi'),       desc: t('notifSetAiDesc')        },
    { key: 'market',   icon: 'trending-up-outline',     label: t('notifSetMarket'),   desc: t('notifSetMarketDesc')    },
    { key: 'security', icon: 'shield-outline',          label: t('notifSetSecurity'), desc: t('notifSetSecurityDesc')  },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('notifSetTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* Master toggle */}
        <View style={[s.card, { marginTop: 20 }]}>
          {(() => {
            const row = ROWS[0];
            return (
              <View style={[s.row, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[s.iconWrap, { backgroundColor: prefs.all ? '#eef2ff' : '#f3f4f6' }]}>
                  <Ionicons name={row.icon as any} size={18} color={prefs.all ? '#4f46e5' : '#9ca3af'} />
                </View>
                <View style={[s.rowInfo, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={s.rowLabel}>{row.label}</Text>
                  <Text style={s.rowDesc}>{row.desc}</Text>
                </View>
                <Switch value={prefs.all} onValueChange={v => update('all', v)} trackColor={{ false: '#e5e7eb', true: '#a5b4fc' }} thumbColor={prefs.all ? '#4f46e5' : '#f3f4f6'} />
              </View>
            );
          })()}
        </View>

        {/* Individual toggles */}
        <Text style={[s.sectionTitle, isRTL && { textAlign: 'right', marginRight: 16 }]}>
          {isRTL ? 'الإشعارات التفصيلية' : 'Individual Notifications'}
        </Text>
        <View style={s.card}>
          {ROWS.slice(1).map((row, i) => (
            <View key={row.key}>
              <View style={[s.row, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[s.iconWrap, { backgroundColor: prefs[row.key] ? '#eef2ff' : '#f3f4f6' }]}>
                  <Ionicons name={row.icon as any} size={18} color={prefs[row.key] ? '#4f46e5' : '#9ca3af'} />
                </View>
                <View style={[s.rowInfo, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={s.rowLabel}>{row.label}</Text>
                  <Text style={s.rowDesc}>{row.desc}</Text>
                </View>
                <Switch
                  value={prefs[row.key]}
                  onValueChange={v => update(row.key, v)}
                  trackColor={{ false: '#e5e7eb', true: '#a5b4fc' }}
                  thumbColor={prefs[row.key] ? '#4f46e5' : '#f3f4f6'}
                />
              </View>
              {i < ROWS.length - 2 && <View style={s.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backRTL: { marginRight: 0, marginLeft: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 20, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13 },
  iconWrap: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  rowDesc: { fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  divider: { height: 1, backgroundColor: '#f9fafb', marginLeft: 64 },
});
