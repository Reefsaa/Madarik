import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

type FilterKey = 'All' | 'Urgent' | 'Upcoming';

const PAYMENTS = [
  { id:'1', nameEn:'Monthly Payroll',     nameAr:'الرواتب الشهرية',   categoryEn:'Payroll',   categoryAr:'الرواتب',   dueEn:'Due in 5 days', dueAr:'مستحق خلال 5 أيام', date:'Jul 21, 2026', amount:'SAR 85,000', status:'Upcoming', icon:'people-outline' as const },
  { id:'2', nameEn:'Supplier Invoice #82',nameAr:'فاتورة مورد #82',   categoryEn:'Supplier',  categoryAr:'المورد',    dueEn:'Tomorrow',       dueAr:'غداً',              date:'Jul 17, 2026', amount:'SAR 42,000', status:'Urgent',   icon:'cube-outline' as const },
  { id:'3', nameEn:'Office Rent - HQ',    nameAr:'إيجار المكتب - HQ', categoryEn:'Rent',      categoryAr:'الإيجار',   dueEn:'Due in 12 days', dueAr:'مستحق خلال 12 يوم', date:'Jul 28, 2026', amount:'SAR 18,000', status:'Upcoming', icon:'business-outline' as const },
  { id:'4', nameEn:'Cloud Services',      nameAr:'خدمات سحابية',      categoryEn:'Technology', categoryAr:'التقنية',  dueEn:'Due in 8 days',  dueAr:'مستحق خلال 8 أيام', date:'Jul 24, 2026', amount:'SAR 3,400',  status:'Upcoming', icon:'cloud-outline' as const },
  { id:'5', nameEn:'Insurance Premium',   nameAr:'قسط التأمين',       categoryEn:'Insurance',  categoryAr:'التأمين',  dueEn:'Due in 3 days',  dueAr:'مستحق خلال 3 أيام', date:'Jul 19, 2026', amount:'SAR 7,800',  status:'Urgent',   icon:'shield-outline' as const },
  { id:'6', nameEn:'Equipment Lease',     nameAr:'إيجار المعدات',     categoryEn:'Equipment',  categoryAr:'المعدات',  dueEn:'Due in 15 days', dueAr:'مستحق خلال 15 يوم', date:'Jul 31, 2026', amount:'SAR 12,000', status:'Upcoming', icon:'construct-outline' as const },
  { id:'7', nameEn:'Marketing Agency',    nameAr:'وكالة التسويق',     categoryEn:'Marketing',  categoryAr:'التسويق', dueEn:'Due in 18 days', dueAr:'مستحق خلال 18 يوم', date:'Aug 3, 2026',  amount:'SAR 22,000', status:'Upcoming', icon:'megaphone-outline' as const },
];

export default function UpcomingPaymentsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language } = useLanguage();
  const [filter, setFilter] = useState<FilterKey>('All');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const filtered = PAYMENTS.filter(p => filter === 'All' || p.status === filter);
  const totalAmount = PAYMENTS.reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g, '')), 0);

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'All',      label: t('upcomingFilterAll') },
    { key: 'Urgent',   label: t('upcomingFilterUrgent') },
    { key: 'Upcoming', label: t('upcomingFilterUpcoming') },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('upcomingTitle')}</Text>
          <View style={{ width: 34 }} />
        </View>

        <View style={styles.totalCard}>
          <Text style={[styles.totalLabel, isRTL && { textAlign: 'right' }]}>{t('upcomingTotalDue')}</Text>
          <Text style={styles.totalValue}>SAR {totalAmount.toLocaleString()}</Text>
          <View style={[styles.totalMeta, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.totalMetaItem}>
              <View style={[styles.metaDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.metaText}>{PAYMENTS.filter(p => p.status === 'Urgent').length} {t('upcomingFilterUrgent')}</Text>
            </View>
            <View style={styles.totalMetaItem}>
              <View style={[styles.metaDot, { backgroundColor: '#818cf8' }]} />
              <Text style={styles.metaText}>{PAYMENTS.filter(p => p.status === 'Upcoming').length} {t('upcomingFilterUpcoming')}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.filterRow, isRTL && { flexDirection: 'row-reverse' }]}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f.key} style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]} onPress={() => setFilter(f.key)} activeOpacity={0.8}>
              <Text style={[styles.filterBtnText, filter === f.key && styles.filterBtnTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24 }} showsVerticalScrollIndicator={false}>
        {filtered.map((p) => {
          const name     = language === 'ar' ? p.nameAr     : p.nameEn;
          const category = language === 'ar' ? p.categoryAr : p.categoryEn;
          const due      = language === 'ar' ? p.dueAr      : p.dueEn;
          return (
            <TouchableOpacity key={p.id} style={styles.paymentCard} activeOpacity={0.85}>
              <View style={[styles.paymentLeft, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.paymentIcon, p.status === 'Urgent' && styles.paymentIconUrgent, isRTL && { marginLeft: 12, marginRight: 0 }]}>
                  <Ionicons name={p.icon} size={18} color={p.status === 'Urgent' ? '#ef4444' : '#4f46e5'} />
                </View>
                <View style={[styles.paymentInfo, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={styles.paymentName}>{name}</Text>
                  <Text style={styles.paymentCategory}>{category}</Text>
                  <View style={[styles.paymentDueRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="time-outline" size={10} color={p.status === 'Urgent' ? '#ef4444' : '#9ca3af'} />
                    <Text style={[styles.paymentDue, p.status === 'Urgent' && styles.paymentDueUrgent]}> {due}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentAmount}>{p.amount}</Text>
                <Text style={styles.paymentDate}>{p.date}</Text>
                {p.status === 'Urgent' && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>{t('upcomingUrgentBadge')}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  totalCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 14 },
  totalLabel: { fontSize: 10, color: '#94a3b8', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  totalValue: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  totalMeta: { flexDirection: 'row', gap: 16, marginTop: 10 },
  totalMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaDot: { width: 8, height: 8, borderRadius: 4 },
  metaText: { fontSize: 12, color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  filterBtnActive: { backgroundColor: '#4f46e5' },
  filterBtnText: { fontSize: 13, color: '#94a3b8', fontFamily: 'Inter_500Medium' },
  filterBtnTextActive: { color: '#fff' },
  list: { flex: 1 },
  paymentCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  paymentIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  paymentIconUrgent: { backgroundColor: '#fef2f2' },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  paymentCategory: { fontSize: 10, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  paymentDueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  paymentDue: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  paymentDueUrgent: { color: '#ef4444', fontFamily: 'Inter_600SemiBold' },
  paymentRight: { alignItems: 'flex-end' },
  paymentAmount: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  paymentDate: { fontSize: 10, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  urgentBadge: { backgroundColor: '#fef2f2', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4 },
  urgentBadgeText: { fontSize: 8, fontWeight: '700', color: '#ef4444', fontFamily: 'Inter_700Bold' },
});
