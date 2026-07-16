import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  midnight:  '#1A237E',
  purple:    '#6C5CE7',
  green:     '#00B894',
  red:       '#D63031',
  grey:      '#F5F6FA',
  dark:      '#0f172a',
};

const LOGO = require('@/assets/images/madarik-logo.png');

const TRANSACTIONS = [
  { id: '1', name: 'MadarikC',    sub: 'Project bonus',  amount: '+300.00', positive: true  },
  { id: '2', name: 'muvi cinema', sub: 'Movie tickets',   amount: '-130.00', positive: false },
  { id: '3', name: 'Zara',        sub: 'Payments',        amount: '-249.00', positive: false },
];

const CARDS = [
  { bal: '8,500', num: '2412 7512 3412 3456', gradient: ['#1A237E', '#312e81'] as const },
  { bal: '150',   num: '6542 3xxx xxxx xxxx', gradient: ['#1e40af', '#3730a3'] as const },
];

export default function PersonalHome() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { setMode } = useAppMode();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const firstName = user?.name?.split(' ')[0] || 'Noura';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Welcome Header ─────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <View style={styles.headerRow}>
          {/* Logo */}
          <Image source={LOGO} style={styles.headerLogo} resizeMode="contain" />

          {/* Avatar + name */}
          <View style={styles.userRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{firstName[0]}</Text>
            </View>
            <View>
              <Text style={styles.welcomeBack}>Welcome back</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
          </View>

          {/* Actions: Notification bell → /notifications, swap mode */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications-outline" size={17} color="#374151" />
              {/* Unread badge */}
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMode('business')}>
              <Ionicons name="swap-horizontal-outline" size={17} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>Let's make smartest investment</Text>
      </View>

      {/* ── Today's AI Insight ──────────────────────────────────────────── */}
      <View style={styles.insightSection}>
        <LinearGradient colors={['#1A237E', '#1e40af', '#312e81']} style={styles.insightCard}>
          <Text style={styles.insightLabel}>TODAY'S AI INSIGHT</Text>
          <Text style={styles.insightBody}>Your investment behavior is stable.</Text>
          <View style={styles.insightMeta}>
            <View>
              <Text style={styles.insightMetaLabel}>Risk Profile</Text>
              <Text style={styles.insightMetaValue}>Moderate</Text>
            </View>
            <View style={styles.insightDivider} />
            <View>
              <Text style={styles.insightMetaLabel}>Confidence Score</Text>
              <Text style={styles.insightMetaValue}>84%</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewBtn} onPress={() => router.push('/(tabs)/insights')}>
            <Text style={styles.viewBtnText}>View Analysis →</Text>
          </TouchableOpacity>
        </LinearGradient>
        {/* Page-indicator dots */}
        <View style={styles.dotsRow}>
          <View style={[styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* ── Dark section ────────────────────────────────────────────────── */}
      <LinearGradient colors={['#f9fafb', C.dark]} style={{ height: 18 }} />
      <View style={styles.darkSection}>

        {/* Balance card carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 14 }}
          style={{ marginBottom: 16 }}
        >
          {CARDS.map((c) => (
            <LinearGradient key={c.num} colors={c.gradient} style={styles.payCard}>
              <View style={styles.mastercardIcons}>
                <View style={[styles.mcCircle, { backgroundColor: '#c7d2fe', marginRight: -8 }]} />
                <View style={[styles.mcCircle, { backgroundColor: '#818cf8' }]} />
              </View>
              <Text style={styles.cardBalLabel}>Balance</Text>
              <Text style={styles.cardBal}>{c.bal} ﷼</Text>
              <Text style={styles.cardNumLabel}>Card number</Text>
              <View style={styles.cardNumRow}>
                <Text style={styles.cardNum}>{c.num}</Text>
                <Ionicons name="eye-outline" size={12} color="rgba(255,255,255,0.6)" />
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* ── Three-column behavioral metrics ── */}
        <View style={styles.metricsRow}>
          {/* Portfolio overview */}
          <TouchableOpacity style={styles.metricItem} onPress={() => router.push('/(tabs)/insights')} activeOpacity={0.8}>
            <View style={styles.metricCircle}>
              <Ionicons name="trending-up-outline" size={14} color={C.green} />
              <Text style={styles.metricPct}>+3.2%</Text>
            </View>
            <Text style={styles.metricLabel}>Portfolio{'\n'}overview</Text>
          </TouchableOpacity>

          {/* Behavioral score – centre/prominent */}
          <TouchableOpacity style={styles.metricItemMain} onPress={() => router.push('/behavioral-assessment')} activeOpacity={0.8}>
            <View style={styles.metricCircleMain}>
              <Text style={styles.behavScore}>87</Text>
            </View>
            <Text style={[styles.metricLabel, { color: '#c7d2fe' }]}>Behavioral{'\n'}Score</Text>
          </TouchableOpacity>

          {/* Emotion detection */}
          <TouchableOpacity style={styles.metricItem} onPress={() => router.push('/(tabs)/ai')} activeOpacity={0.8}>
            <View style={styles.metricCircle}>
              <Ionicons name="radio-button-on-outline" size={16} color={C.purple} />
            </View>
            <Text style={styles.metricLabel}>Emotion{'\n'}Detection</Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Activities ── */}
        <View style={styles.recentHeader}>
          <View>
            <Text style={styles.recentTitle}>Recent Activities</Text>
            <Text style={styles.recentDate}>Monday 22/06/26</Text>
          </View>
          <TouchableOpacity><Text style={styles.seeAll}>See all &gt;</Text></TouchableOpacity>
        </View>

        {TRANSACTIONS.map((t) => (
          <View key={t.id} style={styles.txRow}>
            {/* Directional icon: ↙ for credit / ↗ for debit */}
            <View style={[styles.txIconWrap, { backgroundColor: t.positive ? '#d1fae5' : '#fee2e2' }]}>
              <Ionicons
                name={t.positive ? 'arrow-down-outline' : 'arrow-up-outline'}
                size={14}
                color={t.positive ? C.green : C.red}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.txName}>{t.name}</Text>
              <Text style={styles.txSub}>{t.sub}</Text>
            </View>
            <Text style={[styles.txAmount, { color: t.positive ? C.green : C.red }]}>
              {t.amount} ﷼
            </Text>
          </View>
        ))}

        {/* ── Quick actions grid ── */}
        <View style={styles.quickGrid}>
          {[
            { icon: 'analytics-outline'         as const, label: 'Behavioral\nAssessment', route: '/behavioral-assessment' },
            { icon: 'chatbubble-ellipses-outline' as const, label: 'Ask\nModrik',           route: '/(tabs)/ai'             },
            { icon: 'trending-up-outline'        as const, label: 'Smart\nInsights',        route: '/(tabs)/insights'       },
            { icon: 'document-text-outline'      as const, label: 'AI\nReport',             route: '/ai-report'             },
          ].map((q) => (
            <TouchableOpacity
              key={q.label}
              style={styles.quickBtn}
              onPress={() => router.push(q.route as any)}
              activeOpacity={0.85}
            >
              <Ionicons name={q.icon} size={17} color={C.purple} />
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

  // Header
  header:      { backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingBottom: 12 },
  headerRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  headerLogo:  { width: 44, height: 28 },
  userRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  avatarWrap:  { width: 36, height: 36, borderRadius: 18, backgroundColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center' },
  avatarText:  { color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  welcomeBack: { fontSize: 9,  color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  userName:    { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  actions:     { flexDirection: 'row', gap: 6 },
  iconBtn:     { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F5F6FA', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifBadge:  { position: 'absolute', top: 5, right: 6, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#D63031', borderWidth: 1.5, borderColor: '#f9fafb' },
  subtitle:    { fontSize: 11, color: '#6b7280', fontFamily: 'Inter_400Regular' },

  // AI Insight card
  insightSection:    { paddingHorizontal: 16, marginBottom: 4 },
  insightCard:       { borderRadius: 16, padding: 16 },
  insightLabel:      { fontSize: 9, fontWeight: '700', color: '#a5b4fc', letterSpacing: 1, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  insightBody:       { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 14, lineHeight: 20 },
  insightMeta:       { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 },
  insightMetaLabel:  { fontSize: 9,  color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  insightMetaValue:  { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginTop: 2 },
  insightDivider:    { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },
  viewBtn:           { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  viewBtnText:       { fontSize: 11, color: '#fff', fontWeight: '700', fontFamily: 'Inter_700Bold' },
  dotsRow:           { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dotActive:         { width: 18, height: 7, borderRadius: 3.5, backgroundColor: '#6C5CE7' },
  dot:               { width: 7,  height: 7, borderRadius: 3.5, backgroundColor: '#d1d5db' },

  // Dark section
  darkSection: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 },

  // Balance cards
  payCard:       { borderRadius: 16, padding: 14, width: 196, marginRight: 10 },
  mastercardIcons: { flexDirection: 'row', position: 'absolute', top: 14, right: 14 },
  mcCircle:      { width: 18, height: 18, borderRadius: 9, opacity: 0.75 },
  cardBalLabel:  { fontSize: 9, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular' },
  cardBal:       { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginTop: 2 },
  cardNumLabel:  { fontSize: 8, color: 'rgba(255,255,255,0.45)', marginTop: 22, fontFamily: 'Inter_400Regular' },
  cardNumRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  cardNum:       { fontSize: 9, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },

  // Behavioral metrics row
  metricsRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.09)', marginBottom: 20 },
  metricItem:       { alignItems: 'center', flex: 1 },
  metricItemMain:   { alignItems: 'center', flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  metricCircle:     { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  metricCircleMain: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  metricPct:        { fontSize: 7, color: '#00B894', fontFamily: 'Inter_600SemiBold', marginTop: 1 },
  behavScore:       { fontSize: 22, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  metricLabel:      { fontSize: 8, color: '#64748b', textAlign: 'center', lineHeight: 12, fontFamily: 'Inter_400Regular' },

  // Recent activities
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  recentTitle:  { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  recentDate:   { fontSize: 9, color: '#64748b', marginTop: 2, fontFamily: 'Inter_400Regular' },
  seeAll:       { fontSize: 11, color: '#818cf8', fontFamily: 'Inter_600SemiBold' },
  txRow:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
  txIconWrap:   { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  txName:       { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  txSub:        { fontSize: 9, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  txAmount:     { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  // Quick actions
  quickGrid:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginTop: 16 },
  quickBtn:     { width: '47%', backgroundColor: '#1e293b', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  quickBtnText: { fontSize: 10, fontWeight: '600', color: '#cbd5e1', textAlign: 'center', marginTop: 5, fontFamily: 'Inter_600SemiBold' },
});
