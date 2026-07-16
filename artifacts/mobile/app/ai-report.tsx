import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const METRICS = [
  { label: 'Gross Revenue', value: 'SAR 310,000', change: '+12.4%', positive: true },
  { label: 'Net Revenue', value: 'SAR 281,000', change: '+10.9%', positive: true },
  { label: 'Total Expenses', value: 'SAR 245,000', change: '+3.2%', positive: false },
  { label: 'Net Profit', value: 'SAR 65,000', change: '+21.0%', positive: true },
  { label: 'Profit Margin', value: '21.0%', change: '+1.8pt', positive: true },
  { label: 'Cash on Hand', value: 'SAR 420,000', change: '+8.3%', positive: true },
];

const SECTIONS = [
  {
    title: 'Executive Summary',
    icon: 'document-text-outline' as const,
    content: 'Madarik Holdings demonstrates strong financial health with a Business Health Score of 89/100 for Q3 2026. Revenue grew 12.4% year-over-year driven by client acquisition and service expansion. Operational expenses remain well-controlled at 78.9% of revenue.',
  },
  {
    title: 'Revenue Analysis',
    icon: 'trending-up-outline' as const,
    content: 'Total revenue reached SAR 310,000 this month, exceeding projections by SAR 22,000 (7.6%). Top revenue sources: Client Services (SAR 185,000), Consulting Fees (SAR 72,000), and Recurring Subscriptions (SAR 53,000). Client concentration risk is moderate — top 5 clients represent 62% of revenue.',
  },
  {
    title: 'Expense Review',
    icon: 'bar-chart-outline' as const,
    content: 'Total expenses of SAR 245,000 increased 3.2% from the prior period, primarily driven by payroll growth (+5.1%) reflecting team expansion. Supplier costs decreased 2.8% through improved procurement practices. Operating leverage improved to 2.8x revenue growth / expense growth ratio.',
  },
  {
    title: 'Cash Flow & Liquidity',
    icon: 'water-outline' as const,
    content: 'Operating cash flow is strong at SAR 78,000 this month. Current ratio stands at 2.14x (well above the 1.5x industry benchmark). DSO (Days Sales Outstanding) improved to 38 days from 45 days. 30-day cash flow forecast: SAR 120,000 net, with a slight 4.2% seasonal decline expected.',
  },
  {
    title: 'Q4 2026 Outlook',
    icon: 'eye-outline' as const,
    content: 'Based on current trajectory and market conditions, Q4 revenue is projected at SAR 940,000 to SAR 1.02M. Key growth drivers: 2 pending enterprise client contracts (combined value SAR 180,000), seasonal uptick in consulting demand (+15%), and planned service tier expansion in October.',
  },
];

const bars = [28, 35, 22, 41, 30, 47, 25, 39, 18, 44, 32, 42];

export default function AIReportScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const maxBar = Math.max(...bars);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>AI Financial Report</Text>
            <Text style={styles.headerDate}>Generated · July 16, 2026</Text>
          </View>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={16} color="#a5b4fc" />
          </TouchableOpacity>
        </View>

        <View style={styles.scoreBanner}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Business Health Score</Text>
            <Text style={styles.scoreValue}>89 / 100</Text>
            <Text style={styles.scoreDesc}>Excellent · Top 15% of businesses</Text>
          </View>
          <View style={styles.scoreRight}>
            <Ionicons name="shield-checkmark" size={52} color="rgba(255,255,255,0.2)" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24 }}>
        {/* KPI grid */}
        <View style={styles.metricsGrid}>
          {METRICS.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Ionicons
                  name={m.positive ? 'arrow-up-outline' : 'arrow-down-outline'}
                  size={10}
                  color={m.positive ? '#22c55e' : '#ef4444'}
                />
                <Text style={[styles.metricChange, { color: m.positive ? '#22c55e' : '#ef4444' }]}>
                  {' '}{m.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Monthly Revenue</Text>
            <Text style={styles.cardSub}>SAR 310K avg</Text>
          </View>
          <View style={styles.chart}>
            {bars.map((v, i) => (
              <View key={i} style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (v / maxBar) * 80,
                      backgroundColor: i === bars.length - 1 ? '#4f46e5' : '#c7d2fe',
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Report sections */}
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name={s.icon} size={16} color="#4f46e5" />
              </View>
              <Text style={styles.sectionTitle}>{s.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{s.content}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.exportBtn} activeOpacity={0.85}>
          <Ionicons name="download-outline" size={16} color="#fff" />
          <Text style={styles.exportBtnText}>Export Full Report (PDF)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center', fontFamily: 'Inter_700Bold' },
  headerDate: { fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 2, fontFamily: 'Inter_400Regular' },

  scoreBanner: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontSize: 10, color: '#94a3b8', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  scoreValue: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  scoreDesc: { fontSize: 11, color: '#818cf8', marginTop: 4, fontFamily: 'Inter_400Regular' },
  scoreRight: { marginLeft: 16 },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  metricCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: '#f3f4f6',
  },
  metricLabel: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  metricValue: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 4, fontFamily: 'Inter_700Bold' },
  metricChange: { fontSize: 10, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  cardSub: { fontSize: 11, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 3 },
  barWrap: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },

  sectionCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionIcon: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  sectionContent: { fontSize: 13, color: '#4b5563', lineHeight: 20, fontFamily: 'Inter_400Regular' },

  exportBtn: {
    backgroundColor: '#4f46e5', borderRadius: 16, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
  },
  exportBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
