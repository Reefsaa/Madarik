import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const INFLOW  = [280, 310, 295, 340, 310, 370];
const OUTFLOW = [210, 240, 225, 260, 245, 280];
const MAX = 400;

const UPCOMING = [
  { name: 'Monthly Payroll', due: 'Due in 5 days', amount: 'SAR 85,000', urgent: true },
  { name: 'Supplier Invoice #82', due: 'Tomorrow', amount: 'SAR 42,000', urgent: true },
  { name: 'VAT Filing Q2', due: 'Due in 8 days', amount: 'SAR 22,500', urgent: false },
  { name: 'Office Rent – HQ', due: 'Due in 12 days', amount: 'SAR 18,000', urgent: false },
];

const TRANSACTIONS = [
  { label: 'Client Payment – AlNoor',  amount: '+SAR 95,000', type: 'in', date: 'Today' },
  { label: 'Payroll – July',           amount: '-SAR 85,000', type: 'out', date: 'Today' },
  { label: 'Supplier – Delta Trade',   amount: '-SAR 42,000', type: 'out', date: 'Yesterday' },
  { label: 'Revenue – Project Delta',  amount: '+SAR 67,000', type: 'in', date: 'Jul 18' },
  { label: 'Utilities & Maintenance',  amount: '-SAR 8,400',  type: 'out', date: 'Jul 17' },
];

