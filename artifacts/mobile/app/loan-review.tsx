import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

export default function LoanReviewScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const GUARANTEES = [t('loanG1'), t('loanG2'), t('loanG3'), t('loanG4')];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: bottomPad + 24 }}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: topPad + 8 }, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{t('loanTitle')}</Text>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.darkSection}>
        <View style={[styles.offerHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.offerTitle}>{t('loanReviewOffer')}</Text>
          <View style={[styles.prequalBadge, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="flash" size={11} color="#4338ca" />
            <Text style={[styles.prequalText, isRTL && { marginRight: 4, marginLeft: 0 }]}>{t('loanPreQualified')}</Text>
          </View>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>{t('loanTotalAmount')}</Text>
          <Text style={styles.amountValue}>SAR 50,000</Text>
          <Text style={styles.amountSub}>{t('loanAmountSub')}</Text>
        </View>

        <View style={styles.statGrid}>
          {[
            { icon: 'stats-chart-outline' as const, label: t('loanInterestRate'), value: '4.5%', sub: t('loanFixedAnnual') },
            { icon: 'calendar-outline' as const,    label: t('loanTermPeriod'),   value: '12 Months', sub: t('loanMonthlyInst') },
            { icon: 'card-outline' as const,        label: t('loanMonthly'),      value: 'SAR 4,354', sub: t('loanDueOn5th') },
            { icon: 'shield-checkmark-outline' as const, label: t('loanTotalCost'), value: 'SAR 52,250', sub: t('loanIncProcessing') },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statTopRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.statIconWrap}>
                  <Ionicons name={s.icon} size={16} color="#4f46e5" />
                </View>
                <Ionicons name="information-circle-outline" size={15} color="#d1d5db" />
              </View>
              <Text style={[styles.statLabel, isRTL && { textAlign: 'right' }]}>{s.label}</Text>
              <Text style={[styles.statValue, isRTL && { textAlign: 'right' }]}>{s.value}</Text>
              <Text style={[styles.statSub, isRTL && { textAlign: 'right' }]}>{s.sub}</Text>
            </View>
          ))}
        </View>

        <View style={styles.guaranteeCard}>
          <View style={[styles.guaranteeHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.guaranteeIconWrap}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#4f46e5" />
            </View>
            <View style={[{ marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={styles.guaranteeTitle}>{t('loanGuaranteeTitle')}</Text>
              <Text style={styles.guaranteeSub}>{t('loanGuaranteeSub')}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          {GUARANTEES.map((g) => (
            <View key={g} style={[styles.guaranteeRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#4f46e5" />
              <Text style={[styles.guaranteeText, isRTL && { marginRight: 8, marginLeft: 0, textAlign: 'right' }]}>{g}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={{ padding: 16, gap: 10 }}>
        <TouchableOpacity activeOpacity={0.85}>
          <LinearGradient colors={['#0f172a', '#4338ca']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>{t('loanContinue')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={styles.outlineBtnText}>{t('loanBackRec')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  topBar: { backgroundColor: '#0f172a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  darkSection: { padding: 16, paddingTop: 20 },
  offerHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  offerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  prequalBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  prequalText: { fontSize: 10, fontWeight: '700', color: '#4338ca', marginLeft: 4, fontFamily: 'Inter_700Bold' },
  amountCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 20, alignItems: 'center', marginTop: 18 },
  amountLabel: { fontSize: 11, color: '#c7d2fe', letterSpacing: 1.5, fontFamily: 'Inter_400Regular' },
  amountValue: { fontSize: 34, fontWeight: '800', color: '#fff', marginTop: 8, fontFamily: 'Inter_700Bold' },
  amountSub: { fontSize: 12, color: '#a5b4fc', fontStyle: 'italic', marginTop: 6, fontFamily: 'Inter_400Regular' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12 },
  statTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statIconWrap: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 9, color: '#9ca3af', letterSpacing: 0.5, marginTop: 10, fontFamily: 'Inter_400Regular' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#312e81', marginTop: 3, fontFamily: 'Inter_700Bold' },
  statSub: { fontSize: 10, color: '#6b7280', marginTop: 2, fontFamily: 'Inter_400Regular' },
  guaranteeCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginTop: 4 },
  guaranteeHeader: { flexDirection: 'row', alignItems: 'center' },
  guaranteeIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
  guaranteeTitle: { fontSize: 13, fontWeight: '700', color: '#312e81', fontFamily: 'Inter_700Bold' },
  guaranteeSub: { fontSize: 10, color: '#6b7280', marginTop: 2, fontFamily: 'Inter_400Regular' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },
  guaranteeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  guaranteeText: { fontSize: 12, color: '#374151', marginLeft: 8, flex: 1, fontFamily: 'Inter_400Regular' },
  primaryBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  outlineBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  outlineBtnText: { color: '#111827', fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
