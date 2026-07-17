import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';

const C = {
  midnight: '#1A237E',
  purple:   '#6C5CE7',
  green:    '#00B894',
  red:      '#D63031',
};

const LOGO = require('@/assets/images/madarik-logo.png');

const TRANSACTIONS = [
  { id: '1', name: 'MadarikC',    sub: 'Project bonus',  amount: '+300.00', positive: true  },
  { id: '2', name: 'Muvi Cinema', sub: 'Movie tickets',  amount: '-130.00', positive: false },
  { id: '3', name: 'Zara',        sub: 'Payments',       amount: '-249.00', positive: false },
];

const CARDS = [
  { bal: '8,500', num: '2412 7512 3412 3456', gradient: ['#1A237E', '#312e81'] as const },
  { bal: '2,150', num: '6542 3xxx xxxx xxxx', gradient: ['#1e40af', '#3730a3'] as const },
];

export default function PersonalHome() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { setMode } = useAppMode();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const firstName = user?.name?.split(' ')[0] || 'there';

  const QUICK_ACTIONS = [
    { icon: 'trending-up-outline' as const, label: t('homeInvest'),  route: '/investments'           },
    { icon: 'wallet-outline' as const,      label: t('homeSavings'), route: '/savings'               },
    { icon: 'card-outline' as const,        label: t('homeCards'),   route: '/cards'                 },
    { icon: 'bar-chart-outline' as const,   label: t('homeScore'),   route: '/behavioral-assessment' },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 180 : 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Welcome Header ─────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Image source={LOGO} style={styles.headerLogo} resizeMode="contain" />
          <View style={[styles.greetWrap, isRTL && { alignItems: 'flex-end' }]}>
            <Text style={styles.goodMorning}>{t('homeGoodMorning')}</Text>
            <Text style={styles.userName}>{t('homeWelcomeBack')} {firstName}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Balance Card ───────────────────────────────────────────────── */}
      <LinearGradient colors={[C.midnight, C.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>{t('homeBalance')}</Text>
        <Text style={styles.balanceAmount}>SAR 8,650.00</Text>
        <View style={[styles.balanceRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.balanceStat}>
            <Ionicons name="trending-up" size={12} color={C.green} />
            <Text style={[styles.balanceStatText, { color: C.green }]}> +3.2% {t('homePortfolio')}</Text>
          </View>
          <View style={styles.balanceStat}>
            <Ionicons name="analytics-outline" size={12} color="#c7d2fe" />
            <Text style={styles.balanceStatText}> {t('homeScore')}: 87</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Quick actions ─────────────────────────────────────────────── */}
      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map(q => (
          <TouchableOpacity
            key={q.label}
            style={styles.quickItem}
            activeOpacity={0.8}
            onPress={() => router.push(q.route as any)}
          >
            <View style={styles.quickIcon}>
              <Ionicons name={q.icon} size={18} color={C.midnight} />
            </View>
            <Text style={styles.quickLabel} numberOfLines={1}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Cards ─────────────────────────────────────────────────────── */}
      <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={styles.sectionTitle}>{t('homeCards')}</Text>
        <TouchableOpacity onPress={() => router.push('/cards')}>
          <Text style={styles.sectionLink}>{t('homeViewAll')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {CARDS.map((c, i) => (
          <TouchableOpacity key={i} onPress={() => router.push('/cards')} activeOpacity={0.9}>
            <LinearGradient colors={c.gradient} style={styles.card}>
              <Text style={styles.cardBal}>SAR {c.bal}</Text>
              <Text style={styles.cardNum}>{c.num}</Text>
              <View style={[styles.cardBottom, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.cardLabel}>{t('homeBalance')}</Text>
                <Ionicons name="wifi-outline" size={18} color="rgba(255,255,255,0.6)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Transactions ──────────────────────────────────────────────── */}
      <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={styles.sectionTitle}>{t('homeRecentTx')}</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>{t('homeViewAll')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.txList}>
        {TRANSACTIONS.map(tx => (
          <TouchableOpacity key={tx.id} style={[styles.txRow, isRTL && { flexDirection: 'row-reverse' }]} activeOpacity={0.8}>
            <View style={styles.txIcon}>
              <Ionicons name={tx.positive ? 'arrow-down-outline' : 'arrow-up-outline'} size={16} color={tx.positive ? C.green : C.red} />
            </View>
            <View style={[styles.txInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={styles.txName}>{tx.name}</Text>
              <Text style={styles.txSub}>{tx.sub}</Text>
            </View>
            <Text style={[styles.txAmount, { color: tx.positive ? C.green : C.red }]}>{tx.amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Switch mode ──────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.switchBtn} onPress={() => setMode('business')} activeOpacity={0.85}>
        <Ionicons name="swap-horizontal-outline" size={16} color="#4f46e5" />
        <Text style={styles.switchText}>{t('settingsSwitchBusiness')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },

  header: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogo: { width: 36, height: 36 },
  greetWrap: { flex: 1 },
  goodMorning: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, fontFamily: 'Inter_500Medium' },
  userName: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  bellBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  balanceCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 20 },
  balanceLabel: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular', marginBottom: 4 },
  balanceAmount: { fontSize: 30, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 12 },
  balanceRow: { flexDirection: 'row', gap: 16 },
  balanceStat: { flexDirection: 'row', alignItems: 'center' },
  balanceStatText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },

  quickRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 18, gap: 10 },
  quickItem: { flex: 1, alignItems: 'center', gap: 6 },
  quickIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  quickLabel: { fontSize: 10, color: '#374151', fontFamily: 'Inter_500Medium', textAlign: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 22, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  sectionLink: { fontSize: 12, color: '#4f46e5', fontFamily: 'Inter_500Medium' },

  card: { width: 200, borderRadius: 18, padding: 18, height: 120, justifyContent: 'space-between' },
  cardBal: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  cardNum: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_400Regular' },

  txList: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  txIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  txSub: { fontSize: 11, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  txAmount: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 16, paddingVertical: 13, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e0e7ff' },
  switchText: { fontSize: 14, color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
});
