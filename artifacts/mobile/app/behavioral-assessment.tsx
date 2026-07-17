import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

type Experience = 'Beginner' | 'Intermediate' | 'Advanced';
type Risk = 'Conservative' | 'Moderate' | 'Aggressive';

export default function BehavioralAssessmentScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [savings, setSavings] = useState('');
  const [investment, setInvestment] = useState('');
  const [experience, setExperience] = useState<Experience>('Intermediate');
  const [goal, setGoal] = useState(0); // index into GOALS
  const [risk, setRisk] = useState<Risk>('Moderate');
  const [lossReaction, setLossReaction] = useState(2);
  const [socialMedia, setSocialMedia] = useState(0);
  const [knowledge, setKnowledge] = useState(7);
  const [holdingPeriod, setHoldingPeriod] = useState(2);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const GOALS       = [t('behavGoal1'), t('behavGoal2'), t('behavGoal3'), t('behavGoal4'), t('behavGoal5')];
  const LOSS_OPT    = [t('behavLossR1'), t('behavLossR2'), t('behavLossR3')];
  const SOCIAL_OPT  = [t('behavSocialR1'), t('behavSocialR2'), t('behavSocialR3')];
  const HOLDING_OPT = [t('behavHoldingR1'), t('behavHoldingR2'), t('behavHoldingR3')];
  const EXPERIENCES: { key: Experience; label: string }[] = [
    { key: 'Beginner',     label: t('behavBeginner')     },
    { key: 'Intermediate', label: t('behavIntermediate') },
    { key: 'Advanced',     label: t('behavAdvanced')     },
  ];
  const RISKS: { key: Risk; label: string }[] = [
    { key: 'Conservative', label: t('behavConservative') },
    { key: 'Moderate',     label: t('behavModerate')     },
    { key: 'Aggressive',   label: t('behavAggressive')   },
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#4f46e5']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={styles.resultCircle}>
          <Text style={styles.resultScore}>87</Text>
          <Text style={styles.resultLabel}>/100</Text>
        </View>
        <Text style={styles.resultTitle}>{t('behavResultTitle')}</Text>
        <View style={styles.resultBadge}><Text style={styles.resultBadgeText}>{t('behavResultBadge')}</Text></View>
        <Text style={styles.resultProfile}>{t('behavRiskTolerance')}: {RISKS.find(r => r.key === risk)?.label}</Text>
        <Text style={[styles.resultDesc, isRTL && { textAlign: 'right' }]}>
          {t('behavModrikNoteText')}
        </Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={styles.doneBtnText}>{t('behavResultDone')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerIconWrap}>
          <Ionicons name="sparkles" size={16} color="#4f46e5" />
        </View>
        <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('behavTitle')}</Text>
        <Text style={[styles.headerSub, isRTL && { textAlign: 'right' }]}>{t('behavSub')}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]} showsVerticalScrollIndicator={false}>

        {/* Financial Profile */}
        <Section title={t('behavFinancialProfile')} icon="wallet-outline" isRTL={isRTL}>
          {[
            { label: t('behavMonthlyIncome'),     value: income,     setter: setIncome },
            { label: t('behavMonthlyExpenses'),   value: expenses,   setter: setExpenses },
            { label: t('behavCurrentSavings'),    value: savings,    setter: setSavings },
            { label: t('behavCurrentInvestment'), value: investment, setter: setInvestment },
          ].map((f) => (
            <View key={f.label} style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{f.label}</Text>
              <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
                <TextInput style={[styles.input, isRTL && { textAlign: 'right' }]} value={f.value} onChangeText={f.setter} placeholder="0" placeholderTextColor="#9ca3af" keyboardType="numeric" />
                <Text style={styles.currency}>SAR</Text>
              </View>
            </View>
          ))}
        </Section>

        {/* Investment Experience */}
        <Section title={t('behavInvExp')} icon="school-outline" isRTL={isRTL}>
          <View style={[styles.toggleRow, isRTL && { flexDirection: 'row-reverse' }]}>
            {EXPERIENCES.map((e) => (
              <TouchableOpacity key={e.key} style={[styles.toggleBtn, experience === e.key && styles.toggleBtnActive]} onPress={() => setExperience(e.key)} activeOpacity={0.8}>
                <Text style={[styles.toggleText, experience === e.key && styles.toggleTextActive]}>{e.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* Investment Goal */}
        <Section title={t('behavInvGoal')} icon="flag-outline" isRTL={isRTL}>
          {GOALS.map((g, i) => (
            <TouchableOpacity key={g} style={[styles.radioRow, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => setGoal(i)} activeOpacity={0.7}>
              <View style={[styles.radioOuter, goal === i && styles.radioOuterActive, isRTL && { marginLeft: 10, marginRight: 0 }]}>
                {goal === i && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, goal === i && styles.radioLabelActive]}>{g}</Text>
              {goal === i && <Ionicons name="checkmark-circle" size={16} color="#4f46e5" />}
            </TouchableOpacity>
          ))}
        </Section>

        {/* Risk Tolerance */}
        <Section title={t('behavRiskTolerance')} icon="trending-up-outline" isRTL={isRTL}>
          <View style={[styles.riskRow, isRTL && { flexDirection: 'row-reverse' }]}>
            {RISKS.map((r) => (
              <TouchableOpacity key={r.key} style={[styles.riskBtn, risk === r.key && styles.riskBtnActive]} onPress={() => setRisk(r.key)} activeOpacity={0.8}>
                <Text style={[styles.riskText, risk === r.key && styles.riskTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: risk === 'Conservative' ? '15%' : risk === 'Moderate' ? '50%' : '85%' }]} />
            <View style={[styles.sliderThumb, { left: risk === 'Conservative' ? '10%' : risk === 'Moderate' ? '47%' : '82%' }]} />
          </View>
          <View style={[styles.sliderLabels, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.sliderLabel}>{t('behavConservative').toUpperCase()}</Text>
            <Text style={styles.sliderLabel}>{t('behavAggressive').toUpperCase()}</Text>
          </View>
        </Section>

        {/* Psychological Profile */}
        <Section title={t('behavPsychProfile')} icon="analytics-outline" isRTL={isRTL}>
          <Question label={t('behavLossQ')} options={LOSS_OPT} selected={lossReaction} onSelect={setLossReaction} isRTL={isRTL} />
          <Question label={t('behavSocialQ')} options={SOCIAL_OPT} selected={socialMedia} onSelect={setSocialMedia} isRTL={isRTL} />

          <Text style={[styles.qLabel, isRTL && { textAlign: 'right' }]}>{t('behavKnowledgeQ')}</Text>
          <View style={[styles.knowledgeRow, isRTL && { flexDirection: 'row-reverse' }]}>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <TouchableOpacity key={n} style={[styles.numBtn, knowledge === n && styles.numBtnActive]} onPress={() => setKnowledge(n)} activeOpacity={0.7}>
                <Text style={[styles.numText, knowledge === n && styles.numTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.knowledgeRange}>
            <Text style={[styles.rangeLabel, isRTL && { textAlign: 'right' }]}>{t('behavKnowledgeRange')}</Text>
          </View>

          <Question label={t('behavHoldingQ')} options={HOLDING_OPT} selected={holdingPeriod} onSelect={setHoldingPeriod} isRTL={isRTL} />
        </Section>

        {/* Modrik note */}
        <View style={[styles.modrikNote, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.modrikIconWrap}>
            <Ionicons name="sparkles" size={16} color="#4f46e5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.modrikNoteTitle, isRTL && { textAlign: 'right' }]}>{t('behavModrikNoteTitle')}</Text>
            <Text style={[styles.modrikNoteText, isRTL && { textAlign: 'right' }]}>{t('behavModrikNoteText')}</Text>
          </View>
        </View>

        {/* Analyze button */}
        <TouchableOpacity style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]} onPress={handleAnalyze} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <><ActivityIndicator color="#fff" size="small" /><Text style={styles.analyzeBtnText}>  {t('behavAnalyzing')}</Text></>
          ) : (
            <Text style={styles.analyzeBtnText}>{t('behavAnalyze')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Section({ title, icon, children, isRTL }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode; isRTL: boolean }) {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name={icon} size={15} color="#4f46e5" />
        <Text style={[styles.sectionTitle, isRTL && { marginRight: 8, marginLeft: 0 }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Question({ label, options, selected, onSelect, isRTL }: { label: string; options: string[]; selected: number; onSelect: (i: number) => void; isRTL: boolean }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.qLabel, isRTL && { textAlign: 'right' }]}>{label}</Text>
      {options.map((o, i) => (
        <TouchableOpacity key={i} style={[styles.optionRow, selected === i && styles.optionRowActive, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => onSelect(i)} activeOpacity={0.7}>
          <Text style={[styles.optionText, selected === i && styles.optionTextActive]}>{o}</Text>
          {selected === i && <Ionicons name="checkmark" size={14} color="#4f46e5" />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  headerIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  headerSub: { fontSize: 12, color: '#94a3b8', lineHeight: 17, fontFamily: 'Inter_400Regular' },
  content: { padding: 16 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#f3f4f6' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginLeft: 8, fontFamily: 'Inter_700Bold' },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { fontSize: 10, color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6, fontFamily: 'Inter_400Regular' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, height: 44 },
  input: { flex: 1, fontSize: 14, color: '#111827', fontFamily: 'Inter_400Regular' },
  currency: { fontSize: 12, color: '#9ca3af', fontFamily: 'Inter_500Medium' },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  toggleBtnActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  toggleText: { fontSize: 12, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  toggleTextActive: { color: '#fff', fontWeight: '700' },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#d1d5db', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: '#4f46e5' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4f46e5' },
  radioLabel: { flex: 1, fontSize: 13, color: '#374151', fontFamily: 'Inter_400Regular' },
  radioLabelActive: { color: '#111827', fontWeight: '600' },
  riskRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  riskBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  riskBtnActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  riskText: { fontSize: 11, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  riskTextActive: { color: '#fff', fontWeight: '700' },
  sliderTrack: { height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, position: 'relative', marginBottom: 8 },
  sliderFill: { height: 6, backgroundColor: '#4f46e5', borderRadius: 3 },
  sliderThumb: { position: 'absolute', top: -5, width: 16, height: 16, borderRadius: 8, backgroundColor: '#4f46e5', borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: { fontSize: 9, color: '#9ca3af', letterSpacing: 0.3, fontFamily: 'Inter_400Regular' },
  qLabel: { fontSize: 12, color: '#374151', fontFamily: 'Inter_500Medium', marginBottom: 10, lineHeight: 17 },
  optionRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 7, backgroundColor: '#f9fafb' },
  optionRowActive: { backgroundColor: '#eef2ff', borderColor: '#4f46e5' },
  optionText: { flex: 1, fontSize: 12, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  optionTextActive: { color: '#4f46e5', fontWeight: '600' },
  knowledgeRow: { flexDirection: 'row', gap: 4, marginBottom: 4, flexWrap: 'wrap' },
  numBtn: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  numBtnActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  numText: { fontSize: 12, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  numTextActive: { color: '#fff', fontWeight: '700' },
  knowledgeRange: { marginBottom: 14 },
  rangeLabel: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  modrikNote: { flexDirection: 'row', gap: 12, backgroundColor: '#eef2ff', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#c7d2fe' },
  modrikIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  modrikNoteTitle: { fontSize: 13, fontWeight: '700', color: '#1e40af', fontFamily: 'Inter_700Bold', marginBottom: 4 },
  modrikNoteText: { fontSize: 11, color: '#3730a3', lineHeight: 15, fontFamily: 'Inter_400Regular' },
  analyzeBtn: { backgroundColor: '#1e2d6e', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  analyzeBtnDisabled: { opacity: 0.7 },
  analyzeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  resultCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: '#818cf8', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  resultScore: { fontSize: 40, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  resultLabel: { fontSize: 14, color: '#c7d2fe', fontFamily: 'Inter_400Regular' },
  resultTitle: { fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 8 },
  resultBadge: { backgroundColor: '#4f46e5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 12 },
  resultBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  resultProfile: { fontSize: 14, color: '#c7d2fe', marginBottom: 16, fontFamily: 'Inter_400Regular' },
  resultDesc: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 19, fontFamily: 'Inter_400Regular', marginBottom: 32 },
  doneBtn: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center' },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: '#1e2d6e', fontFamily: 'Inter_700Bold' },
});
