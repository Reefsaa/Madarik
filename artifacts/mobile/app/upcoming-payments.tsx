import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Filter = 'All' | 'Urgent' | 'Upcoming';

const PAYMENTS = [
  { id: '1', name: 'Monthly Payroll', category: 'Payroll', due: 'Due in 5 days', date: 'Jul 21, 2026', amount: 'SAR 85,000', status: 'Upcoming', icon: 'people-outline' as const },
  { id: '2', name: 'Supplier Invoice #82', category: 'Supplier', due: 'Tomorrow', date: 'Jul 17, 2026', amount: 'SAR 42,000', status: 'Urgent', icon: 'cube-outline' as const },
  { id: '3', name: 'Office Rent - HQ', category: 'Rent', due: 'Due in 12 days', date: 'Jul 28, 2026', amount: 'SAR 18,000', status: 'Upcoming', icon: 'business-outline' as const },
  { id: '4', name: 'Cloud Services', category: 'Technology', due: 'Due in 8 days', date: 'Jul 24, 2026', amount: 'SAR 3,400', status: 'Upcoming', icon: 'cloud-outline' as const },
  { id: '5', name: 'Insurance Premium', category: 'Insurance', due: 'Due in 3 days', date: 'Jul 19, 2026', amount: 'SAR 7,800', status: 'Urgent', icon: 'shield-outline' as const },
  { id: '6', name: 'Equipment Lease', category: 'Equipment', due: 'Due in 15 days', date: 'Jul 31, 2026', amount: 'SAR 12,000', status: 'Upcoming', icon: 'construct-outline' as const },
  { id: '7', name: 'Marketing Agency', category: 'Marketing', due: 'Due in 18 days', date: 'Aug 3, 2026', amount: 'SAR 22,000', status: 'Upcoming', icon: 'megaphone-outline' as const },
];

export default function UpcomingPaymentsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const filtered = PAYMENTS.filter((p) => filter === 'All' || p.status === filter);
  const totalAmount = PAYMENTS.reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g, '')), 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upcoming Payments</Text>
          <View style={{ width: 34 }} />
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL DUE THIS MONTH</Text>
          <Text style={styles.totalValue}>SAR {totalAmount.toLocaleString()}</Text>
          <View style={styles.totalMeta}>
            <View style={styles.totalMetaItem}>
              <View style={[styles.metaDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.metaText}>{PAYMENTS.filter((p) => p.status === 'Urgent').length} Urgent</Text>
            </View>
            <View style={styles.totalMetaItem}>
              <View style={[styles.metaDot, { backgroundColor: '#818cf8' }]} />
              <Text style={styles.metaText}>{PAYMENTS.filter((p) => p.status === 'Upcoming').length} Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {(['All', 'Urgent', 'Upcoming'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((p) => (
          <TouchableOpacity key={p.id} style={styles.paymentCard} activeOpacity={0.85}>
            <View style={styles.paymentLeft}>
              <View style={[styles.paymentIcon, p.status === 'Urgent' && styles.paymentIconUrgent]}>
                <Ionicons name={p.icon} size={18} color={p.status === 'Urgent' ? '#ef4444' : '#4f46e5'} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{p.name}</Text>
                <Text style={styles.paymentCategory}>{p.category}</Text>
                <View style={styles.paymentDueRow}>
                  <Ionicons
                    name="time-outline"
                    size={10}
                    color={p.status === 'Urgent' ? '#ef4444' : '#9ca3af'}
                  />
                  <Text style={[styles.paymentDue, p.status === 'Urgent' && styles.paymentDueUrgent]}>
                    {' '}{p.due}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.paymentRight}>
              <Text style={styles.paymentAmount}>{p.amount}</Text>
              <Text style={styles.paymentDate}>{p.date}</Text>
              {p.status === 'Urgent' && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>URGENT</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },

  totalCard: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 14,
  },
  totalLabel: { fontSize: 10, color: '#94a3b8', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  totalValue: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  totalMeta: { flexDirection: 'row', gap: 16, marginTop: 10 },
  totalMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaDot: { width: 8, height: 8, borderRadius: 4 },
  metaText: { fontSize: 12, color: '#94a3b8', fontFamily: 'Inter_400Regular' },

  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterBtnActive: { backgroundColor: '#4f46e5' },
  filterBtnText: { fontSize: 13, color: '#94a3b8', fontFamily: 'Inter_500Medium' },
  filterBtnTextActive: { color: '#fff' },

  list: { flex: 1 },
  paymentCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    marginBottom: 10, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#f3f4f6',
  },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  paymentIcon: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
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
  urgentBadge: {
    backgroundColor: '#fef2f2', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 4,
  },
  urgentBadgeText: { fontSize: 8, fontWeight: '700', color: '#ef4444', fontFamily: 'Inter_700Bold' },
});
