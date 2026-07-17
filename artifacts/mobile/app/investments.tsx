import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const HOLDINGS = [
  { ticker: '2222', nameEn: 'Saudi Aramco',       nameAr: 'أرامكو السعودية',    price: '32.15', change: '+1.20%', pos: true,  value: '8,037.50', qty: 250 },
  { ticker: '2010', nameEn: 'SABIC',              nameAr: 'سابك',               price: '89.40', change: '-0.45%', pos: false, value: '8,046.00', qty: 90  },
  { ticker: '7010', nameEn: 'STC',                nameAr: 'الاتصالات السعودية',  price: '45.20', change: '+0.80%', pos: true,  value: '6,780.00', qty: 150 },
  { ticker: '1120', nameEn: 'Al Rajhi Bank',      nameAr: 'مصرف الراجحي',      price: '88.60', change: '+1.52%', pos: true,  value: '5,316.00', qty: 60  },
];

const PERIODS = ['1W', '1M', '3M', 'YTD'];
const RETURNS: Record<string, { v: string; pos: boolean }> = {
  '1W':  { v: '+2.3%',  pos: true },
  '1M':  { v: '+5.8%',  pos: true },
  '3M':  { v: '+12.4%', pos: true },
  'YTD': { v: '+18.7%', pos: true },
};

export default function InvestmentsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [period, setPeriod] = useState('1M');
  const ret = RETURNS[period];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('investTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* Portfolio card */}
        <View style={s.portfolioCard}>
          <Text style={[s.pLabel, isRTL && { textAlign: 'right' }]}>{t('investPortfolio')}</Text>
          <Text style={[s.pValue, isRTL && { textAlign: 'right' }]}>SAR 28,179.50</Text>
          <View style={[s.badgeRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[s.badge, { backgroundColor: ret.pos ? '#d1fae5' : '#fee2e2' }]}>
              <Ionicons name={ret.pos ? 'trending-up' : 'trending-down'} size={12} color={ret.pos ? '#059669' : '#ef4444'} />
              <Text style={[s.badgeText, { color: ret.pos ? '#059669' : '#ef4444' }]}> {ret.v} · {period}</Text>
            </View>
          </View>
          <View style={s.tabs}>
            {PERIODS.map(p => (
              <TouchableOpacity key={p} style={[s.tab, p === period && s.tabActive]} onPress={() => setPeriod(p)}>
                <Text style={[s.tabText, p === period && s.tabTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Holdings */}
        <Text style={[s.sectionTitle, isRTL && { textAlign: 'right', marginRight: 16 }]}>{t('investHoldings')}</Text>
        <View style={s.listCard}>
          {HOLDINGS.map((h, i) => (
            <View key={h.ticker}>
              <TouchableOpacity style={[s.row, isRTL && { flexDirection: 'row-reverse' }]} activeOpacity={0.7}>
                <View style={s.tickerBox}>
                  <Text style={s.tickerText}>{h.ticker}</Text>
                </View>
                <View style={[s.rowInfo, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={s.rowName}>{language === 'ar' ? h.nameAr : h.nameEn}</Text>
                  <Text style={s.rowSub}>{h.qty} {isRTL ? 'سهم' : 'shr'} · SAR {h.price}</Text>
                </View>
                <View style={[s.rowRight, isRTL && { alignItems: 'flex-start' }]}>
                  <Text style={s.rowValue}>SAR {h.value}</Text>
                  <Text style={[s.rowChange, { color: h.pos ? '#059669' : '#ef4444' }]}>{h.change}</Text>
                </View>
              </TouchableOpacity>
              {i < HOLDINGS.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.addBtn} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#4f46e5" />
          <Text style={s.addBtnText}>{t('investAddInv')}</Text>
        </TouchableOpacity>
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
  portfolioCard: { backgroundColor: '#fff', borderRadius: 20, marginHorizontal: 16, marginTop: 16, padding: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  pLabel: { fontSize: 12, color: '#9ca3af', fontFamily: 'Inter_400Regular', marginBottom: 4 },
  pValue: { fontSize: 32, fontWeight: '800', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 10 },
  badgeRow: { flexDirection: 'row', marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, backgroundColor: '#f3f4f6' },
  tabActive: { backgroundColor: '#4f46e5' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold' },
  tabTextActive: { color: '#fff' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 22, marginBottom: 10 },
  listCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
  tickerBox: { width: 48, height: 48, borderRadius: 13, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  tickerText: { fontSize: 10, fontWeight: '700', color: '#4f46e5', fontFamily: 'Inter_700Bold', textAlign: 'center' },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  rowSub: { fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  rowRight: { alignItems: 'flex-end' },
  rowValue: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  rowChange: { fontSize: 12, fontWeight: '600', marginTop: 2, fontFamily: 'Inter_600SemiBold' },
  divider: { height: 1, backgroundColor: '#f9fafb', marginLeft: 74 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginTop: 12, paddingVertical: 14, borderWidth: 1, borderColor: '#e0e7ff' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
});