export default function CashFlowTab() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const net30 = 120000;
  const netSign = net30 >= 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <LinearGradient colors={['#04071a', '#0a0e27', '#130d3a']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerLabel}>Cash Flow</Text>
            <Text style={styles.headerSub}>30-day forecast · Madarik Holdings</Text>
          </View>
          <TouchableOpacity style={styles.exportBtn} onPress={() => router.push('/ai-report')}>
            <Ionicons name="download-outline" size={15} color="#c7d2fe" />
            <Text style={styles.exportText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <LinearGradient colors={['#059669', '#047857']} style={styles.summaryCard}>
            <Ionicons name="arrow-down-circle-outline" size={18} color="#d1fae5" />
            <Text style={styles.summaryValue}>SAR 370K</Text>
            <Text style={styles.summaryLabel}>Monthly Inflow</Text>
          </LinearGradient>
          <LinearGradient colors={['#dc2626', '#b91c1c']} style={styles.summaryCard}>
            <Ionicons name="arrow-up-circle-outline" size={18} color="#fee2e2" />
            <Text style={styles.summaryValue}>SAR 280K</Text>
            <Text style={styles.summaryLabel}>Monthly Outflow</Text>
          </LinearGradient>
          <LinearGradient colors={['#4f46e5', '#6366f1']} style={styles.summaryCard}>
            <Ionicons name="wallet-outline" size={18} color="#e0e7ff" />
            <Text style={styles.summaryValue}>SAR 90K</Text>
            <Text style={styles.summaryLabel}>Net This Month</Text>
          </LinearGradient>
        </View>

        {/* 30-day forecast banner */}
        <View style={styles.forecastBanner}>
          <Ionicons name="analytics-outline" size={14} color={netSign ? '#22c55e' : '#ef4444'} />
          <Text style={styles.forecastText}>
            30-Day Net Forecast:{' '}
            <Text style={{ color: netSign ? '#22c55e' : '#ef4444', fontFamily: 'Inter_700Bold' }}>
              {netSign ? '+' : '-'}SAR {Math.abs(net30).toLocaleString()}
            </Text>
            {'  '}·{'  '}Positive surplus expected
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Bar chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>6-Month Cash Flow</Text>
            <View style={styles.legend}>
              <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} /><Text style={styles.legendLabel}>Inflow</Text>
              <View style={[styles.legendDot, { backgroundColor: '#ef4444', marginLeft: 10 }]} /><Text style={styles.legendLabel}>Outflow</Text>
            </View>
          </View>
          <View style={styles.chartArea}>
            {MONTHS.map((m, i) => (
              <View key={m} style={styles.barGroup}>
                <View style={styles.barPair}>
                  <View style={[styles.bar, { height: (INFLOW[i] / MAX) * 120, backgroundColor: '#22c55e' }]} />
                  <View style={[styles.bar, { height: (OUTFLOW[i] / MAX) * 120, backgroundColor: '#ef4444' }]} />
                </View>
                <Text style={styles.barLabel}>{m}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartAnnotation}>
            <Ionicons name="trending-up-outline" size={11} color="#22c55e" />
            <Text style={styles.chartAnnotationText}>Revenue up 12% vs last quarter</Text>
          </View>
        </View>

        {/* AI Insight */}
        <LinearGradient colors={['#4338ca', '#7c3aed']} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="sparkles" size={13} color="#fff" />
            <Text style={styles.insightTitle}>Modrik AI Recommendation</Text>
          </View>
          <Text style={styles.insightBody}>
            Projected surplus of SAR 45,000 next month. Consider moving this to a high-yield business account to optimize working capital. Your cash runway is healthy at 4.2 months.
          </Text>
          <TouchableOpacity style={styles.insightBtn} onPress={() => router.push('/(tabs)/ai')}>
            <Text style={styles.insightBtnText}>Ask Modrik for details</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Upcoming payments */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upcoming Payments</Text>
            <TouchableOpacity onPress={() => router.push('/upcoming-payments')}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          {UPCOMING.map((p) => (
            <View key={p.name} style={styles.payRow}>
              <View style={[styles.payIcon, p.urgent && styles.payIconUrgent]}>
                <Ionicons name="document-text-outline" size={14} color={p.urgent ? '#ef4444' : '#6b7280'} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.payName}>{p.name}</Text>
                <Text style={[styles.payDue, p.urgent && { color: '#ef4444' }]}>{p.due}</Text>
              </View>
              <Text style={styles.payAmount}>{p.amount}</Text>
            </View>
          ))}
        </View>

        {/* Recent transactions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Transactions</Text>
          </View>
          {TRANSACTIONS.map((t, i) => (
            <View key={i} style={[styles.txRow, i < TRANSACTIONS.length - 1 && styles.txRowBorder]}>
              <View style={[styles.txIcon, { backgroundColor: t.type === 'in' ? '#f0fdf4' : '#fef2f2' }]}>
                <Ionicons name={t.type === 'in' ? 'arrow-down-outline' : 'arrow-up-outline'} size={13} color={t.type === 'in' ? '#16a34a' : '#dc2626'} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.txName}>{t.label}</Text>
                <Text style={styles.txDate}>{t.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: t.type === 'in' ? '#16a34a' : '#dc2626' }]}>{t.amount}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/loan-review')} activeOpacity={0.85}>
            <Ionicons name="business-outline" size={17} color="#4f46e5" />
            <Text style={styles.quickText}>Apply{'\n'}Financing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/ai-recommendations')} activeOpacity={0.85}>
            <Ionicons name="bulb-outline" size={17} color="#4f46e5" />
            <Text style={styles.quickText}>AI{'\n'}Recommendations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/ai-report')} activeOpacity={0.85}>
            <Ionicons name="document-outline" size={17} color="#4f46e5" />
            <Text style={styles.quickText}>Financial{'\n'}Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/ai')} activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={17} color="#4f46e5" />
            <Text style={styles.quickText}>Ask{'\n'}Modrik</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 },
  headerLabel: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 10, color: '#94a3b8', marginTop: 2, fontFamily: 'Inter_400Regular' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  exportText: { fontSize: 11, color: '#c7d2fe', fontFamily: 'Inter_500Medium' },

  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center', gap: 3 },
  summaryValue: { fontSize: 13, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  summaryLabel: { fontSize: 8, color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontFamily: 'Inter_400Regular' },

  forecastBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  forecastText: { fontSize: 11, color: '#cbd5e1', fontFamily: 'Inter_400Regular', flex: 1 },

  content: { padding: 14 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  seeAll: { fontSize: 11, color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  legend: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 3 },
  legendLabel: { fontSize: 10, color: '#6b7280', fontFamily: 'Inter_400Regular', marginRight: 4 },

  chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 130, marginBottom: 8 },
  barGroup: { alignItems: 'center', flex: 1 },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 4 },
  bar: { width: 10, borderRadius: 3 },
  barLabel: { fontSize: 9, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  chartAnnotation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chartAnnotationText: { fontSize: 10, color: '#16a34a', fontFamily: 'Inter_500Medium' },

  insightCard: { borderRadius: 14, padding: 14, marginBottom: 12 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 },
  insightTitle: { fontSize: 12, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  insightBody: { fontSize: 12, color: '#e0e7ff', lineHeight: 17, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  insightBtn: { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  insightBtnText: { fontSize: 11, fontWeight: '600', color: '#4338ca', fontFamily: 'Inter_600SemiBold' },

  payRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  payIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  payIconUrgent: { backgroundColor: '#fef2f2' },
  payName: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  payDue: { fontSize: 9, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  payAmount: { fontSize: 11, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },

  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  txRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  txIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 12, fontWeight: '500', color: '#111827', fontFamily: 'Inter_500Medium' },
  txDate: { fontSize: 9, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  txAmount: { fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  quickRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  quickBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#f3f4f6', paddingVertical: 13, alignItems: 'center', gap: 5 },
  quickText: { fontSize: 9, fontWeight: '600', color: '#374151', textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
});
