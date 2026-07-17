import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const PERIODS = ['30D', '60D', '90D', '1Y'] as const;
type Period = (typeof PERIODS)[number];

const REVENUE_DATA: Record<Period, number[]> = {
  '30D': [28, 34, 22, 40, 31, 47, 25, 38, 18, 44, 29, 41],
  '60D': [24, 31, 28, 39, 33, 45, 27, 36, 22, 41, 30, 44],
  '90D': [20, 27, 32, 35, 29, 42, 24, 33, 26, 38, 28, 40],
  '1Y':  [18, 24, 30, 33, 27, 38, 22, 31, 25, 35, 26, 39],
};

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();
  const [period, setPeriod] = useState<Period>('30D');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bars = REVENUE_DATA[period];
  const maxBar = Math.max(...bars);

  const EXPENSE_CATEGORIES = [
    { label: t('analyticsPayroll'),   pct: 35, color: '#4f46e5', amount: 'SAR 85,750' },
    { label: t('analyticsOperations'),pct: 22, color: '#818cf8', amount: 'SAR 53,900' },
    { label: t('analyticsSuppliers'), pct: 18, color: '#a5b4fc', amount: 'SAR 44,100' },
    { label: t('analyticsRentUtil'),  pct: 15, color: '#c7d2fe', amount: 'SAR 36,750' },
    { label: t('analyticsOther'),     pct: 10, color: '#e0e7ff', amount: 'SAR 24,500' },
  ];

  const KPIS = [
    { label: t('analyticsGrossMargin'), value: '32.4%',       change: '+2.1%', positive: true },
    { label: t('analyticsNetMargin'),   value: '21.0%',       change: '+1.8%', positive: true },
    { label: t('analyticsROI'),         value: '18.6%',       change: '+0.9%', positive: true },
    { label: t('analyticsBurnRate'),    value: 'SAR 8,166/d', change: '-3.2%', positive: true },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={isRTL ? { alignItems: 'flex-end' } : undefined}>
            <Text style={styles.headerTitle}>{t('analyticsTitle')}</Text>
            <Text style={styles.headerSub}>{t('analyticsSubtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.exportBtn} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={16} color="#a5b4fc" />
          </TouchableOpacity>
        </View>

        {/* Summary KPIs */}
        <View style={styles.summaryRow}>
          {[
            { label: t('analyticsRevenue'),  value: 'SAR 310K', change: '+12%',  positive: true  },
            { label: t('analyticsExpenses'), value: 'SAR 245K', change: '+3.2%', positive: false },
            { label: t('analyticsNetProfit'),value: 'SAR 65K',  change: '+21%',  positive: true  },
          ].map((s) => (
            <View key={s.label} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{s.label}</Text>
              <Text style={styles.summaryValue}>{s.value}</Text>
              <View style={styles.changeBadge}>
                <Ionicons name={s.positive ? 'arrow-up-outline' : 'arrow-down-outline'} size={9} color={s.positive ? '#86efac' : '#fca5a5'} />
                <Text style={[styles.changeText, { color: s.positive ? '#86efac' : '#fca5a5' }]}>{s.change}</Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Period selector */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity key={p} style={[styles.periodBtn, period === p && styles.periodBtnActive]} onPress={() => setPeriod(p)} activeOpacity={0.8}>
              <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Revenue chart */}
        <View style={styles.card}>
          <View style={[styles.cardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.cardTitle}>{t('analyticsRevenueTrend')}</Text>
            <Text style={styles.cardSub}>SAR 310,000 avg/month</Text>
          </View>
          <View style={styles.chart}>
            {bars.map((v, i) => (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: (v / maxBar) * 90, backgroundColor: i === bars.length - 1 ? '#4f46e5' : '#c7d2fe' }]} />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
              <Text key={i} style={styles.chartLabel}>{m}</Text>
            ))}
          </View>
        </View>

        {/* KPIs */}
        <View style={styles.kpiGrid}>
          {KPIS.map((k) => (
            <View key={k.label} style={styles.kpiCard}>
              <Text style={[styles.kpiLabel, isRTL && { textAlign: 'right' }]}>{k.label}</Text>
              <Text style={[styles.kpiValue, isRTL && { textAlign: 'right' }]}>{k.value}</Text>
              <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name={k.positive ? 'trending-up-outline' : 'trending-down-outline'} size={11} color={k.positive ? '#22c55e' : '#ef4444'} />
                <Text style={[styles.kpiChange, { color: k.positive ? '#22c55e' : '#ef4444' }]}> {k.change}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Expense breakdown */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 16 }, isRTL && { textAlign: 'right' }]}>{t('analyticsExpenseBreakdown')}</Text>
          {EXPENSE_CATEGORIES.map((c) => (
            <View key={c.label} style={[styles.expenseRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.expenseLeft, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.expenseDot, { backgroundColor: c.color }, isRTL && { marginLeft: 8, marginRight: 0 }]} />
                <Text style={styles.expenseLabel}>{c.label}</Text>
              </View>
              <View style={styles.expenseRight}>
                <View style={styles.expenseBarBg}>
                  <View style={[styles.expenseBar, { width: `${c.pct}%` as any, backgroundColor: c.color }]} />
                </View>
                <Text style={styles.expenseAmount}>{c.amount}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Health score */}
        <View style={styles.healthCard}>
          <LinearGradient colors={['#4f46e5', '#7c3aed']} style={styles.healthGradient}>
            <View style={[styles.healthLeft, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={styles.healthLabel}>{t('analyticsHealthScore')}</Text>
              <Text style={styles.healthScore}>89 / 100</Text>
              <Text style={styles.healthDesc}>{t('analyticsHealthDesc')}</Text>
            </View>
            <View style={styles.healthRight}>
              <Ionicons name="shield-checkmark" size={48} color="rgba(255,255,255,0.2)" />
            </View>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 12, color: '#64748b', marginTop: 2, fontFamily: 'Inter_400Regular' },
  exportBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  summaryLabel: { fontSize: 9, color: '#94a3b8', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  changeBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  changeText: { fontSize: 10, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16 },
  periodRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6' },
  periodBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  periodBtnActive: { backgroundColor: '#4f46e5' },
  periodBtnText: { fontSize: 13, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold' },
  periodBtnTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#f3f4f6' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  cardSub: { fontSize: 11, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 3 },
  barCol: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chartLabels: { flexDirection: 'row', marginTop: 6 },
  chartLabel: { flex: 1, textAlign: 'center', fontSize: 9, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  kpiCard: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#f3f4f6' },
  kpiLabel: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  kpiValue: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4, fontFamily: 'Inter_700Bold' },
  kpiChange: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  expenseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  expenseLeft: { flexDirection: 'row', alignItems: 'center', width: 110 },
  expenseDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  expenseLabel: { fontSize: 12, color: '#374151', fontFamily: 'Inter_400Regular' },
  expenseRight: { flex: 1, marginLeft: 10, alignItems: 'flex-end' },
  expenseBarBg: { width: '100%', height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, marginBottom: 4 },
  expenseBar: { height: 6, borderRadius: 3 },
  expenseAmount: { fontSize: 11, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold' },
  healthCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 14 },
  healthGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  healthLeft: { flex: 1 },
  healthLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  healthScore: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  healthDesc: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontFamily: 'Inter_400Regular' },
  healthRight: { marginLeft: 16 },
});
