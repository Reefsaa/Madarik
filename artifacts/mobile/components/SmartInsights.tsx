import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const R = 36;
const CIRC = 2 * Math.PI * R;

const BUY_SELL = [12, 7, 15, 9, 18, 5, 11, 3, 8, 14, 6, 10];

function ProgressBar({ label, pct, color = '#4f46e5' }: { label: string; pct: number; color?: string }) {
  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: color }]} />
        </View>
        <Text style={styles.progressPct}>{pct}%</Text>
      </View>
    </View>
  );
}

export default function SmartInsights() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const EMOTION_PILLS = [
    { label: t('insightsRationalDec'), active: true },
    { label: t('insightsPanicSell'),   active: false },
    { label: t('insightsFOMO'),        active: false },
    { label: t('insightsOverconf'),    active: false },
  ];

  const SPENDING = [
    { label: t('insightsFood'),     amount: '890 ﷼',   color: '#4f46e5' },
    { label: t('insightsShopping'), amount: '430 ﷼',   color: '#818cf8' },
    { label: t('insightsBills'),    amount: '1,200 ﷼', color: '#c7d2fe' },
  ];

  const GOALS = [
    { label: t('insightsEmergencyFund'),    pct: 85, color: '#22c55e' },
    { label: t('insightsInvestGoal'),       pct: 42, color: '#f59e0b' },
    { label: t('insightsSavingsGoalLabel'), pct: 68, color: '#4f46e5' },
  ];
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NQ';
  const score = 87;
  const scoreArc = CIRC * (score / 100);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('insightsTitle')}</Text>
          <View style={styles.avatarSmall}><Text style={styles.avatarText}>{initials}</Text></View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* AI Behavior Score */}
        <View style={styles.card}>
          <View style={styles.scoreHeader}>
            <Text style={styles.cardTitle}>{t('insightsBehaviorScore')}</Text>
            <Text style={styles.scoreSubtitle}>{t('insightsMonthlyAssess')}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{t('insightsLevelExcellent')}</Text>
          </View>
          <View style={styles.scoreRow}>
            <View style={styles.ringWrap}>
              <Svg width={88} height={88}>
                <Circle cx={44} cy={44} r={R} stroke="#f3f4f6" strokeWidth={8} fill="none" />
                <Circle cx={44} cy={44} r={R} stroke="#4f46e5" strokeWidth={8} fill="none"
                  strokeDasharray={`${scoreArc} ${CIRC}`} strokeLinecap="round"
                  rotation="-90" origin="44, 44" />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={styles.ringScore}>{score}</Text>
                <Text style={styles.ringMax}>/100</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scoreQuote}>{t('insightsScoreQuote')}</Text>
            </View>
          </View>
          <ProgressBar label={t('insightsStability')} pct={92} color="#4f46e5" />
          <ProgressBar label={t('insightsDiscipline')} pct={84} color="#818cf8" />
        </View>

        {/* Risk Profile */}
        <View style={styles.card}>
          <View style={styles.riskRow}>
            <View>
              <Text style={styles.cardTitle}>{t('insightsRiskProfile')}</Text>
              <Text style={styles.riskLevel}>{t('insightsModerate')}</Text>
            </View>
            <View style={styles.riskRight}>
              <View style={styles.riskBadge}><Text style={styles.riskBadgeText}>{t('insightsMediumRisk')}</Text></View>
              <Text style={styles.confLabel}>{t('insightsConfidence')}</Text>
              <Text style={styles.confValue}>94%</Text>
            </View>
          </View>
        </View>

        {/* Emotion Detection */}
        <View style={styles.card}>
          <View style={styles.emotionHeader}>
            <Ionicons name="radio-button-on-outline" size={16} color="#4f46e5" />
            <Text style={[styles.cardTitle, { marginLeft: 6 }]}>{t('insightsEmotionDetect')}</Text>
          </View>
          <View style={styles.pillGrid}>
            {EMOTION_PILLS.map((p) => (
              <View key={p.label} style={[styles.pill, p.active && styles.pillActive]}>
                <Text style={[styles.pillText, p.active && styles.pillTextActive]}>{p.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.aiInsightBox}>
            <Text style={styles.aiInsightLabel}>{t('insightsAiInsightLabel')}</Text>
            <Text style={styles.aiInsightText}>{t('insightsAiInsightText')}</Text>
          </View>
        </View>

        {/* Spending Analysis */}
        <View style={styles.card}>
          <View style={styles.spendingHeader}>
            <Ionicons name="pie-chart-outline" size={15} color="#4f46e5" />
            <Text style={[styles.cardTitle, { marginLeft: 6 }]}>{t('insightsSpendAnalysis')}</Text>
            <Text style={styles.monthlyTag}>{t('insightsMonthlyTag')}</Text>
          </View>
          <View style={styles.spendingRow}>
            <View style={styles.donut}>
              <View style={styles.donutInner}>
                <Text style={styles.donutLabel}>{t('insightsSavingsRate')}</Text>
                <Text style={styles.donutValue}>32.4%</Text>
              </View>
            </View>
            <View style={styles.spendingRight}>
              <Text style={styles.spendingTotal}>{t('insightsTotalExp')}</Text>
              <Text style={styles.spendingTotalVal}>3,030 ﷼</Text>
              {SPENDING.map((s) => (
                <View key={s.label} style={styles.spendingItem}>
                  <View style={[styles.spendingDot, { backgroundColor: s.color }]} />
                  <Text style={styles.spendingLabel}>{s.label}</Text>
                  <Text style={styles.spendingAmount}>{s.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Investment Activity */}
        <View style={styles.card}>
          <View style={styles.investHeader}>
            <Ionicons name="stats-chart-outline" size={15} color="#4f46e5" />
            <Text style={[styles.cardTitle, { marginLeft: 6 }]}>{t('insightsInvestActivity')}</Text>
          </View>
          <View style={styles.investRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.investLabel}>{t('insightsBuySell')}</Text>
              <View style={styles.miniChart}>
                {BUY_SELL.map((v, i) => (
                  <View key={i} style={[styles.miniBar, { height: v * 3, backgroundColor: i % 3 === 2 ? '#fca5a5' : '#4f46e5' }]} />
                ))}
              </View>
              <View style={styles.buySellLegend}>
                <Text style={styles.buyCount}>{t('insightsBuyCount')}</Text>
                <Text style={styles.sellCount}>{t('insightsSellCount')}</Text>
              </View>
            </View>
            <View style={styles.horizonCol}>
              <Text style={styles.investLabel}>{t('insightsHorizon')}</Text>
              <View style={styles.horizonRow}>
                <Text style={styles.horizonLabel}>{t('insightsLong')}</Text>
                <View style={[styles.horizonBar, { width: 60, backgroundColor: '#4f46e5' }]} />
              </View>
              <View style={styles.horizonRow}>
                <Text style={styles.horizonLabel}>{t('insightsShort')}</Text>
                <View style={[styles.horizonBar, { width: 30, backgroundColor: '#c7d2fe' }]} />
              </View>
            </View>
          </View>
          <View style={styles.portfolioRow}>
            <Text style={styles.investLabel}>{t('insightsPortfolioGrowth')}</Text>
            <Text style={styles.growthVal}>+12.5%</Text>
          </View>
          <Text style={styles.portfolioAmt}>10,900 ﷼</Text>
        </View>

        {/* Recommendations */}
        <View style={styles.card}>
          <View style={styles.recHeader}>
            <View style={styles.recHeaderLeft}>
              <Ionicons name="sparkles-outline" size={15} color="#4f46e5" />
              <Text style={[styles.cardTitle, { marginLeft: 6 }]}>{t('insightsRecommendations')}</Text>
            </View>
            <TouchableOpacity style={styles.smartPlanBtn} onPress={() => router.push('/(tabs)/ai')}>
              <Text style={styles.smartPlanText}>{t('insightsSmartPlan')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.allocLabel}>{t('insightsSuggestedAlloc')}</Text>
          <View style={styles.allocRow}>
            {[{ label: '60% ETFs', color: '#1e40af' }, { label: '25% Stocks', color: '#4f46e5' }, { label: '15% Cash', color: '#c7d2fe' }].map((a) => (
              <View key={a.label} style={[styles.allocBadge, { backgroundColor: a.color }]}>
                <Text style={styles.allocText}>{a.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.allocMeta}>
            <View>
              <Text style={styles.allocMetaLabel}>{t('insightsMonthlyTarget')}</Text>
              <Text style={styles.allocMetaVal}>1,200 ﷼</Text>
            </View>
            <View style={styles.riskAdjust}>
              <Text style={styles.allocMetaLabel}>{t('insightsRiskAdjust')}</Text>
              <Text style={[styles.allocMetaVal, { color: '#ef4444' }]}>-5%</Text>
            </View>
          </View>
        </View>

        {/* Financial Goals */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="flag-outline" size={15} color="#4f46e5" />
            <Text style={[styles.cardTitle, { marginLeft: 6 }]}>{t('insightsFinGoals')}</Text>
          </View>
          <View style={styles.goalsRow}>
            {GOALS.map((g) => (
              <View key={g.label} style={styles.goalCol}>
                <View style={styles.goalBarBg}>
                  <View style={[styles.goalBarFill, { height: `${g.pct}%` as any, backgroundColor: g.color }]} />
                </View>
                <Text style={styles.goalPct}>{g.pct}%</Text>
                <Text style={styles.goalLabel}>{g.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.assessBtn} onPress={() => router.push('/behavioral-assessment')} activeOpacity={0.85}>
          <Ionicons name="analytics-outline" size={16} color="#fff" />
          <Text style={styles.assessBtnText}>{t('insightsUpdateAssess')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  avatarSmall: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  content: { padding: 16 },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#f3f4f6' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },

  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  scoreSubtitle: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  levelBadge: { alignSelf: 'flex-end', backgroundColor: '#4f46e5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14 },
  levelText: { fontSize: 11, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  ringWrap: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  ringScore: { fontSize: 20, fontWeight: '800', color: '#111827', fontFamily: 'Inter_700Bold' },
  ringMax: { fontSize: 9, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  scoreQuote: { fontSize: 11, color: '#6b7280', lineHeight: 16, fontFamily: 'Inter_400Regular', fontStyle: 'italic' },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  progressLabel: { fontSize: 9, color: '#9ca3af', letterSpacing: 0.5, width: 80, fontFamily: 'Inter_400Regular' },
  progressBg: { flex: 1, height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, marginRight: 8 },
  progressFill: { height: 6, borderRadius: 3 },
  progressPct: { fontSize: 11, fontWeight: '600', color: '#111827', width: 36, textAlign: 'right', fontFamily: 'Inter_600SemiBold' },

  riskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  riskLevel: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 4, fontFamily: 'Inter_700Bold' },
  riskRight: { alignItems: 'flex-end' },
  riskBadge: { backgroundColor: '#fef9c3', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 6 },
  riskBadgeText: { fontSize: 11, fontWeight: '700', color: '#ca8a04', fontFamily: 'Inter_700Bold' },
  confLabel: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  confValue: { fontSize: 18, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },

  emotionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  pill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  pillActive: { backgroundColor: '#1e2d6e', borderColor: '#1e2d6e' },
  pillText: { fontSize: 11, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  pillTextActive: { color: '#fff' },
  aiInsightBox: { backgroundColor: '#fef9c3', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#fef08a' },
  aiInsightLabel: { fontSize: 10, fontWeight: '700', color: '#ca8a04', fontFamily: 'Inter_700Bold', marginBottom: 3 },
  aiInsightText: { fontSize: 11, color: '#78350f', lineHeight: 15, fontFamily: 'Inter_400Regular' },

  spendingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  monthlyTag: { marginLeft: 'auto', fontSize: 9, color: '#9ca3af', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  spendingRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  donut: { width: 80, height: 80, borderRadius: 40, borderWidth: 14, borderColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  donutInner: { alignItems: 'center' },
  donutLabel: { fontSize: 7, color: '#9ca3af', textAlign: 'center', fontFamily: 'Inter_400Regular' },
  donutValue: { fontSize: 11, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  spendingRight: { flex: 1 },
  spendingTotal: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  spendingTotalVal: { fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 8 },
  spendingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  spendingDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  spendingLabel: { fontSize: 10, color: '#6b7280', flex: 1, fontFamily: 'Inter_400Regular' },
  spendingAmount: { fontSize: 10, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },

  investHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  investRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  investLabel: { fontSize: 9, color: '#9ca3af', letterSpacing: 0.5, fontFamily: 'Inter_400Regular', marginBottom: 8 },
  miniChart: { flexDirection: 'row', alignItems: 'flex-end', height: 40, gap: 2 },
  miniBar: { width: 6, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  buySellLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  buyCount: { fontSize: 9, color: '#4f46e5', fontFamily: 'Inter_500Medium' },
  sellCount: { fontSize: 9, color: '#ef4444', fontFamily: 'Inter_500Medium' },
  horizonCol: { flex: 1 },
  horizonRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  horizonLabel: { fontSize: 10, color: '#6b7280', width: 32, fontFamily: 'Inter_400Regular' },
  horizonBar: { height: 6, borderRadius: 3 },
  portfolioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  growthVal: { fontSize: 13, fontWeight: '700', color: '#22c55e', fontFamily: 'Inter_700Bold' },
  portfolioAmt: { fontSize: 18, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginTop: 4 },

  recHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  smartPlanBtn: { backgroundColor: '#eef2ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  smartPlanText: { fontSize: 11, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  allocLabel: { fontSize: 9, color: '#9ca3af', letterSpacing: 0.5, fontFamily: 'Inter_400Regular', marginBottom: 8 },
  allocRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  allocBadge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  allocText: { fontSize: 11, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  allocMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  allocMetaLabel: { fontSize: 9, color: '#9ca3af', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  allocMetaVal: { fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginTop: 2 },
  riskAdjust: { alignItems: 'flex-end' },

  goalsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  goalCol: { alignItems: 'center', width: 70 },
  goalBarBg: { width: 24, height: 100, backgroundColor: '#f3f4f6', borderRadius: 12, justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 6 },
  goalBarFill: { width: '100%', borderRadius: 12 },
  goalPct: { fontSize: 12, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  goalLabel: { fontSize: 9, color: '#9ca3af', textAlign: 'center', marginTop: 3, fontFamily: 'Inter_400Regular' },

  assessBtn: { backgroundColor: '#4f46e5', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  assessBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
