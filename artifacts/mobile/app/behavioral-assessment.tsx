import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Experience = 'Beginner' | 'Intermediate' | 'Advanced';
type Risk = 'Conservative' | 'Moderate' | 'Aggressive';

const GOALS = ['Wealth Growth', 'Retirement', 'Emergency Fund', 'Passive Income', 'Education'];
const LOSS_REACTIONS = ['Sell everything immediately', 'Wait and monitor carefully', 'Buy more at a lower price'];
const SOCIAL_MEDIA = ['Never, I do my own research', 'Sometimes for small amounts', 'Frequently to catch trends'];
const HOLDING_PERIODS = ['Less than 6 months', '6 – 12 months', 'More than 1 year'];

export default function BehavioralAssessmentScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [savings, setSavings] = useState('');
  const [investment, setInvestment] = useState('');
  const [experience, setExperience] = useState<Experience>('Intermediate');
  const [goal, setGoal] = useState('Wealth Growth');
  const [risk, setRisk] = useState<Risk>('Moderate');
  const [lossReaction, setLossReaction] = useState('Buy more at a lower price');
  const [socialMedia, setSocialMedia] = useState('Never, I do my own research');
  const [knowledge, setKnowledge] = useState(7);
  const [holdingPeriod, setHoldingPeriod] = useState('More than 1 year');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
        <Text style={styles.resultTitle}>Behavioral Score</Text>
        <View style={styles.resultBadge}><Text style={styles.resultBadgeText}>Level: Excellent</Text></View>
        <Text style={styles.resultProfile}>Risk Profile: {risk}</Text>
        <Text style={styles.resultDesc}>
          Your investment decisions are consistent and emotionally balanced. Modrik recommends maintaining your {goal.toLowerCase()} strategy with {risk.toLowerCase()} risk exposure.
        </Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={styles.doneBtnText}>View Smart Insights</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerIconWrap}>
          <Ionicons name="sparkles" size={16} color="#4f46e5" />
        </View>
        <Text style={styles.headerTitle}>Behavior Assessment</Text>
        <Text style={styles.headerSub}>
          Answer a few questions so Modrik can understand your financial behavior and provide personalized investment recommendations.
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]} showsVerticalScrollIndicator={false}>

        {/* Financial Profile */}
        <Section title="Financial Profile" icon="wallet-outline">
          {[
            { label: 'MONTHLY INCOME', value: income, setter: setIncome, placeholder: 'e.g. 15,000' },
            { label: 'MONTHLY EXPENSES', value: expenses, setter: setExpenses, placeholder: 'e.g. 8,000' },
            { label: 'CURRENT SAVINGS', value: savings, setter: setSavings, placeholder: 'e.g. 50,000' },
            { label: 'CURRENT INVESTMENT', value: investment, setter: setInvestment, placeholder: 'e.g. 20,000' },
          ].map((f) => (
            <View key={f.label} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
                <Text style={styles.currency}>SAR</Text>
              </View>
            </View>
          ))}
        </Section>

        {/* Investment Experience */}
        <Section title="Investment Experience" icon="school-outline">
          <View style={styles.toggleRow}>
            {(['Beginner', 'Intermediate', 'Advanced'] as Experience[]).map((e) => (
              <TouchableOpacity
                key={e}
                style={[styles.toggleBtn, experience === e && styles.toggleBtnActive]}
                onPress={() => setExperience(e)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, experience === e && styles.toggleTextActive]}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* Investment Goal */}
        <Section title="Investment Goal" icon="flag-outline">
          {GOALS.map((g) => (
            <TouchableOpacity key={g} style={styles.radioRow} onPress={() => setGoal(g)} activeOpacity={0.7}>
              <View style={[styles.radioOuter, goal === g && styles.radioOuterActive]}>
                {goal === g && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, goal === g && styles.radioLabelActive]}>{g}</Text>
              {goal === g && <Ionicons name="checkmark-circle" size={16} color="#4f46e5" />}
            </TouchableOpacity>
          ))}
        </Section>

        {/* Risk Tolerance */}
        <Section title="Risk Tolerance" icon="trending-up-outline">
          <View style={styles.riskRow}>
            {(['Conservative', 'Moderate', 'Aggressive'] as Risk[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.riskBtn, risk === r && styles.riskBtnActive]}
                onPress={() => setRisk(r)}
                activeOpacity={0.8}
              >
                <Text style={[styles.riskText, risk === r && styles.riskTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, {
              width: risk === 'Conservative' ? '15%' : risk === 'Moderate' ? '50%' : '85%',
            }]} />
            <View style={[styles.sliderThumb, {
              left: risk === 'Conservative' ? '10%' : risk === 'Moderate' ? '47%' : '82%',
            }]} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>CONSERVATIVE</Text>
            <Text style={styles.sliderLabel}>AGGRESSIVE</Text>
          </View>
        </Section>

        {/* Psychological Profile */}
        <Section title="Psychological Profile" icon="brain-outline">
          <Question label="If your portfolio lost 20% in a month, how would you react?" options={LOSS_REACTIONS} selected={lossReaction} onSelect={setLossReaction} />
          <Question label="Do you make investment decisions based on social media trends?" options={SOCIAL_MEDIA} selected={socialMedia} onSelect={setSocialMedia} />

          <Text style={styles.qLabel}>Rate your confidence in financial market knowledge (1-10)</Text>
          <View style={styles.knowledgeRow}>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.numBtn, knowledge === n && styles.numBtnActive]}
                onPress={() => setKnowledge(n)}
                activeOpacity={0.7}
              >
                <Text style={[styles.numText, knowledge === n && styles.numTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.knowledgeRange}>
            <Text style={styles.rangeLabel}>1 = Novice, 10 = Expert</Text>
          </View>

          <Question label="What is your typical investment holding period?" options={HOLDING_PERIODS} selected={holdingPeriod} onSelect={setHoldingPeriod} />
        </Section>

        {/* Modrik Engine note */}
        <View style={styles.modrikNote}>
          <View style={styles.modrikIconWrap}>
            <Ionicons name="sparkles" size={16} color="#4f46e5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modrikNoteTitle}>Modrik Engine</Text>
            <Text style={styles.modrikNoteText}>
              The Modrik neural engine analyzes your risk appetite and behavioral biases to construct a mathematically optimized portfolio tailored specifically to your psychological profile.
            </Text>
          </View>
        </View>

        {/* Analyze button */}
        <TouchableOpacity
          style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]}
          onPress={handleAnalyze}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <><ActivityIndicator color="#fff" size="small" /><Text style={styles.analyzeBtnText}>  Analyzing...</Text></>
          ) : (
            <Text style={styles.analyzeBtnText}>Analyze My Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Section({ title, icon, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={15} color="#4f46e5" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Question({ label, options, selected, onSelect }: { label: string; options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.qLabel}>{label}</Text>
      {options.map((o) => (
        <TouchableOpacity
          key={o}
          style={[styles.optionRow, selected === o && styles.optionRowActive]}
          onPress={() => onSelect(o)}
          activeOpacity={0.7}
        >
          <Text style={[styles.optionText, selected === o && styles.optionTextActive]}>{o}</Text>
          {selected === o && <Ionicons name="checkmark" size={14} color="#4f46e5" />}
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

  // Result screen
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
