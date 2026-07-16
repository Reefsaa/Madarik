import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';

const radius = 34;
const circumference = 2 * Math.PI * radius;

const PAYMENTS = [
  { name: 'Monthly Payroll', due: 'Due in 5 days', amount: 'SAR 85,000', urgent: false },
  { name: 'Supplier Invoice #82', due: 'Tomorrow', amount: 'SAR 42,000', urgent: true },
  { name: 'Office Rent - HQ', due: 'Due in 12 days', amount: 'SAR 18,000', urgent: false },
];

const ACTIVITY = [
  { text: 'Payroll processed successfully', time: 'Today, 09:15 AM' },
  { text: 'New Revenue: Client #241', time: 'Yesterday, 04:30 PM' },
  { text: 'Supplier payment completed', time: 'Jul 18, 11:20 AM' },
  { text: 'AI Analysis: Q3 Forecast Updated', time: 'Jul 17, 02:00 PM' },
];

const BARS = [24, 33, 18, 36, 27, 42, 21, 30, 15, 39, 25, 35];

export default function BusinessHome() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { setMode } = useAppMode();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const firstName = user?.name?.split(' ')[0] || 'Abdulrahman';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Dark header */}
      <LinearGradient colors={['#0a0e27', '#1a1060', '#2d1b8e']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstName[0]}</Text>
            </View>
            <View>
              <Text style={styles.goodMorning}>GOOD MORNING</Text>
              <Text style={styles.companyName}>{user?.company || 'Abdulrhman holding company'}</Text>
              <Text style={styles.companyType}>business banking</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/ai-alerts')}>
              <Ionicons name="notifications-outline" size={18} color="#c7d2fe" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMode('personal')}>
              <Ionicons name="swap-horizontal-outline" size={18} color="#c7d2fe" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Business balance card */}
        <LinearGradient colors={['#4f46e5', '#6366f1', '#818cf8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
          <Text style={styles.balCardLabel}>business balance : SAR 845,000</Text>
          <Text style={styles.balCardItem}>Available Cash : SAR 420,000</Text>
          <Text style={styles.balCardItem}>monthly Revenue : 310,000</Text>
          <Text style={styles.balCardItem}>Monthly Expenses : 245,000</Text>
          <TouchableOpacity style={styles.viewAnalysisBtn} onPress={() => router.push('/(tabs)/insights')}>
            <Text style={styles.viewAnalysisText}>View Analysis</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Card carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll} contentContainerStyle={{ paddingRight: 16 }}>
          {[{ bal: '8,500', num: '2412 7512 3412 3456' }, { bal: '150', num: '6542 3xxx xxxx xxxx' }].map((c) => (
            <View key={c.num} style={styles.payCard}>
              <Text style={styles.payCardBalLabel}>Balance</Text>
              <Text style={styles.payCardBal}>{c.bal} ﷼</Text>
              <View style={styles.mastercard}>
                <View style={[styles.mcCircle, { marginRight: -8 }]} />
                <View style={styles.mcCircle} />
              </View>
              <Text style={styles.payCardNumLabel}>Card number</Text>
              <View style={styles.cardNumRow}>
                <Text style={styles.payCardNum}>{c.num}</Text>
                <Ionicons name="eye-outline" size={14} color="#6b7280" />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Score badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgePlus}>+</Text>
            <Text style={styles.badgeSub}>3.2%</Text>
            <Text style={styles.badgeLabel}>Portfolio{'\n'}overview</Text>
          </View>
          <View style={[styles.badge, styles.badgeCenter]}>
            <Text style={styles.behavScore}>87</Text>
            <Text style={styles.behavLabel}>behavioral{'\n'}Score</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="radio-button-on-outline" size={22} color="#a5b4fc" />
            <Text style={styles.badgeLabel}>Emotion{'\n'}Detection</Text>
          </View>
        </View>
      </LinearGradient>

      {/* White content section */}
      <View style={styles.whiteSection}>
        {/* Recent Activities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all &gt;</Text></TouchableOpacity>
        </View>
        <Text style={styles.dateLabel}>Monday 22/06/26</Text>
        {ACTIVITY.slice(0, 3).map((a) => (
          <View key={a.text} style={styles.actRow}>
            <View style={styles.actIcon}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actText}>{a.text}</Text>
              <Text style={styles.actTime}>{a.time}</Text>
            </View>
          </View>
        ))}

        {/* AI Insight */}
        <LinearGradient colors={['#9333ea', '#4f46e5']} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="sparkles-outline" size={13} color="#fff" />
            <Text style={styles.insightTitle}>Today's AI Insight</Text>
            <View style={styles.liveTag}><Text style={styles.liveTagText}>REAL-TIME</Text></View>
          </View>
          <Text style={styles.insightBody}>
            Expected surplus of SAR 45,000 identified for next month. Consider moving these funds to a higher-yield savings account to optimize working capital.
          </Text>
          <TouchableOpacity style={styles.insightBtn} onPress={() => router.push('/ai-recommendations')}>
            <Text style={styles.insightBtnText}>View AI Analysis</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Upcoming Payments */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Upcoming Payments</Text>
            <TouchableOpacity onPress={() => router.push('/upcoming-payments')}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>
          {PAYMENTS.map((p) => (
            <View key={p.name} style={styles.paymentRow}>
              <View style={styles.paymentIconWrap}>
                <Ionicons name="document-text-outline" size={14} color="#6b7280" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.paymentName}>{p.name}</Text>
                <Text style={[styles.paymentDue, p.urgent && { color: '#ef4444' }]}>{p.due}</Text>
              </View>
              <Text style={styles.paymentAmount}>{p.amount}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.quickGrid}>
          {[
            { icon: 'business-outline' as const, label: 'Apply for Financing', route: '/loan-review' },
            { icon: 'document-text-outline' as const, label: 'AI Financial Report', route: '/ai-report' },
            { icon: 'pie-chart-outline' as const, label: 'View Analytics', route: '/(tabs)/insights' },
            { icon: 'chatbubble-ellipses-outline' as const, label: 'Ask Modrik', route: '/(tabs)/ai' },
          ].map((q) => (
            <TouchableOpacity key={q.label} style={styles.quickBtn} onPress={() => router.push(q.route as any)} activeOpacity={0.85}>
              <Ionicons name={q.icon} size={18} color="#4f46e5" />
              <Text style={styles.quickBtnText}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  goodMorning: { fontSize: 9, color: '#94a3b8', letterSpacing: 1, fontFamily: 'Inter_400Regular' },
  companyName: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  companyType: { fontSize: 10, color: '#818cf8', fontFamily: 'Inter_400Regular' },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  balanceCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  balCardLabel: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  balCardItem: { fontSize: 12, color: '#e0e7ff', fontFamily: 'Inter_400Regular', marginBottom: 3 },
  viewAnalysisBtn: { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginTop: 8 },
  viewAnalysisText: { fontSize: 11, color: '#fff', fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  cardScroll: { marginBottom: 16 },
  payCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, width: 200, marginRight: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  payCardBalLabel: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  payCardBal: { fontSize: 20, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginTop: 2 },
  mastercard: { flexDirection: 'row', position: 'absolute', top: 14, right: 14 },
  mcCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#9ca3af', opacity: 0.6 },
  payCardNumLabel: { fontSize: 9, color: '#9ca3af', marginTop: 20, fontFamily: 'Inter_400Regular' },
  cardNumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  payCardNum: { fontSize: 11, color: '#374151', fontFamily: 'Inter_500Medium' },

  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 8 },
  badge: { alignItems: 'center', flex: 1 },
  badgePlus: { fontSize: 18, fontWeight: '700', color: '#a5b4fc', fontFamily: 'Inter_700Bold' },
  badgeSub: { fontSize: 12, color: '#a5b4fc', fontFamily: 'Inter_600SemiBold' },
  badgeCenter: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.15)', paddingVertical: 4 },
  behavScore: { fontSize: 28, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  behavLabel: { fontSize: 10, color: '#94a3b8', textAlign: 'center', fontFamily: 'Inter_400Regular', marginTop: 2 },
  badgeLabel: { fontSize: 10, color: '#94a3b8', textAlign: 'center', fontFamily: 'Inter_400Regular', marginTop: 4 },

  whiteSection: { backgroundColor: '#f9fafb', padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  seeAll: { fontSize: 12, color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  dateLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 12, fontFamily: 'Inter_400Regular' },
  actRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#f3f4f6' },
  actIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  actText: { fontSize: 13, color: '#111827', fontFamily: 'Inter_500Medium' },
  actTime: { fontSize: 10, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },

  insightCard: { borderRadius: 16, padding: 16, marginTop: 8, marginBottom: 12 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  insightTitle: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', flex: 1 },
  liveTag: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2 },
  liveTagText: { fontSize: 8, color: '#fff', fontWeight: '700', fontFamily: 'Inter_700Bold' },
  insightBody: { fontSize: 12, color: '#e0e7ff', lineHeight: 17, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  insightBtn: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  insightBtnText: { fontSize: 12, fontWeight: '600', color: '#4338ca', fontFamily: 'Inter_600SemiBold' },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  linkText: { fontSize: 12, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  paymentIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  paymentName: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  paymentDue: { fontSize: 10, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  paymentAmount: { fontSize: 12, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  quickBtn: { width: '47%', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f3f4f6', paddingVertical: 14, alignItems: 'center' },
  quickBtnText: { fontSize: 11, fontWeight: '600', color: '#374151', textAlign: 'center', marginTop: 6, fontFamily: 'Inter_600SemiBold' },
});
