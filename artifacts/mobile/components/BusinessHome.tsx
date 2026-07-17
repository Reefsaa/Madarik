import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';

const LOGO = require('@/assets/images/madarik-logo.png');

const PAYMENTS = [
  { name: 'Monthly Payroll', due: 'Due in 5 days', amount: 'SAR 85,000', urgent: false },
  { name: 'Supplier Invoice #82', due: 'Tomorrow', amount: 'SAR 42,000', urgent: true },
  { name: 'Office Rent - HQ', due: 'Due in 12 days', amount: 'SAR 18,000', urgent: false },
];

const ACTIVITY = [
  { text: 'Payroll processed successfully', time: 'Today, 09:15 AM' },
  { text: 'New Revenue: Client #241', time: 'Yesterday, 04:30 PM' },
  { text: 'Supplier payment completed', time: 'Jul 18, 11:20 AM' },
];

export default function BusinessHome() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { setMode } = useAppMode();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Dark header */}
      <LinearGradient colors={['#04071a', '#0a0e27', '#130d3a', '#1a1060']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          {/* Logo in top-left */}
          <Image source={LOGO} style={styles.headerLogo} resizeMode="contain" />
          <View style={[styles.headerCenter, isRTL && { alignItems: 'flex-end' }]}>
            <Text style={styles.goodMorning}>{t('homeGoodMorning')}</Text>
            <Text style={styles.companyName}>{user?.company || t('businessMode')}</Text>
            <Text style={styles.companyType}>{t('homeHealthScore').toLowerCase()}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={20} color="rgba(255,255,255,0.8)" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.welcomeText, isRTL && { textAlign: 'right' }]}>
          {t('homeWelcomeBack')} {firstName} 👋
        </Text>

        {/* Balance card */}
        <LinearGradient colors={['#a5b4fc', '#818cf8', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
          <View style={[styles.balanceHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.balanceCardLabel}>{t('homeTotalBal')}</Text>
            <View style={styles.trendCircle}>
              <Ionicons name="trending-up" size={14} color="#4f46e5" />
            </View>
          </View>
          <Text style={[styles.balanceAmount, isRTL && { textAlign: 'right' }]}>SAR 1,284,500</Text>
          <View style={[styles.balanceStats, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>{t('homeRevenue')}</Text>
              <Text style={[styles.balanceStatValue, { color: '#22c55e' }]}>+SAR 124K</Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>{t('homeExpenses')}</Text>
              <Text style={[styles.balanceStatValue, { color: '#ef4444' }]}>-SAR 87K</Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>{t('homeCashflow')}</Text>
              <Text style={[styles.balanceStatValue, { color: '#4f46e5' }]}>SAR 37K</Text>
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>

      {/* Upcoming Payments */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.sectionTitle}>{t('homePayments')}</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>{t('homeViewAll')}</Text></TouchableOpacity>
        </View>
        {PAYMENTS.map((p, i) => (
          <TouchableOpacity key={i} style={[styles.paymentRow, isRTL && { flexDirection: 'row-reverse' }]} activeOpacity={0.8}>
            <View style={[styles.paymentIcon, p.urgent && styles.paymentIconUrgent]}>
              <Ionicons name="calendar-outline" size={16} color={p.urgent ? '#ef4444' : '#4f46e5'} />
            </View>
            <View style={[styles.paymentInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={styles.paymentName}>{p.name}</Text>
              <Text style={[styles.paymentDue, p.urgent && { color: '#ef4444' }]}>{p.due}</Text>
            </View>
            <Text style={[styles.paymentAmount, p.urgent && { color: '#ef4444' }]}>{p.amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.sectionTitle}>{t('homeActivity')}</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>{t('homeViewAll')}</Text></TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          {ACTIVITY.map((a, i) => (
            <View key={i} style={[styles.activityRow, isRTL && { flexDirection: 'row-reverse' }, i < ACTIVITY.length - 1 && styles.activityBorder]}>
              <View style={styles.activityDot} />
              <View style={[styles.activityInfo, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={styles.activityText}>{a.text}</Text>
                <Text style={styles.activityTime}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Switch to Personal */}
      <TouchableOpacity style={styles.switchBtn} onPress={() => setMode('personal')} activeOpacity={0.85}>
        <Ionicons name="swap-horizontal-outline" size={16} color="#4f46e5" />
        <Text style={styles.switchText}>{t('settingsSwitchPersonal')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },

  header: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerLogo: { width: 36, height: 36, marginRight: 10 },
  headerCenter: { flex: 1 },
  goodMorning: { fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.2, fontFamily: 'Inter_500Medium' },
  companyName: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  companyType: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter_400Regular' },
  notifBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444', borderWidth: 1, borderColor: '#0a0e27' },
  welcomeText: { fontSize: 18, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 16 },

  balanceCard: { borderRadius: 20, padding: 18 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  balanceCardLabel: { fontSize: 12, color: '#312e81', fontFamily: 'Inter_500Medium' },
  trendCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  balanceAmount: { fontSize: 26, fontWeight: '800', color: '#1e1b4b', fontFamily: 'Inter_700Bold', marginBottom: 14 },
  balanceStats: { flexDirection: 'row', alignItems: 'center' },
  balanceStat: { flex: 1, alignItems: 'center' },
  balanceStatLabel: { fontSize: 10, color: '#4338ca', fontFamily: 'Inter_400Regular', marginBottom: 2 },
  balanceStatValue: { fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  balanceDivider: { width: 1, height: 28, backgroundColor: 'rgba(99,102,241,0.2)' },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  sectionLink: { fontSize: 12, color: '#4f46e5', fontFamily: 'Inter_500Medium' },

  paymentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#f3f4f6' },
  paymentIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  paymentIconUrgent: { backgroundColor: '#fef2f2' },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: 13, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  paymentDue: { fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  paymentAmount: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },

  activityCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6366f1', marginRight: 12, flexShrink: 0 },
  activityInfo: { flex: 1 },
  activityText: { fontSize: 13, color: '#111827', fontFamily: 'Inter_500Medium' },
  activityTime: { fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },

  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 16, paddingVertical: 13, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e0e7ff' },
  switchText: { fontSize: 14, color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
});
