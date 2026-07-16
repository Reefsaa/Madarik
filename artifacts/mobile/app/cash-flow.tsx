import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Period = '30D' | '60D' | '90D';

const INFLOW_DATA: Record<Period, number[]> = {
  '30D': [42, 38, 45, 52, 36, 49, 55, 41, 48, 53, 38, 46],
  '60D': [38, 35, 41, 48, 32, 45, 50, 37, 44, 49, 35, 42],
  '90D': [35, 32, 38, 44, 30, 41, 47, 34, 40, 45, 32, 39],
};
const OUTFLOW_DATA: Record<Period, number[]> = {
  '30D': [32, 29, 35, 40, 27, 38, 42, 31, 37, 41, 28, 35],
  '60D': [29, 26, 32, 37, 24, 35, 39, 28, 34, 38, 25, 32],
  '90D': [27, 24, 30, 34, 22, 33, 36, 26, 32, 35, 23, 30],
};

const CATEGORIES = [
  { label: 'Client Revenue', amount: 'SAR 185,000', change: '+14%', positive: true, icon: 'briefcase-outline' as const },
  { label: 'Service Fees', amount: 'SAR 72,000', change: '+8%', positive: true, icon: 'card-outline' as const },
  { label: 'Investments', amount: 'SAR 53,000', change: '-2%', positive: false, icon: 'trending-up-outline' as const },
];

const OUTFLOWS = [
  { label: 'Payroll', amount: 'SAR 85,000', icon: 'people-outline' as const },
  { label: 'Suppliers', amount: 'SAR 67,000', icon: 'cube-outline' as const },
  { label: 'Operations', amount: 'SAR 53,000', icon: 'cog-outline' as const },
  { label: 'Other', amount: 'SAR 40,000', icon: 'ellipsis-horizontal' as const },
];

export default function CashFlowScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('30D');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const inflow = INFLOW_DATA[period];
  const outflow = OUTFLOW_DATA[period];
  const maxVal = Math.max(...inflow, ...outflow);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cash Flow Forecast</Text>
          <View style={{ width: 34 }} />
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>INFLOWS</Text>
            <Text style={styles.summaryValue}>SAR 310K</Text>
            <View style={styles.changePill}>
              <Ionicons name="arrow-up-outline" size={9} color="#86efac" />
              <Text style={[styles.changeText, { color: '#86efac' }]}>+12%</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>OUTFLOWS</Text>
            <Text style={styles.summaryValue}>SAR 245K</Text>
            <View style={styles.changePill}>
              <Ionicons name="arrow-up-outline" size={9} color="#fca5a5" />
              <Text style={[styles.changeText, { color: '#fca5a5' }]}>+3.2%</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>NET FLOW</Text>
            <Text style={[styles.summaryValue, { color: '#86efac' }]}>SAR 65K</Text>
            <View style={styles.changePill}>
              <Ionicons name="trending-up-outline" size={9} color="#86efac" />
              <Text style={[styles.changeText, { color: '#86efac' }]}>Positive</Text>
            </View>
          </View>
        </View>

        {/* Period selector */}
        <View style={styles.periodRow}>
          {(['30D', '60D', '90D'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.8}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24 }}>
        {/* Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cash Flow Chart</Text>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4f46e5' }]} />
              <Text style={styles.legendText}>Inflows</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#fca5a5' }]} />
              <Text style={styles.legendText}>Outflows</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {inflow.map((val, i) => (
              <View key={i} style={styles.barGroup}>
                <View style={[styles.bar, styles.barInflow, { height: (val / maxVal) * 80 }]} />
                <View style={[styles.bar, styles.barOutflow, { height: (outflow[i] / maxVal) * 80 }]} />
              </View>
            ))}
          </View>
          <View style={styles.chartMonths}>
            {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
              <Text key={i} style={styles.monthLabel}>{m}</Text>
            ))}
          </View>
        </View>

        {/* Inflows breakdown */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 14 }]}>Inflow Sources</Text>
          {CATEGORIES.map((c) => (
            <View key={c.label} style={styles.flowRow}>
              <View style={styles.flowIcon}>
                <Ionicons name={c.icon} size={16} color="#4f46e5" />
              </View>
              <Text style={styles.flowLabel}>{c.label}</Text>
              <Text style={styles.flowAmount}>{c.amount}</Text>
              <View style={[styles.changeBadge, { backgroundColor: c.positive ? '#f0fdf4' : '#fef2f2' }]}>
                <Text style={{ fontSize: 10, color: c.positive ? '#16a34a' : '#ef4444', fontFamily: 'Inter_600SemiBold' }}>
                  {c.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Outflows breakdown */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 14 }]}>Outflow Categories</Text>
          {OUTFLOWS.map((o) => (
            <View key={o.label} style={styles.flowRow}>
              <View style={[styles.flowIcon, { backgroundColor: '#fef2f2' }]}>
                <Ionicons name={o.icon} size={16} color="#ef4444" />
              </View>
              <Text style={styles.flowLabel}>{o.label}</Text>
              <Text style={[styles.flowAmount, { color: '#ef4444' }]}>{o.amount}</Text>
            </View>
          ))}
        </View>

        {/* AI note */}
        <LinearGradient colors={['#4f46e5', '#7c3aed']} style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <Ionicons name="sparkles" size={14} color="#fff" />
            <Text style={styles.aiCardTitle}>Modrik AI Insight</Text>
          </View>
          <Text style={styles.aiCardText}>
            A 4.2% declining trend is expected next 30 days due to seasonal supplier payments. Your strong inflow coverage ratio (1.27x) means your business remains liquid. Consider delaying non-critical purchases to preserve SAR 45,000+ in operating buffer.
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },

  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  summaryCard: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  summaryLabel: { fontSize: 9, color: '#64748b', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  summaryValue: { fontSize: 16, fontWeight: '700', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  changePill: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 2 },
  changeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },

  periodRow: { flexDirection: 'row', gap: 8 },
  periodBtn: {
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  periodBtnActive: { backgroundColor: '#4f46e5' },
  periodText: { fontSize: 13, color: '#94a3b8', fontFamily: 'Inter_500Medium' },
  periodTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  chartLegend: { flexDirection: 'row', gap: 16, marginTop: 8, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#6b7280', fontFamily: 'Inter_400Regular' },

  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 2 },
  barGroup: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  bar: { flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  barInflow: { backgroundColor: '#c7d2fe' },
  barOutflow: { backgroundColor: '#fca5a5' },
  chartMonths: { flexDirection: 'row', marginTop: 6 },
  monthLabel: { flex: 1, textAlign: 'center', fontSize: 8, color: '#9ca3af', fontFamily: 'Inter_400Regular' },

  flowRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  flowIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  flowLabel: { flex: 1, fontSize: 13, color: '#374151', fontFamily: 'Inter_400Regular' },
  flowAmount: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginRight: 8 },
  changeBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },

  aiCard: { borderRadius: 16, padding: 16 },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  aiCardTitle: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  aiCardText: { fontSize: 12, color: '#e0e7ff', lineHeight: 18, fontFamily: 'Inter_400Regular' },
});
