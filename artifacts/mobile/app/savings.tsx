import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const GOALS = [
  { id: '1', icon: 'shield-checkmark-outline', color: '#4f46e5', labelEn: 'Emergency Fund',  labelAr: 'صندوق الطوارئ', current: 15000, target: 20000, deadline: 'Dec 2026' },
  { id: '2', icon: 'airplane-outline',          color: '#0ea5e9', labelEn: 'Family Vacation', labelAr: 'عطلة عائلية',   current: 7500,  target: 15000, deadline: 'Jun 2027' },
  { id: '3', icon: 'car-outline',               color: '#f59e0b', labelEn: 'New Car',         labelAr: 'سيارة جديدة',   current: 6000,  target: 50000, deadline: 'Jan 2028' },
];

export default function SavingsScreen() {
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
          <Text style={s.headerTitle}>{t('savingsTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* Total */}
        <LinearGradient colors={['#4f46e5', '#7c3aed']} style={s.totalCard}>
          <Text style={[s.totalLabel, isRTL && { textAlign: 'right' }]}>{t('savingsTotal')}</Text>
          <Text style={[s.totalValue, isRTL && { textAlign: 'right' }]}>SAR 28,500.00</Text>
          <View style={[s.totalMeta, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="trending-up" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={s.totalMetaText}>  +SAR 2,000 / {isRTL ? 'شهر · حفظ تلقائي' : 'month · Auto-save active'}</Text>
          </View>
        </LinearGradient>

        {/* Goals */}
        <Text style={[s.sectionTitle, isRTL && { textAlign: 'right', marginRight: 16 }]}>{t('savingsGoals')}</Text>
        {GOALS.map(g => {
          const pct = Math.round((g.current / g.target) * 100);
          return (
            <TouchableOpacity key={g.id} style={s.goalCard} activeOpacity={0.8}>
              <View style={[s.goalTop, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[s.goalIcon, { backgroundColor: `${g.color}1a` }]}>
                  <Ionicons name={g.icon as any} size={20} color={g.color} />
                </View>
                <View style={[s.goalInfo, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={s.goalName}>{language === 'ar' ? g.labelAr : g.labelEn}</Text>
                  <Text style={s.goalSub}>{isRTL ? 'الموعد' : 'Deadline'}: {g.deadline}</Text>
                </View>
                <Text style={[s.goalPct, { color: g.color }]}>{pct}%</Text>
              </View>
              <View style={s.track}>
                <View style={[s.fill, { width: `${pct}%` as any, backgroundColor: g.color }]} />
              </View>
              <View style={[s.amounts, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[s.amtCurrent, { color: g.color }]}>SAR {g.current.toLocaleString()}</Text>
                <Text style={s.amtTarget}>/ SAR {g.target.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={s.addBtn} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#4f46e5" />
          <Text style={s.addBtnText}>{t('savingsAddGoal')}</Text>
        </TouchableOpacity>
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
  totalCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 22 },
  totalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular', marginBottom: 4 },
  totalValue: { fontSize: 32, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 8 },
  totalMeta: { flexDirection: 'row', alignItems: 'center' },
  totalMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 22, marginBottom: 10 },
  goalCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 10, padding: 16, borderWidth: 1, borderColor: '#f3f4f6' },
  goalTop: { flexDirection: 'row', alignItems: 'center' },
  goalIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  goalInfo: { flex: 1 },
  goalName: { fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  goalSub: { fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  goalPct: { fontSize: 18, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  track: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginTop: 10 },
  fill: { height: '100%', borderRadius: 3 },
  amounts: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  amtCurrent: { fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  amtTarget: { fontSize: 11, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginTop: 4, paddingVertical: 14, borderWidth: 1, borderColor: '#e0e7ff' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
});
