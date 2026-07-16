import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  midnight: '#1A237E',
  purple:   '#6C5CE7',
  green:    '#00B894',
  red:      '#D63031',
  amber:    '#E67E22',
  grey:     '#F5F6FA',
};

const FILTERS = ['All', 'Emotional', 'Insights', 'Transact'] as const;
type Filter = typeof FILTERS[number];

interface Notification {
  id: string;
  accentColor: string;
  tag: string;
  tagColor: string;
  title: string;
  time: string;
  body: string;
  actions?: string[];
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    accentColor: C.red,
    tag: 'Emotional Alert',
    tagColor: C.red,
    title: 'Market Volatility Warning',
    time: 'Just Now',
    body: 'Crypto assets are down 6% in the last hour. MindBot detected elevated anxiety signals and suggests a breathing intervention.',
    actions: ['Snooze emotional alerts for 24h', 'Start Intervention', 'View Charts'],
  },
  {
    id: '2',
    accentColor: C.amber,
    tag: 'Behavioral Insight',
    tagColor: C.amber,
    title: 'Emotional Stability Shift',
    time: '42m ago',
    body: 'Your Emotional Stability Index changed to 72% (+4%). This trend suggests better decision-making under stress. Review AI insights.',
    actions: ['View Report'],
  },
  {
    id: '3',
    accentColor: C.midnight,
    tag: 'Security',
    tagColor: C.midnight,
    title: 'New Device Detected',
    time: '5h ago',
    body: "A new sign-in was detected from 'iPhone 13' in San Francisco, CA. Was this you? Your account is currently protected.",
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');

  const filtered = NOTIFICATIONS.filter((n) => {
    if (search) {
      const q = search.toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
    }
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Emotional') return n.tag === 'Emotional Alert';
    if (activeFilter === 'Insights')  return n.tag === 'Behavioral Insight';
    if (activeFilter === 'Transact')  return n.tag === 'Transaction';
    return true;
  });

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      {/* ── Navigation header ─────────────────────────────────────────── */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search bar ────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={15} color="#9ca3af" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search notifications, bots, or assets..."
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={15} color="#d1d5db" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filter pills ──────────────────────────────────────────────── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Card list ─────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{filtered.length} UNREAD</Text>
          </View>
        </View>

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={40} color="#d1d5db" />
            <Text style={styles.emptyText}>No notifications found</Text>
          </View>
        )}

        {filtered.map((n) => (
          <NotifCard key={n.id} n={n} />
        ))}
      </ScrollView>
    </View>
  );
}

function NotifCard({ n }: { n: Notification }) {
  return (
    <View style={styles.card}>
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: n.accentColor }]} />

      <View style={styles.cardContent}>
        {/* Tag + timestamp row */}
        <View style={styles.cardTopRow}>
          <View style={[styles.tag, { backgroundColor: n.accentColor + '18' }]}>
            <Text style={[styles.tagText, { color: n.accentColor }]}>{n.tag}</Text>
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={10} color="#9ca3af" />
            <Text style={styles.timeText}>{n.time}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.cardTitle}>{n.title}</Text>

        {/* Body */}
        <Text style={styles.cardBody}>{n.body}</Text>

        {/* Action buttons */}
        {n.actions && n.actions.length > 0 && (
          <View style={styles.actionsRow}>
            {n.actions.map((a, i) => (
              <TouchableOpacity
                key={a}
                style={[
                  styles.actionBtn,
                  i === 0 && { backgroundColor: n.accentColor + '12', borderColor: n.accentColor + '40' },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.actionBtnText,
                    i === 0 && { color: n.accentColor, fontFamily: 'Inter_600SemiBold' },
                  ]}
                  numberOfLines={1}
                >
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },

  // Nav header
  navHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn:   { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F5F6FA', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  navTitle:  { fontSize: 18, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', flex: 1 },
  markAllBtn:{ },
  markAllText:{ fontSize: 12, color: '#6C5CE7', fontFamily: 'Inter_600SemiBold' },

  // Search
  searchWrap:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, backgroundColor: '#F5F6FA', borderRadius: 12, paddingHorizontal: 14, height: 44 },
  searchInput: { flex: 1, fontSize: 13, color: '#111827', fontFamily: 'Inter_400Regular' },

  // Filter pills
  filterRow:  { paddingHorizontal: 16, gap: 8, marginBottom: 16, alignItems: 'center' },
  filterPill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, backgroundColor: '#F5F6FA', borderWidth: 1, borderColor: '#e5e7eb' },
  filterPillActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  filterPillText:   { fontSize: 12, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  filterPillTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },

  // Section
  list:          { flex: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle:  { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, fontFamily: 'Inter_700Bold' },
  unreadBadge:   { backgroundColor: '#6C5CE7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  unreadText:    { fontSize: 9, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText:  { fontSize: 14, color: '#9ca3af', fontFamily: 'Inter_400Regular' },

  // Notification card
  card:        { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  accentBar:   { width: 4 },
  cardContent: { flex: 1, padding: 14 },
  cardTopRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  tag:         { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  tagText:     { fontSize: 9, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: 0.3 },
  timeRow:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText:    { fontSize: 9, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  cardTitle:   { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  cardBody:    { fontSize: 12, color: '#4b5563', lineHeight: 17, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  actionsRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  actionBtn:   { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F5F6FA', borderWidth: 1, borderColor: '#e5e7eb' },
  actionBtnText:{ fontSize: 11, color: '#374151', fontFamily: 'Inter_500Medium' },
});
