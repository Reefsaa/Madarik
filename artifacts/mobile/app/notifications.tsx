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
import { useLanguage } from '@/context/LanguageContext';

const C = {
  midnight: '#1A237E',
  purple:   '#6C5CE7',
  green:    '#00B894',
  red:      '#D63031',
  amber:    '#E67E22',
  grey:     '#F5F6FA',
};

interface Notification {
  id: string;
  accentColor: string;
  tagKey: string;
  titleKey: string;
  timeKey: string;
  bodyKey: string;
  actionKeys?: string[];
}

// Static notification data with translation keys
const NOTIF_DATA = [
  {
    id: '1',
    accentColor: C.red,
    tagEn: 'Emotional Alert',  tagAr: 'تنبيه عاطفي',
    titleEn: 'Market Volatility Warning',  titleAr: 'تحذير تقلب السوق',
    timeEn: 'Just Now',  timeAr: 'الآن',
    bodyEn: 'Crypto assets are down 6% in the last hour. MindBot detected elevated anxiety signals and suggests a breathing intervention.',
    bodyAr: 'انخفضت الأصول الرقمية 6% في الساعة الأخيرة. رصد مدرك إشارات قلق مرتفعة ويقترح تمرين التنفس.',
    actionsEn: ['Snooze emotional alerts for 24h', 'Start Intervention', 'View Charts'],
    actionsAr: ['تأجيل التنبيهات 24 ساعة', 'بدء التدخل', 'عرض المخططات'],
    filterTag: 'Emotional Alert',
  },
  {
    id: '2',
    accentColor: C.amber,
    tagEn: 'Behavioral Insight',  tagAr: 'رؤية سلوكية',
    titleEn: 'Emotional Stability Shift',  titleAr: 'تحول في الاستقرار العاطفي',
    timeEn: '42m ago',  timeAr: 'منذ 42 دقيقة',
    bodyEn: 'Your Emotional Stability Index changed to 72% (+4%). This trend suggests better decision-making under stress. Review AI insights.',
    bodyAr: 'تغير مؤشر الاستقرار العاطفي إلى 72% (+4%). يشير هذا الاتجاه إلى تحسن في اتخاذ القرار تحت الضغط.',
    actionsEn: ['View Report'],  actionsAr: ['عرض التقرير'],
    filterTag: 'Behavioral Insight',
  },
  {
    id: '3',
    accentColor: C.midnight,
    tagEn: 'Security',  tagAr: 'أمان',
    titleEn: 'New Device Detected',  titleAr: 'جهاز جديد تم اكتشافه',
    timeEn: '5h ago',  timeAr: 'منذ 5 ساعات',
    bodyEn: "A new sign-in was detected from 'iPhone 13' in San Francisco, CA. Was this you? Your account is currently protected.",
    bodyAr: "تم اكتشاف تسجيل دخول جديد من 'iPhone 13' في سان فرانسيسكو. هل كنت أنت؟ حسابك محمي حالياً.",
    actionsEn: undefined,  actionsAr: undefined,
    filterTag: 'Security',
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [activeFilter, setActiveFilter] = useState<'All'|'Emotional'|'Insights'|'Transact'>('All');
  const [search, setSearch] = useState('');

  const FILTERS = [
    { key: 'All' as const,       label: t('notifFilterAll') },
    { key: 'Emotional' as const, label: t('notifFilterEmotional') },
    { key: 'Insights' as const,  label: t('notifFilterInsights') },
    { key: 'Transact' as const,  label: t('notifFilterTransact') },
  ];

  const filtered = NOTIF_DATA.filter((n) => {
    const title = language === 'ar' ? n.titleAr : n.titleEn;
    const body  = language === 'ar' ? n.bodyAr  : n.bodyEn;
    if (search) {
      const q = search.toLowerCase();
      if (!title.toLowerCase().includes(q) && !body.toLowerCase().includes(q)) return false;
    }
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Emotional') return n.filterTag === 'Emotional Alert';
    if (activeFilter === 'Insights')  return n.filterTag === 'Behavioral Insight';
    if (activeFilter === 'Transact')  return n.filterTag === 'Transaction';
    return true;
  });

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      {/* Nav header */}
      <View style={[styles.navHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{t('notifTitle')}</Text>
        <TouchableOpacity style={styles.markAllBtn}>
          <Text style={styles.markAllText}>{t('notifMarkAllRead')}</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={[styles.searchWrap, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="search-outline" size={15} color="#9ca3af" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, isRTL && { textAlign: 'right' }]}
          value={search}
          onChangeText={setSearch}
          placeholder={t('notifSearchPh')}
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={15} color="#d1d5db" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter pills */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterPill, activeFilter === f.key && styles.filterPillActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterPillText, activeFilter === f.key && styles.filterPillTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Card list */}
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.sectionTitle}>{t('notifRecentActivity')}</Text>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{filtered.length} {t('notifUnread')}</Text>
          </View>
        </View>

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={40} color="#d1d5db" />
            <Text style={styles.emptyText}>{t('notifEmpty')}</Text>
          </View>
        )}

        {filtered.map((n) => {
          const tag     = language === 'ar' ? n.tagAr     : n.tagEn;
          const title   = language === 'ar' ? n.titleAr   : n.titleEn;
          const time    = language === 'ar' ? n.timeAr    : n.timeEn;
          const body    = language === 'ar' ? n.bodyAr    : n.bodyEn;
          const actions = language === 'ar' ? n.actionsAr : n.actionsEn;
          return (
            <View key={n.id} style={styles.card}>
              <View style={[styles.accentBar, { backgroundColor: n.accentColor }]} />
              <View style={styles.cardContent}>
                <View style={[styles.cardTopRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={[styles.tag, { backgroundColor: n.accentColor + '18' }]}>
                    <Text style={[styles.tagText, { color: n.accentColor }]}>{tag}</Text>
                  </View>
                  <View style={[styles.timeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="time-outline" size={10} color="#9ca3af" />
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                </View>
                <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{title}</Text>
                <Text style={[styles.cardBody, isRTL && { textAlign: 'right' }]}>{body}</Text>
                {actions && actions.length > 0 && (
                  <View style={styles.actionsRow}>
                    {actions.map((a, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[styles.actionBtn, i === 0 && { backgroundColor: n.accentColor + '12', borderColor: n.accentColor + '40' }]}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.actionBtnText, i === 0 && { color: n.accentColor, fontFamily: 'Inter_600SemiBold' }]} numberOfLines={1}>
                          {a}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  navHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F5F6FA', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  navTitle: { fontSize: 18, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', flex: 1 },
  markAllBtn: {},
  markAllText: { fontSize: 12, color: '#6C5CE7', fontFamily: 'Inter_600SemiBold' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, backgroundColor: '#F5F6FA', borderRadius: 12, paddingHorizontal: 14, height: 44 },
  searchInput: { flex: 1, fontSize: 13, color: '#111827', fontFamily: 'Inter_400Regular' },
  filterWrap: { height: 52 },
  filterRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center', height: 52 },
  filterPill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, backgroundColor: '#F5F6FA', borderWidth: 1, borderColor: '#e5e7eb' },
  filterPillActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  filterPillText: { fontSize: 12, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  filterPillTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  list: { flex: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, fontFamily: 'Inter_700Bold' },
  unreadBadge: { backgroundColor: '#6C5CE7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  unreadText: { fontSize: 9, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  accentBar: { width: 4 },
  cardContent: { flex: 1, padding: 14 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  tag: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 9, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: 0.3 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 9, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  cardBody: { fontSize: 12, color: '#4b5563', lineHeight: 17, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  actionBtn: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F5F6FA', borderWidth: 1, borderColor: '#e5e7eb' },
  actionBtnText: { fontSize: 11, color: '#374151', fontFamily: 'Inter_500Medium' },
});
