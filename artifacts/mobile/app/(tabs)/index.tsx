import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function StatusPill({ tone, label, desc }: { tone: 'green' | 'yellow' | 'red'; label: string; desc: string }) {
  const tones = {
    green: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', dot: '#22c55e' },
    yellow: { bg: '#fefce8', border: '#fef08a', text: '#a16207', dot: '#eab308' },
    red: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', dot: '#ef4444' },
  };
  const t = tones[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg, borderColor: t.border }]}>
      <View style={styles.pillHeader}>
        <View style={[styles.pillDot, { backgroundColor: t.dot }]} />
        <Text style={[styles.pillLabel, { color: t.text }]}>{label}</Text>
      </View>
      <Text style={[styles.pillDesc, { color: t.text }]}>{desc}</Text>
    </View>
  );
}

function StatBox({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.statValue}>{value}</Text>
        {positive !== undefined && (
          <Ionicons
            name={positive ? 'arrow-up-outline' : 'trending-down-outline'}
            size={12}
            color={positive ? '#86efac' : '#fca5a5'}
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </View>
  );
}

const radius = 34;
const circumference = 2 * Math.PI * radius;
const progress = 0.89;

const healthRows = [
  ['Cash Flow', 'Excellent'],
  ['Liquidity', 'Strong'],
  ['Revenue Stability', 'Stable'],
  ['Expense Control', 'Moderate'],
  ['Financial Risk', 'Low'],
];

const payments = [
  { name: 'Monthly Payroll', due: 'Due in 5 days', amount: 'SAR 85,000', urgent: false },
  { name: 'Supplier Invoice #82', due: 'Tomorrow', amount: 'SAR 42,000', urgent: true },
  { name: 'Office Rent - HQ', due: 'Due in 12 days', amount: 'SAR 18,000', urgent: false },
];

const activity = [
  { text: 'Payroll processed successfully', time: 'Today, 09:15 AM' },
  { text: 'New Revenue: Client #241', time: 'Yesterday, 04:30 PM' },
  { text: 'Supplier payment completed', time: 'Jul 18, 11:20 AM' },
  { text: 'AI Analysis: Q3 Forecast Updated', time: 'Jul 17, 02:00 PM' },
];

const bars = [24, 33, 18, 36, 27, 42, 21, 30, 15, 39, 25, 35];

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16, paddingTop: topPad + 8, paddingBottom: 120 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.logo}>Madarik</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/ai-alerts')}>
            <Ionicons name="notifications-outline" size={16} color="#4b5563" />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>
      </View>

      <Text style={styles.greeting}>Good Morning, Abdulrahman</Text>
      <Text style={styles.subGreeting}>Welcome back to Madarik Business</Text>

      {/* Status pills */}
      <View style={styles.pillRow}>
        <StatusPill tone="green" label="HEALTHY" desc="Revenue 12% above quarterly" />
        <StatusPill tone="yellow" label="ATTENTION" desc="Payment pending in 24h" />
        <StatusPill tone="red" label="ACTION" desc="License renewal required" />
      </View>

      {/* Balance card */}
      <LinearGradient
        colors={['#312e81', '#3730a3', '#581c87']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>TOTAL BUSINESS BALANCE</Text>
          <Ionicons name="wallet-outline" size={16} color="#c7d2fe" />
        </View>
        <Text style={styles.balanceValue}>SAR 845,000</Text>
        <View style={styles.statGrid}>
          <StatBox label="AVAILABLE CASH" value="SAR 420,000" />
          <StatBox label="MONTHLY REVENUE" value="SAR 310,000" positive />
          <StatBox label="MONTHLY EXPENSES" value="SAR 245,000" />
          <StatBox label="NET POSITION" value="+SAR 65,000" positive />
        </View>
      </LinearGradient>

      {/* Business Health Score */}
      <Card>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Business Health Score</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/analytics')}>
            <Text style={styles.linkText}>Analytics</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.healthRow}>
          <View style={styles.ringWrap}>
            <Svg width={80} height={80} viewBox="0 0 80 80">
              <Circle cx="40" cy="40" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
              <Circle
                cx="40" cy="40" r={radius}
                stroke="#4f46e5" strokeWidth="8" fill="none"
                strokeDasharray={`${circumference * progress} ${circumference}`}
                strokeLinecap="round"
                rotation="-90"
                origin="40, 40"
              />
            </Svg>
            <View style={styles.ringTextWrap}>
              <Text style={styles.ringScore}>89</Text>
              <Text style={styles.ringMax}>/100</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.healthTitle}>Optimized Performance</Text>
            <Text style={styles.healthDesc}>Strong liquidity and revenue stability this month.</Text>
          </View>
        </View>
        <View style={{ marginTop: 14 }}>
          {healthRows.map(([label, value]) => (
            <View key={label} style={styles.healthListRow}>
              <Text style={styles.healthListLabel}>{label}</Text>
              <Text style={styles.healthListValue}>{value}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/ai-report')} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>View Comprehensive Report</Text>
        </TouchableOpacity>
      </Card>

      {/* AI Insight */}
      <LinearGradient
        colors={['#9333ea', '#4f46e5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.insightCard}
      >
        <View style={styles.insightHeader}>
          <View style={styles.insightHeaderLeft}>
            <Ionicons name="sparkles-outline" size={15} color="#fff" />
            <Text style={styles.insightTitle}>Today's AI Insight</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>REAL-TIME</Text>
          </View>
        </View>
        <Text style={styles.insightBody}>
          Expected surplus of SAR 45,000 identified for next month. Consider moving these funds to a
          higher-yield savings account to optimize working capital.
        </Text>
        <TouchableOpacity style={styles.whiteBtn} onPress={() => router.push('/ai-recommendations')} activeOpacity={0.85}>
          <Text style={styles.whiteBtnText}>View AI Analysis</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Cash Flow Forecast */}
      <Card>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Cash Flow Forecast</Text>
          <Ionicons name="trending-down-outline" size={16} color="#ef4444" />
        </View>
        <Text style={styles.forecastLabel}>NEXT 30 DAYS FORECAST</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Text style={styles.forecastValue}>SAR 120,000</Text>
          <Text style={[styles.forecastTrend, { marginLeft: 8 }]}>Declining (▼4.2%)</Text>
        </View>
        <View style={styles.barChart}>
          {bars.map((h, i) => (
            <View
              key={i}
              style={[styles.bar, { height: h, backgroundColor: i % 3 === 2 ? '#fca5a5' : '#86efac' }]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.lightBtn} onPress={() => router.push('/cash-flow')} activeOpacity={0.85}>
          <Text style={styles.lightBtnText}>View Full Forecast</Text>
        </TouchableOpacity>
      </Card>

      {/* Recommended Financing */}
      <Card>
        <View style={styles.insightHeaderLeft}>
          <Ionicons name="business-outline" size={15} color="#4f46e5" />
          <Text style={[styles.cardTitle, { marginLeft: 6 }]}>Recommended Financing</Text>
        </View>
        <View style={[styles.cardHeaderRow, { marginTop: 10 }]}>
          <View>
            <Text style={styles.microLabel}>PURPOSE</Text>
            <Text style={styles.microValue}>Working Capital Expansion</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.microLabel}>APPROVAL</Text>
            <Text style={[styles.microValue, { color: '#16a34a' }]}>96%</Text>
          </View>
        </View>
        <View style={[styles.cardHeaderRow, { marginTop: 12 }]}>
          <Text style={styles.microLabel}>RECOMMENDED AMOUNT</Text>
          <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
        </View>
        <Text style={styles.bigAmount}>SAR 50,000</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/loan-review')} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Review Loan Offer</Text>
        </TouchableOpacity>
      </Card>

      {/* AI prompt */}
      <View style={styles.promptCard}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={styles.promptIconWrap}>
            <Ionicons name="chatbubble-outline" size={13} color="#4f46e5" />
          </View>
          <Text style={styles.promptText}>
            "How can I reduce operational expenses for the upcoming quarter based on current trends?"
          </Text>
        </View>
        <TouchableOpacity
          style={styles.gradientBtnFallback}
          onPress={() => router.push('/(tabs)/ai')}
          activeOpacity={0.85}
        >
          <Text style={styles.whiteBtnBoldText}>Open Modrik AI</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Payments */}
      <Card>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Upcoming Payments</Text>
          <TouchableOpacity onPress={() => router.push('/upcoming-payments')}>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>
        {payments.map((p) => (
          <View key={p.name} style={styles.paymentRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.paymentIconWrap}>
                <Ionicons name="document-text-outline" size={14} color="#6b7280" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.paymentName}>{p.name}</Text>
                <Text style={[styles.paymentDue, p.urgent && styles.paymentDueUrgent]}>{p.due}</Text>
              </View>
            </View>
            <Text style={styles.paymentAmount}>{p.amount}</Text>
          </View>
        ))}
      </Card>

      {/* Quick actions */}
      <View style={styles.quickGrid}>
        {[
          { icon: 'business-outline' as const, label: 'Apply for Financing', route: '/loan-review' },
          { icon: 'document-text-outline' as const, label: 'AI Financial Report', route: '/ai-report' },
          { icon: 'pie-chart-outline' as const, label: 'View Analytics', route: '/(tabs)/analytics' },
          { icon: 'chatbubble-ellipses-outline' as const, label: 'Modrik AI', route: '/(tabs)/ai' },
        ].map((q) => (
          <TouchableOpacity
            key={q.label}
            style={styles.quickBtn}
            onPress={() => router.push(q.route as any)}
            activeOpacity={0.85}
          >
            <Ionicons name={q.icon} size={18} color="#4f46e5" />
            <Text style={styles.quickBtnText}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <Card>
        <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Recent Activity</Text>
        {activity.map((a) => (
          <View key={a.text} style={styles.activityRow}>
            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.activityText}>{a.text}</Text>
              <Text style={styles.activityTime}>{a.time}</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 20, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  greeting: { fontSize: 17, fontWeight: '700', color: '#111827', marginTop: 14, fontFamily: 'Inter_700Bold' },
  subGreeting: { fontSize: 12, color: '#6b7280', marginTop: 2, marginBottom: 14, fontFamily: 'Inter_400Regular' },

  pillRow: { flexDirection: 'row', marginBottom: 14, gap: 6 },
  pill: { flex: 1, borderRadius: 12, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 8 },
  pillHeader: { flexDirection: 'row', alignItems: 'center' },
  pillDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  pillLabel: { fontSize: 9, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  pillDesc: { fontSize: 9, marginTop: 4, lineHeight: 12, fontFamily: 'Inter_400Regular' },

  balanceCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: 10, color: '#c7d2fe', letterSpacing: 0.5, fontFamily: 'Inter_500Medium' },
  balanceValue: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  statGrid: {
    flexDirection: 'row', flexWrap: 'wrap', marginTop: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statBox: { width: '50%', marginBottom: 10 },
  statLabel: { fontSize: 9, color: '#c7d2fe', fontFamily: 'Inter_400Regular' },
  statValue: { fontSize: 13, fontWeight: '600', color: '#fff', marginTop: 2, fontFamily: 'Inter_600SemiBold' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#f3f4f6',
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  linkText: { fontSize: 12, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },

  healthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  ringWrap: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  ringTextWrap: { position: 'absolute', alignItems: 'center' },
  ringScore: { fontSize: 17, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  ringMax: { fontSize: 9, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  healthTitle: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  healthDesc: { fontSize: 11, color: '#6b7280', marginTop: 3, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  healthListRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  healthListLabel: { fontSize: 11, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  healthListValue: { fontSize: 11, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },

  primaryBtn: { backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 14 },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  insightCard: { borderRadius: 18, padding: 16, marginBottom: 14 },
  insightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  insightHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  insightTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginLeft: 6, fontFamily: 'Inter_600SemiBold' },
  liveBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  liveBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  insightBody: { fontSize: 12, color: '#e0e7ff', marginTop: 10, lineHeight: 17, fontFamily: 'Inter_400Regular' },
  whiteBtn: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 11, alignItems: 'center', marginTop: 14 },
  whiteBtnText: { fontSize: 13, fontWeight: '600', color: '#4338ca', fontFamily: 'Inter_600SemiBold' },

  forecastLabel: { fontSize: 10, color: '#9ca3af', marginTop: 8, letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  forecastValue: { fontSize: 18, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  forecastTrend: { fontSize: 11, fontWeight: '600', color: '#ef4444', fontFamily: 'Inter_600SemiBold' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 60, marginTop: 14 },
  bar: { flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3, marginRight: 5 },
  lightBtn: { backgroundColor: '#eef2ff', borderRadius: 12, paddingVertical: 11, alignItems: 'center', marginTop: 14 },
  lightBtnText: { fontSize: 13, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },

  microLabel: { fontSize: 9, color: '#9ca3af', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  microValue: { fontSize: 12, fontWeight: '600', color: '#111827', marginTop: 2, fontFamily: 'Inter_600SemiBold' },
  bigAmount: { fontSize: 17, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },

  promptCard: {
    backgroundColor: '#f9fafb', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#f3f4f6',
  },
  promptIconWrap: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  promptText: {
    fontSize: 12, color: '#374151', backgroundColor: '#fff', borderRadius: 14,
    borderTopLeftRadius: 4, paddingHorizontal: 10, paddingVertical: 8,
    borderWidth: 1, borderColor: '#f3f4f6', flex: 1, lineHeight: 16, fontFamily: 'Inter_400Regular',
  },
  gradientBtnFallback: {
    backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 11,
    alignItems: 'center', marginTop: 12,
  },
  whiteBtnBoldText: { color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  paymentRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  paymentIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center',
  },
  paymentName: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  paymentDue: { fontSize: 10, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  paymentDueUrgent: { color: '#ef4444', fontWeight: '600' },
  paymentAmount: { fontSize: 12, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 14, gap: 10 },
  quickBtn: {
    width: '47%', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1,
    borderColor: '#f3f4f6', paddingVertical: 16, alignItems: 'center',
  },
  quickBtnText: {
    fontSize: 11, fontWeight: '600', color: '#374151',
    textAlign: 'center', marginTop: 8, fontFamily: 'Inter_600SemiBold',
  },

  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  activityText: { fontSize: 12, color: '#1f2937', fontFamily: 'Inter_400Regular' },
  activityTime: { fontSize: 10, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
});
