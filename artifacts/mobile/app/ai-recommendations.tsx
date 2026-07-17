import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

type Impact = 'High' | 'Medium' | 'Low';

interface Rec {
  id: string;
  categoryEn: string; categoryAr: string;
  titleEn: string; titleAr: string;
  descEn: string; descAr: string;
  impact: Impact;
  savings: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const RECS: Rec[] = [
  {
    id: '1',
    categoryEn: 'Working Capital', categoryAr: 'رأس المال العامل',
    titleEn: 'Move SAR 45,000 to High-Yield Savings', titleAr: 'نقل 45,000 ريال إلى حساب ادخار عالي العائد',
    descEn: 'Your cash flow projections show a surplus next month. Moving this to a 4.8% high-yield account would generate an estimated SAR 2,160 annually.',
    descAr: 'تظهر توقعات التدفق النقدي فائضاً الشهر القادم. نقله إلى حساب بعائد 4.8% سيولّد حوالي 2,160 ريال سنوياً.',
    impact: 'High', savings: '+SAR 2,160/yr', icon: 'trending-up-outline', color: '#4f46e5',
  },
  {
    id: '2',
    categoryEn: 'Cost Reduction', categoryAr: 'تخفيض التكاليف',
    titleEn: 'Negotiate Supplier Terms for Q3', titleAr: 'التفاوض على شروط الموردين للربع الثالث',
    descEn: 'Analysis shows 3 suppliers account for 67% of your procurement spend. Bulk payment agreements could reduce costs by 8-12%.',
    descAr: 'يُظهر التحليل أن 3 موردين يمثلون 67% من إنفاق المشتريات. اتفاقيات الدفع بالجملة قد تخفض التكاليف 8-12%.',
    impact: 'High', savings: '-SAR 8,040/mo', icon: 'cube-outline', color: '#7c3aed',
  },
  {
    id: '3',
    categoryEn: 'Cash Flow', categoryAr: 'التدفق النقدي',
    titleEn: 'Accelerate Client Invoice Collections', titleAr: 'تسريع تحصيل فواتير العملاء',
    descEn: 'Current average collection time is 42 days. Switching to net-15 terms with early payment discounts could improve cash flow significantly.',
    descAr: 'متوسط وقت التحصيل الحالي 42 يوماً. التحويل إلى شروط 15 يوماً مع خصومات الدفع المبكر سيحسن التدفق النقدي.',
    impact: 'Medium', savings: '+SAR 31,000 earlier', icon: 'timer-outline', color: '#0891b2',
  },
  {
    id: '4',
    categoryEn: 'Expense Control', categoryAr: 'التحكم في المصروفات',
    titleEn: 'Audit Software Subscriptions', titleAr: 'مراجعة اشتراكات البرامج',
    descEn: 'We detected 7 overlapping SaaS tools with combined spend of SAR 4,200/month. Consolidating to 3 platforms could save SAR 1,800/month.',
    descAr: 'رصدنا 7 أدوات SaaS متداخلة بإنفاق مشترك 4,200 ريال شهرياً. دمجها في 3 منصات يوفر 1,800 ريال شهرياً.',
    impact: 'Medium', savings: '-SAR 1,800/mo', icon: 'laptop-outline', color: '#059669',
  },
  {
    id: '5',
    categoryEn: 'Financing', categoryAr: 'التمويل',
    titleEn: 'Pre-Approved Working Capital Loan', titleAr: 'قرض رأس مال عامل معتمد مسبقاً',
    descEn: 'You qualify for a SAR 50,000 loan at 4.5% fixed rate. Deploying this for inventory expansion could generate a projected SAR 18,000 ROI.',
    descAr: 'أنت مؤهل للحصول على قرض 50,000 ريال بنسبة 4.5% ثابتة. توظيفه في توسيع المخزون قد يحقق عائداً متوقعاً 18,000 ريال.',
    impact: 'High', savings: 'ROI: +SAR 18,000', icon: 'business-outline', color: '#d97706',
  },
  {
    id: '6',
    categoryEn: 'Risk Management', categoryAr: 'إدارة المخاطر',
    titleEn: 'Trade License Renewal Alert', titleAr: 'تنبيه تجديد الرخصة التجارية',
    descEn: 'Your commercial trade license expires in 14 days. Renewing early avoids potential penalties of SAR 3,000+ and business disruption.',
    descAr: 'رخصتك التجارية تنتهي خلال 14 يوماً. التجديد المبكر يتجنب غرامات محتملة تزيد على 3,000 ريال.',
    impact: 'Low', savings: 'Avoid SAR 3,000 fine', icon: 'shield-outline', color: '#dc2626',
  },
];

export default function AIRecommendationsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const IMPACT_LABELS: Record<Impact, string> = {
    High:   t('aiRecImpactHigh'),
    Medium: t('aiRecImpactMedium'),
    Low:    t('aiRecImpactLow'),
  };
  const IMPACT_COLORS: Record<Impact, { bg: string; text: string }> = {
    High:   { bg: '#fef2f2', text: '#dc2626' },
    Medium: { bg: '#fefce8', text: '#ca8a04' },
    Low:    { bg: '#f0fdf4', text: '#16a34a' },
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4f46e5', '#7c3aed']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.headerCenter, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="sparkles" size={14} color="#e0e7ff" />
            <Text style={styles.headerTitle}>{t('aiRecTitle')}</Text>
          </View>
          <View style={{ width: 34 }} />
        </View>
        <Text style={[styles.headerSub, isRTL && { textAlign: 'right' }]}>
          {RECS.length} {language === 'ar' ? 'توصية مخصصة بناءً على بياناتك المالية' : 'personalized insights based on your financial data'}
        </Text>
        <View style={[styles.headerStats, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{RECS.filter(r => r.impact === 'High').length}</Text>
            <Text style={styles.headerStatLabel}>{t('aiRecHighImpact')}</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{RECS.filter(r => r.impact === 'Medium').length}</Text>
            <Text style={styles.headerStatLabel}>{t('aiRecMedium')}</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{RECS.filter(r => r.impact === 'Low').length}</Text>
            <Text style={styles.headerStatLabel}>{t('aiRecInformational')}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 24 }} showsVerticalScrollIndicator={false}>
        {RECS.map((rec) => {
          const ic = IMPACT_COLORS[rec.impact];
          const category = language === 'ar' ? rec.categoryAr : rec.categoryEn;
          const title    = language === 'ar' ? rec.titleAr    : rec.titleEn;
          const desc     = language === 'ar' ? rec.descAr     : rec.descEn;
          return (
            <TouchableOpacity key={rec.id} style={styles.recCard} activeOpacity={0.85}>
              <View style={[styles.recTop, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.recIcon, { backgroundColor: rec.color + '18' }, isRTL && { marginLeft: 10, marginRight: 0 }]}>
                  <Ionicons name={rec.icon} size={18} color={rec.color} />
                </View>
                <View style={[styles.recMeta, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.recCategory}>{category}</Text>
                  <View style={[styles.impactBadge, { backgroundColor: ic.bg }]}>
                    <Text style={[styles.impactText, { color: ic.text }]}>{IMPACT_LABELS[rec.impact]}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.recTitle, isRTL && { textAlign: 'right' }]}>{title}</Text>
              <Text style={[styles.recDesc, isRTL && { textAlign: 'right' }]}>{desc}</Text>
              <View style={[styles.recBottom, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.savingsBadge}>
                  <Ionicons name="trending-up-outline" size={12} color="#4f46e5" />
                  <Text style={styles.savingsText}>{rec.savings}</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                  <Text style={styles.actionBtnText}>{t('aiRecTakeAction')}</Text>
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
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 12, color: '#c7d2fe', marginBottom: 16, fontFamily: 'Inter_400Regular' },
  headerStats: { flexDirection: 'row', gap: 12 },
  headerStat: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  headerStatVal: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  headerStatLabel: { fontSize: 10, color: '#c7d2fe', marginTop: 2, fontFamily: 'Inter_400Regular' },
  list: { flex: 1 },
  recCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  recTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  recIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  recMeta: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recCategory: { fontSize: 10, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  impactBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  impactText: { fontSize: 10, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  recDesc: { fontSize: 12, color: '#6b7280', lineHeight: 18, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  recBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savingsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#eef2ff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  savingsText: { fontSize: 11, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  actionBtn: { backgroundColor: '#4f46e5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold' },
});
