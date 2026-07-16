import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Severity = 'Critical' | 'Warning' | 'Info';
type Filter = 'All' | Severity;

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  desc: string;
  time: string;
  category: string;
  icon: keyof typeof Ionicons.glyphMap;
  read: boolean;
}

const ALERTS: Alert[] = [
  {
    id: '1',
    severity: 'Critical',
    title: 'Supplier Invoice Overdue',
    desc: 'Supplier Invoice #82 for SAR 42,000 is due tomorrow. Immediate action required to avoid late fees.',
    time: '30 min ago',
    category: 'Payments',
    icon: 'alert-circle-outline',
    read: false,
  },
  {
    id: '2',
    severity: 'Critical',
    title: 'Trade License Expiring',
    desc: 'Your commercial trade license expires in 14 days. Renewal must be completed to avoid business disruption.',
    time: '2 hours ago',
    category: 'Compliance',
    icon: 'document-outline',
    read: false,
  },
  {
    id: '3',
    severity: 'Warning',
    title: 'Cash Flow Declining Trend',
    desc: 'Cash flow projections show a 4.2% decline over the next 30 days. Monitor discretionary spending.',
    time: 'Yesterday',
    category: 'Cash Flow',
    icon: 'trending-down-outline',
    read: false,
  },
  {
    id: '4',
    severity: 'Warning',
    title: 'Payroll Due in 5 Days',
    desc: 'Monthly payroll of SAR 85,000 is scheduled in 5 days. Ensure payroll account has sufficient funds.',
    time: 'Yesterday',
    category: 'Payroll',
    icon: 'people-outline',
    read: true,
  },
  {
    id: '5',
    severity: 'Info',
    title: 'Q3 AI Analysis Complete',
    desc: 'Modrik AI has completed your Q3 2026 financial analysis. Business Health Score improved to 89/100.',
    time: 'Jul 15',
    category: 'Reports',
    icon: 'sparkles-outline',
    read: true,
  },
  {
    id: '6',
    severity: 'Info',
    title: 'Loan Pre-Approval Available',
    desc: 'You are pre-qualified for a SAR 50,000 working capital loan at 4.5% interest rate.',
    time: 'Jul 14',
    category: 'Financing',
    icon: 'business-outline',
    read: true,
  },
  {
    id: '7',
    severity: 'Info',
    title: 'Revenue Milestone Reached',
    desc: 'Congratulations! Your business crossed SAR 300,000 monthly revenue for the first time this quarter.',
    time: 'Jul 12',
    category: 'Revenue',
    icon: 'trophy-outline',
    read: true,
  },
];

const SEVERITY_STYLES: Record<Severity, { bg: string; border: string; text: string; dot: string }> = {
  Critical: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', dot: '#ef4444' },
  Warning: { bg: '#fefce8', border: '#fef08a', text: '#ca8a04', dot: '#eab308' },
  Info: { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1', dot: '#0ea5e9' },
};

export default function AIAlertsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const filtered = ALERTS.filter((a) => filter === 'All' || a.severity === filter);
  const unread = ALERTS.filter((a) => !a.read).length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Alerts</Text>
            {unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unread}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="checkmark-done-outline" size={16} color="#a5b4fc" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Critical', 'Warning', 'Info'] as Filter[]).map((f) => (
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
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((alert) => {
          const s = SEVERITY_STYLES[alert.severity];
          return (
            <TouchableOpacity
              key={alert.id}
              style={[styles.alertCard, !alert.read && styles.alertCardUnread]}
              activeOpacity={0.85}
            >
              {!alert.read && <View style={[styles.unreadDot, { backgroundColor: s.dot }]} />}
              <View style={[styles.alertIcon, { backgroundColor: s.bg, borderColor: s.border }]}>
                <Ionicons name={alert.icon} size={18} color={s.text} />
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertMeta}>
                  <Text style={styles.alertCategory}>{alert.category}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDesc}>{alert.desc}</Text>
                <View style={[styles.severityBadge, { backgroundColor: s.bg }]}>
                  <View style={[styles.severityDot, { backgroundColor: s.dot }]} />
                  <Text style={[styles.severityText, { color: s.text }]}>{alert.severity}</Text>
                </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  unreadBadge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center',
  },
  unreadText: { fontSize: 10, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },

  filterRow: { flexDirection: 'row', gap: 6 },
  filterBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterBtnActive: { backgroundColor: '#4f46e5' },
  filterBtnText: { fontSize: 12, color: '#94a3b8', fontFamily: 'Inter_500Medium' },
  filterBtnTextActive: { color: '#fff' },

  alertCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start',
    borderWidth: 1, borderColor: '#f3f4f6', position: 'relative',
  },
  alertCardUnread: { borderColor: '#e0e7ff' },
  unreadDot: {
    position: 'absolute', top: 14, right: 14,
    width: 8, height: 8, borderRadius: 4,
  },
  alertIcon: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 1,
  },
  alertContent: { flex: 1 },
  alertMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  alertCategory: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_500Medium' },
  alertTime: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  alertTitle: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 4 },
  alertDesc: { fontSize: 12, color: '#6b7280', lineHeight: 17, fontFamily: 'Inter_400Regular', marginBottom: 8 },
  severityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3,
  },
  severityDot: { width: 5, height: 5, borderRadius: 2.5 },
  severityText: { fontSize: 10, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
