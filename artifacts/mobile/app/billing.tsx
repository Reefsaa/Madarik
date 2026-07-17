import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const INVOICES = [
  { id: 'INV-2026-007', date: 'Jul 1, 2026',  amount: 'SAR 299.00', status: 'Paid',    statusAr: 'مدفوع'    },
  { id: 'INV-2026-006', date: 'Jun 1, 2026',  amount: 'SAR 299.00', status: 'Paid',    statusAr: 'مدفوع'    },
  { id: 'INV-2026-005', date: 'May 1, 2026',  amount: 'SAR 299.00', status: 'Paid',    statusAr: 'مدفوع'    },
];

export default function BillingScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('billTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* Current plan */}
        <Text style={[s.sectionLabel, isRTL && { textAlign: 'right' }]}>{t('billPlanSection')}</Text>
        <LinearGradient colors={['#4f46e5', '#7c3aed']} style={s.planCard}>
          <View style={[s.planTop, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={s.planIconWrap}>
              <Ionicons name="briefcase-outline" size={22} color="#fff" />
            </View>
            <View style={[s.planInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={s.planName}>{t('billPlanName')}</Text>
              <Text style={s.planPrice}>{t('billPlanPrice')}</Text>
            </View>
            <View style={s.activeBadge}>
              <Text style={s.activeBadgeText}>{isRTL ? 'نشط' : 'Active'}</Text>
            </View>
          </View>
          <View style={s.planMeta}>
            <View style={[s.planMetaItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.7)" />
              <Text style={s.planMetaText}>  {t('billNextDate')}: Aug 1, 2026</Text>
            </View>
          </View>
          <TouchableOpacity style={s.managePlanBtn} activeOpacity={0.85}>
            <Text style={s.managePlanText}>{t('billManagePlan')}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Features included */}
        <View style={s.featuresCard}>
          {[
            { icon: 'bar-chart-outline',      label: isRTL ? 'تحليلات التدفق النقدي'   : 'Cash flow analytics'     },
            { icon: 'sparkles-outline',       label: isRTL ? 'مستشار مدرك الذكي'       : 'Modrik AI advisor'        },
            { icon: 'people-outline',         label: isRTL ? 'حتى 5 مستخدمين'          : 'Up to 5 team members'     },
            { icon: 'cloud-download-outline', label: isRTL ? 'تقارير PDF غير محدودة'   : 'Unlimited PDF reports'    },
          ].map((feat, i) => (
            <View key={i} style={[s.featRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={s.featIcon}>
                <Ionicons name={feat.icon as any} size={14} color="#4f46e5" />
              </View>
              <Text style={s.featLabel}>{feat.label}</Text>
            </View>
          ))}
        </View>

        {/* Invoices */}
        <Text style={[s.sectionLabel, isRTL && { textAlign: 'right' }]}>{t('billHistory')}</Text>
        <View style={s.invoiceCard}>
          {INVOICES.map((inv, i) => (
            <View key={inv.id}>
              <View style={[s.invoiceRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[s.invoiceLeft, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={s.invoiceId}>{inv.id}</Text>
                  <Text style={s.invoiceDate}>{inv.date}</Text>
                </View>
                <View style={[s.invoiceRight, isRTL && { alignItems: 'flex-start' }]}>
                  <Text style={s.invoiceAmt}>{inv.amount}</Text>
                  <View style={s.paidBadge}>
                    <Text style={s.paidText}>{language === 'ar' ? inv.statusAr : inv.status}</Text>
                  </View>
                </View>
                <TouchableOpacity style={s.downloadBtn} onPress={() => {}}>
                  <Ionicons name="download-outline" size={16} color="#4f46e5" />
                </TouchableOpacity>
              </View>
              {i < INVOICES.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backRTL: { marginRight: 0, marginLeft: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 22, marginBottom: 8 },
  planCard: { borderRadius: 20, marginHorizontal: 16, padding: 20 },
  planTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  planIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  planInfo: { flex: 1 },
  planName: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  planPrice: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontFamily: 'Inter_400Regular' },
  activeBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  activeBadgeText: { fontSize: 11, fontWeight: '700', color: '#065f46', fontFamily: 'Inter_700Bold' },
  planMeta: { marginBottom: 14 },
  planMetaItem: { flexDirection: 'row', alignItems: 'center' },
  planMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  managePlanBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  managePlanText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  featuresCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginTop: 12, borderWidth: 1, borderColor: '#f3f4f6', padding: 14, gap: 10 },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
  featLabel: { fontSize: 13, color: '#374151', fontFamily: 'Inter_500Medium' },
  invoiceCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  invoiceRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13 },
  invoiceLeft: { flex: 1 },
  invoiceId: { fontSize: 13, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  invoiceDate: { fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  invoiceRight: { alignItems: 'flex-end', marginRight: 12 },
  invoiceAmt: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  paidBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, marginTop: 3 },
  paidText: { fontSize: 10, fontWeight: '700', color: '#065f46', fontFamily: 'Inter_700Bold' },
  downloadBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: '#f9fafb', marginLeft: 14 },
});
