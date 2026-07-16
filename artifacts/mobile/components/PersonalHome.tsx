import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';

const LOGO = require('@/assets/images/madarik-logo.png');

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
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <View style={styles.headerRow}>
          {/* Logo top-left */}
          <Image source={LOGO} style={styles.headerLogo} resizeMode="contain" />
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
              <Ionicons name="notifications-outline" size={17} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMode('business')}>
              <Ionicons name="swap-horizontal-outline" size={17} color="#374151" />
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
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { backgroundColor: '#1e40af' }]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Dark bottom section */}
      <LinearGradient colors={['#f3f4f6', '#1e1b4b']} style={{ height: 20 }} />
      <View style={styles.darkSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll} contentContainerStyle={{ paddingRight: 14 }}>
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
                <Ionicons name="eye-outline" size={12} color="rgba(255,255,255,0.6)" />
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        <View style={styles.badgeRow}>
          <TouchableOpacity style={styles.badge} onPress={() => router.push('/(tabs)/insights')}>
            <View style={styles.badgeCircle}>
              <Ionicons name="add" size={14} color="#fff" />
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
              <Ionicons name="radio-button-on-outline" size={14} color="#fff" />
            </View>
            <Text style={styles.badgeLabel}>Emotion{'\n'}Detection</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentHeader}>
          <View>
            <Text style={styles.recentTitle}>Recent Activities</Text>
            <Text style={styles.recentDate}>Monday 22/06/26</Text>
          </View>
          <TouchableOpacity><Text style={styles.seeAll}>See all &gt;</Text></TouchableOpacity>
        </View>

        {TRANSACTIONS.map((t) => (
          <View key={t.id} style={styles.txRow}>
            <View style={styles.txIconWrap}><Ionicons name="time-outline" size={15} color="#6b7280" /></View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.txName}>{t.name}</Text>
              <Text style={styles.txSub}>{t.sub}</Text>
            </View>
            <Text style={[styles.txAmount, { color: t.positive ? '#22c55e' : '#ef4444' }]}>{t.amount} ﷼</Text>
          </View>
        ))}

        <View style={styles.quickGrid}>
          {[
            { icon: 'analytics-outline' as const, label: 'Behavioral\nAssessment', route: '/behavioral-assessment' },
            { icon: 'chatbubble-ellipses-outline' as const, label: 'Ask\nModrik', route: '/(tabs)/ai' },
            { icon: 'trending-up-outline' as const, label: 'Smart\nInsights', route: '/(tabs)/insights' },
            { icon: 'document-text-outline' as const, label: 'AI\nReport', route: '/ai-report' },
          ].map((q) => (
            <TouchableOpacity key={q.label} style={styles.quickBtn} onPress={() => router.push(q.route as any)} activeOpacity={0.85}>
              <Ionicons name={q.icon} size={17} color="#4f46e5" />
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
  header: { backgroundColor: '#f9fafb', paddingHorizontal: 14, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 8 },
  headerLogo: { width: 44, height: 28 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  welcomeBack: { fontSize: 9, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  userName: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  actions: { flexDirection: 'row', gap: 6 },
  iconBtn: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontSize: 11, color: '#6b7280', fontFamily: 'Inter_400Regular' },

  insightSection: { paddingHorizontal: 14, marginBottom: 2 },
  insightCard: { borderRadius: 16, padding: 14 },
  insightCardTitle: { fontSize: 12, fontWeight: '700', color: '#c7d2fe', fontFamily: 'Inter_700Bold', marginBottom: 7 },
  insightCardBody: { fontSize: 14, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  insightDetails: { flexDirection: 'row', gap: 22, marginBottom: 12 },
  insightDetailLabel: { fontSize: 9, color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  insightDetailValue: { fontSize: 12, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginTop: 1 },
  viewAnalysisBtn: { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 5 },
  viewAnalysisText: { fontSize: 10, color: '#fff', fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 8 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#d1d5db' },

  darkSection: { backgroundColor: '#0f172a', paddingHorizontal: 14, paddingTop: 2, flex: 1 },
  cardScroll: { marginBottom: 14 },
  payCard: { borderRadius: 14, padding: 12, width: 190, marginRight: 10 },
  payCardBalLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  payCardBal: { fontSize: 18, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginTop: 1 },
  mastercard: { flexDirection: 'row', position: 'absolute', top: 12, right: 12 },
  mcCircle: { width: 18, height: 18, borderRadius: 9, opacity: 0.7 },
  payCardNumLabel: { fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 20, fontFamily: 'Inter_400Regular' },
  cardNumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  payCardNum: { fontSize: 9, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_500Medium' },

  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 18 },
  badge: { alignItems: 'center', flex: 1 },
  badgeCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  badgePct: { fontSize: 7, color: '#a5b4fc', fontFamily: 'Inter_600SemiBold' },
  badgeMain: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  badgeMainCircle: { width: 54, height: 54, borderRadius: 27, borderWidth: 3, borderColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  behavScore: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  badgeLabel: { fontSize: 8, color: '#64748b', textAlign: 'center', fontFamily: 'Inter_400Regular' },

  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  recentTitle: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  recentDate: { fontSize: 9, color: '#64748b', marginTop: 1, fontFamily: 'Inter_400Regular' },
  seeAll: { fontSize: 11, color: '#818cf8', fontFamily: 'Inter_600SemiBold' },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 11, padding: 11, marginBottom: 7 },
  txIconWrap: { width: 30, height: 30, borderRadius: 7, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  txSub: { fontSize: 9, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  txAmount: { fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 9, marginTop: 14 },
  quickBtn: { width: '47%', backgroundColor: '#fff', borderRadius: 13, paddingVertical: 13, alignItems: 'center' },
  quickBtnText: { fontSize: 10, fontWeight: '600', color: '#374151', textAlign: 'center', marginTop: 5, fontFamily: 'Inter_600SemiBold' },
});
