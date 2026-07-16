import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Impact = 'High' | 'Medium' | 'Low';

interface Recommendation {
  id: string;
  category: string;
  title: string;
  desc: string;
  impact: Impact;
  savings: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const RECS: Recommendation[] = [
  {
    id: '1',
    category: 'Working Capital',
    title: 'Move SAR 45,000 to High-Yield Savings',
    desc: 'Your cash flow projections show a surplus next month. Moving this to a 4.8% high-yield account would generate an estimated SAR 2,160 annually.',
    impact: 'High',
    savings: '+SAR 2,160/yr',
    icon: 'trending-up-outline',
    color: '#4f46e5',
  },
  {
    id: '2',
    category: 'Cost Reduction',
    title: 'Negotiate Supplier Terms for Q3',
    desc: 'Analysis shows 3 suppliers account for 67% of your procurement spend. Bulk payment agreements could reduce costs by 8-12%.',
    impact: 'High',
    savings: '-SAR 8,040/mo',
    icon: 'cube-outline',
    color: '#7c3aed',
  },
  {
    id: '3',
    category: 'Cash Flow',
    title: 'Accelerate Client Invoice Collections',
    desc: 'Current average collection time is 42 days. Switching to net-15 terms with early payment discounts could improve cash flow significantly.',
    impact: 'Medium',
    savings: '+SAR 31,000 earlier',
    icon: 'timer-outline',
    color: '#0891b2',
  },
  {
    id: '4',
    category: 'Expense Control',
    title: 'Audit Software Subscriptions',
    desc: 'We detected 7 overlapping SaaS tools with combined spend of SAR 4,200/month. Consolidating to 3 platforms could save SAR 1,800/month.',
    impact: 'Medium',
    savings: '-SAR 1,800/mo',
    icon: 'laptop-outline',
    color: '#059669',
  },
  {
    id: '5',
    category: 'Financing',
    title: 'Pre-Approved Working Capital Loan',
    desc: 'You qualify for a SAR 50,000 loan at 4.5% fixed rate. Deploying this for inventory expansion could generate a projected SAR 18,000 ROI.',
    impact: 'High',
    savings: 'ROI: +SAR 18,000',
    icon: 'business-outline',
    color: '#d97706',
  },
  {
    id: '6',
    category: 'Risk Management',
    title: 'Trade License Renewal Alert',
    desc: 'Your commercial trade license expires in 14 days. Renewing early avoids potential penalties of SAR 3,000+ and business disruption.',
    impact: 'Low',
    savings: 'Avoid SAR 3,000 fine',
    icon: 'shield-outline',
    color: '#dc2626',
  },
];

const IMPACT_COLORS: Record<Impact, { bg: string; text: string }> = {
  High: { bg: '#fef2f2', text: '#dc2626' },
  Medium: { bg: '#fefce8', text: '#ca8a04' },
  Low: { bg: '#f0fdf4', text: '#16a34a' },
};

export default function AIRecommendationsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4f46e5', '#7c3aed']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="sparkles" size={14} color="#e0e7ff" />
            <Text style={styles.headerTitle}>AI Recommendations</Text>
          </View>
          <View style={{ width: 34 }} />
        </View>
        <Text style={styles.headerSub}>
          {RECS.length} personalized insights based on your financial data
        </Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{RECS.filter(r => r.impact === 'High').length}</Text>
            <Text style={styles.headerStatLabel}>High Impact</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{RECS.filter(r => r.impact === 'Medium').length}</Text>
            <Text style={styles.headerStatLabel}>Medium</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{RECS.filter(r => r.impact === 'Low').length}</Text>
            <Text style={styles.headerStatLabel}>Informational</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {RECS.map((rec) => {
          const ic = IMPACT_COLORS[rec.impact];
          return (
            <TouchableOpacity key={rec.id} style={styles.recCard} activeOpacity={0.85}>
              <View style={styles.recTop}>
                <View style={[styles.recIcon, { backgroundColor: rec.color + '18' }]}>
                  <Ionicons name={rec.icon} size={18} color={rec.color} />
                </View>
                <View style={styles.recMeta}>
                  <Text style={styles.recCategory}>{rec.category}</Text>
                  <View style={[styles.impactBadge, { backgroundColor: ic.bg }]}>
                    <Text style={[styles.impactText, { color: ic.text }]}>{rec.impact} Impact</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.recTitle}>{rec.title}</Text>
              <Text style={styles.recDesc}>{rec.desc}</Text>
              <View style={styles.recBottom}>
                <View style={styles.savingsBadge}>
                  <Ionicons name="trending-up-outline" size={12} color="#4f46e5" />
                  <Text style={styles.savingsText}>{rec.savings}</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                  <Text style={styles.actionBtnText}>Take Action</Text>
                </TouchableOpacity>
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
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 12, color: '#c7d2fe', marginBottom: 16, fontFamily: 'Inter_400Regular' },
  headerStats: { flexDirection: 'row', gap: 12 },
  headerStat: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center',
  },
  headerStatVal: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerStatLabel: { fontSize: 10, color: '#c7d2fe', marginTop: 2, fontFamily: 'Inter_400Regular' },

  list: { flex: 1 },
  recCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6',
  },
  recTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  recIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  recMeta: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recCategory: { fontSize: 10, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  impactBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  impactText: { fontSize: 10, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  recDesc: { fontSize: 12, color: '#6b7280', lineHeight: 18, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  recBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savingsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#eef2ff', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 5,
  },
  savingsText: { fontSize: 11, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  actionBtn: {
    backgroundColor: '#4f46e5', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold' },
});
