import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';

const TRANSACTIONS = [
  { id: '1', name: 'MadarikC', sub: 'Project bonus', amount: '+300.00', positive: true },
  { id: '2', name: 'muvi cinema', sub: 'Movie tickets', amount: '-130.00', positive: false },
  { id: '3', name: 'Zara', sub: 'Payments', amount: '-249.00', positive: false },
];

const CARDS = [
  { bal: '8,500', num: '2412 7512 3412 3456', gradient: ['#4f46e5', '#7c3aed'] as const },
  { bal: '150', num: '6542 3xxx xxxx xxxx', gradient: ['#1e40af', '#3730a3'] as const },
];

export default function PersonalHome() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { setMode } = useAppMode();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const firstName = user?.name?.split(' ')[0] || 'Noura';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Light header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{firstName[0]}</Text>
            </View>
            <View>
              <Text style={styles.welcomeBack}>Welcome back</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={18} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMode('business')}>
              <Ionicons name="swap-horizontal-outline" size={18} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>Let's make smartest investment</Text>
      </View>

      {/* AI Insight card */}
      <View style={styles.insightSection}>
        <LinearGradient colors={['#1e2d6e', '#1e40af', '#312e81']} style={styles.insightCard}>
          <Text style={styles.insightCardTitle}>Today's AI Insight</Text>
          <Text style={styles.insightCardBody}>Your investment behavior is stable.</Text>
          <View style={styles.insightDetails}>
            <View>
              <Text style={styles.insightDetailLabel}>Risk Profile:</Text>
              <Text style={styles.insightDetailValue}>Moderate</Text>
            </View>
            <View>
              <Text style={styles.insightDetailLabel}>Confidence Score:</Text>
              <Text style={styles.insightDetailValue}>84%</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAnalysisBtn} onPress={() => router.push('/(tabs)/insights')}>
            <Text style={styles.viewAnalysisText}>View Analysis</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Dots indicator */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { backgroundColor: '#1e40af' }]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Dark bottom section */}
      <LinearGradient colors={['#f3f4f6', '#1e1b4b']} style={{ height: 24 }} />
      <View style={styles.darkSection}>
        {/* Card carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll} contentContainerStyle={{ paddingRight: 16 }}>
          {CARDS.map((c) => (
            <LinearGradient key={c.num} colors={c.gradient} style={styles.payCard}>
              <Text style={styles.payCardBalLabel}>Balance</Text>
              <Text style={styles.payCardBal}>{c.bal} ﷼</Text>
              <View style={styles.mastercard}>
                <View style={[styles.mcCircle, { marginRight: -8, backgroundColor: '#c7d2fe' }]} />
                <View style={[styles.mcCircle, { backgroundColor: '#818cf8' }]} />
              </View>
              <Text style={styles.payCardNumLabel}>Card number</Text>
              <View style={styles.cardNumRow}>
                <Text style={styles.payCardNum}>{c.num}</Text>
                <Ionicons name="eye-outline" size={13} color="rgba(255,255,255,0.6)" />
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Score badges */}
        <View style={styles.badgeRow}>
          <TouchableOpacity style={styles.badge} onPress={() => router.push('/(tabs)/insights')}>
            <View style={styles.badgeCircle}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.badgePct}>3.2%</Text>
            </View>
            <Text style={styles.badgeLabel}>Portfolio{'\n'}overview</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.badge, styles.badgeMain]} onPress={() => router.push('/behavioral-assessment')}>
            <View style={styles.badgeMainCircle}>
              <Text style={styles.behavScore}>87</Text>
            </View>
            <Text style={[styles.badgeLabel, { color: '#c7d2fe' }]}>behavioral{'\n'}Score</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.badge} onPress={() => router.push('/(tabs)/insights')}>
            <View style={styles.badgeCircle}>
              <Ionicons name="radio-button-on-outline" size={16} color="#fff" />
            </View>
            <Text style={styles.badgeLabel}>Emotion{'\n'}Detection</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activities */}
        <View style={styles.recentHeader}>
          <View>
            <Text style={styles.recentTitle}>Recent Activities</Text>
            <Text style={styles.recentDate}>Monday 22/06/26</Text>
          </View>
          <TouchableOpacity><Text style={styles.seeAll}>See all &gt;</Text></TouchableOpacity>
        </View>

        {TRANSACTIONS.map((t) => (
          <View key={t.id} style={styles.txRow}>
            <View style={styles.txIconWrap}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.txName}>{t.name}</Text>
              <Text style={styles.txSub}>{t.sub}</Text>
            </View>
            <Text style={[styles.txAmount, { color: t.positive ? '#22c55e' : '#ef4444' }]}>
              {t.amount} ﷼
            </Text>
          </View>
        ))}

        {/* Quick actions */}
        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/behavioral-assessment')} activeOpacity={0.85}>
            <Ionicons name="analytics-outline" size={18} color="#4f46e5" />
            <Text style={styles.quickBtnText}>Behavioral{'\n'}Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/ai')} activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#4f46e5" />
            <Text style={styles.quickBtnText}>Ask{'\n'}Modrik</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/insights')} activeOpacity={0.85}>
            <Ionicons name="trending-up-outline" size={18} color="#4f46e5" />
            <Text style={styles.quickBtnText}>Smart{'\n'}Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/ai-report')} activeOpacity={0.85}>
            <Ionicons name="document-text-outline" size={18} color="#4f46e5" />
            <Text style={styles.quickBtnText}>AI{'\n'}Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },

  header: { backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  welcomeBack: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  userName: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontSize: 12, color: '#6b7280', fontFamily: 'Inter_400Regular' },

  insightSection: { paddingHorizontal: 16, marginBottom: 4 },
  insightCard: { borderRadius: 16, padding: 16 },
  insightCardTitle: { fontSize: 13, fontWeight: '700', color: '#c7d2fe', fontFamily: 'Inter_700Bold', marginBottom: 8 },
  insightCardBody: { fontSize: 15, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold', marginBottom: 14 },
  insightDetails: { flexDirection: 'row', gap: 24, marginBottom: 14 },
  insightDetailLabel: { fontSize: 10, color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  insightDetailValue: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginTop: 2 },
  viewAnalysisBtn: { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  viewAnalysisText: { fontSize: 11, color: '#fff', fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db' },

  darkSection: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 4, flex: 1 },
  cardScroll: { marginBottom: 16 },
  payCard: { borderRadius: 16, padding: 14, width: 200, marginRight: 12 },
  payCardBalLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  payCardBal: { fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginTop: 2 },
  mastercard: { flexDirection: 'row', position: 'absolute', top: 14, right: 14 },
  mcCircle: { width: 20, height: 20, borderRadius: 10, opacity: 0.7 },
  payCardNumLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 22, fontFamily: 'Inter_400Regular' },
  cardNumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  payCardNum: { fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_500Medium' },

  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 20 },
  badge: { alignItems: 'center', flex: 1 },
  badgeCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  badgePct: { fontSize: 8, color: '#a5b4fc', fontFamily: 'Inter_600SemiBold' },
  badgeMain: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  badgeMainCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  behavScore: { fontSize: 22, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  badgeLabel: { fontSize: 9, color: '#64748b', textAlign: 'center', fontFamily: 'Inter_400Regular' },

  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  recentTitle: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  recentDate: { fontSize: 10, color: '#64748b', marginTop: 2, fontFamily: 'Inter_400Regular' },
  seeAll: { fontSize: 12, color: '#818cf8', fontFamily: 'Inter_600SemiBold' },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
  txIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 13, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  txSub: { fontSize: 10, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  txAmount: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginTop: 16 },
  quickBtn: { width: '47%', backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  quickBtnText: { fontSize: 11, fontWeight: '600', color: '#374151', textAlign: 'center', marginTop: 6, fontFamily: 'Inter_600SemiBold' },
});
