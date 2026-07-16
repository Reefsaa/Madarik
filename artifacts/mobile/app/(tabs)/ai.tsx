import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppMode } from '@/context/AppModeContext';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Local knowledge base ────────────────────────────────────────────────────
function getLocalResponse(text: string, mode: string, userName: string): string {
  const q = text.toLowerCase();

  if (mode === 'personal') {
    if (q.includes('score') || q.includes('behavioral') || q.includes('assessment'))
      return `${userName}, your Behavioral Score is 87/100 — that's in the top 18% of Madarik users. Key strengths: strong discipline (92/100) and stability (85/100). Your main growth area is patience during volatility. Would you like to take the full Monthly Behavioral Assessment?`;
    if (q.includes('invest') || q.includes('portfolio'))
      return 'Based on your Moderate risk profile, your current allocation is well-balanced: 60% ETFs, 25% fixed income, 15% cash. I recommend a gradual +5% shift toward emerging markets as your Discipline Score supports higher-volatility instruments. Expected return: +9.2% annually.';
    if (q.includes('emotion') || q.includes('fomo') || q.includes('fear') || q.includes('panic'))
      return 'I\'ve detected elevated emotion signals in your recent activity patterns — possible FOMO tendencies. Historical data shows your best returns came from holding during volatility. Your Emotional Stability is 88% — strong. Take a moment before any reactive trade. Your plan is working.';
    if (q.includes('spending') || q.includes('expense'))
      return 'Spending Analysis: SAR 8,430 this month. Top categories: Dining (SAR 2,100 · 25%), Shopping (SAR 1,850 · 22%), Transport (SAR 980 · 12%). You are 8% over your self-set dining budget. Want me to suggest an adjustment plan?';
    if (q.includes('goal') || q.includes('saving'))
      return 'You have 2 active goals: Emergency Fund (SAR 23,000 / 30,000 — 77% complete, on track for September) and Hajj Travel (SAR 8,500 / 15,000 — 57%, projected December). Your savings rate of 32.4% is excellent — above the recommended 20%.';
    if (q.includes('card') || q.includes('credit'))
      return 'You have 2 active cards: Card ending 3456 — Balance SAR 8,500 (limit SAR 20,000, 43% utilized, good standing). Card ending 4xxx — Balance SAR 150 (near limit). I recommend paying off Card 4xxx this month to improve your credit utilization ratio.';
    if (q.includes('risk') || q.includes('profile'))
      return 'Your Risk Profile: Moderate. You show a balanced approach with an 84% confidence score. Based on 6 months of behavioral data, you handle market dips well but occasionally over-react to positive news. Recommended: maintain current strategy, set price alerts rather than watching charts daily.';
    return `${userName}, your financial health is excellent (87/100). Savings rate: 32.4% ✓. Portfolio growth: +3.2% this quarter. Behavioral Score: 87. I can analyze your investments, spending patterns, behavioral triggers, or savings goals. What would you like to explore?`;
  }

  // Business mode
  if (q.includes('cash flow') || q.includes('cashflow') || q.includes('liquidity'))
    return 'Cash flow is strong: SAR 370K inflow vs SAR 280K outflow this month. Net: +SAR 90K. 30-day forecast projects +SAR 120K surplus. Recommendation: move SAR 45K to a high-yield business account. Your cash runway is 4.2 months — healthy. Want a detailed monthly breakdown?';
  if (q.includes('expense') || q.includes('cost') || q.includes('spending'))
    return 'Operational expenses: SAR 280K this month (+3.2% vs last). Top categories: Payroll 30% (SAR 85K), Supplier Costs 22%, Rent & Utilities 12%, Marketing 8%. Optimization opportunity: bulk supplier deal could save SAR 8K/month. Software consolidation: SAR 1,800/month. Total potential savings: SAR 12K/month.';
  if (q.includes('loan') || q.includes('financ') || q.includes('credit'))
    return 'You are pre-approved for up to SAR 500,000 in business financing. Business Health Score: 89/100 qualifies you for the premium rate of 4.5% fixed. SAR 200K loan → SAR 17,417/month over 12 months. SAR 500K loan → SAR 43,542/month over 12 months. Shall I prepare the application?';
  if (q.includes('revenue') || q.includes('income') || q.includes('sales'))
    return 'Revenue this month: SAR 310K (+12% YoY, +4.8% MoM). Top revenue source: Client Projects (68%). Recurring subscriptions: SAR 42K/month. Q3 forecast: SAR 340K based on pipeline. 3 pending client invoices totaling SAR 87K due this week.';
  if (q.includes('payroll') || q.includes('salary') || q.includes('employee'))
    return 'Payroll this month: SAR 85,000 for 14 employees. Next payroll due: in 5 days. GOSI contributions: SAR 8,500 (10%). End-of-service provisions: on track. Tip: payroll automation through the Madarik payroll module can reduce processing time by 80%.';
  if (q.includes('vat') || q.includes('tax') || q.includes('zakat'))
    return 'VAT Q2 filing: SAR 22,500 due in 8 days. Estimated annual Zakat: SAR 14,200 (based on current net worth). I recommend setting aside SAR 1,850/month for quarterly VAT to avoid cash flow disruption. Want me to generate the VAT summary report?';
  if (q.includes('health') || q.includes('score'))
    return 'Business Health Score: 89/100 — Excellent. Breakdown: Liquidity 92/100 ✓, Profitability 87/100 ✓, Debt Coverage 91/100 ✓, Growth Trend 84/100 ✓. Your score places you in the top 15% of Madarik Business clients. Main opportunity: optimizing payment collection cycle (currently 28 days avg).';
  if (q.includes('forecast') || q.includes('predict') || q.includes('future'))
    return 'Q3 Forecast: Revenue SAR 340K (+9.7%), Expenses SAR 295K (+5.4%), Net Profit SAR 45K. Full-year projection: Revenue SAR 1.28M, EBITDA margin 24%. Key risk factor: 2 major client contracts up for renewal in August. I recommend preparing renewal proposals now.';

  return 'Business Health Score: 89/100 · Revenue: SAR 310K (+12%) · Cash Position: SAR 420K · Upcoming Payments: SAR 125K this week. I can analyze your cash flow, expenses, revenue trends, loan eligibility, VAT obligations, payroll, or business health. What would you like to dive into?';
}

const BUSINESS_PROMPTS = ['Analyze cash flow', 'Reduce expenses', 'Loan eligibility', 'Revenue forecast'];
const PERSONAL_PROMPTS = ['My behavioral score', 'Emotion detection', 'Portfolio allocation', 'Savings goals'];

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useAppMode();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || (mode === 'personal' ? 'Noura' : 'Abdulrahman');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const isPersonal = mode === 'personal';

  const INITIAL: Message[] = [{
    id: '0',
    role: 'assistant',
    text: isPersonal
      ? `Hi ${firstName}! I'm Modrik, your behavioral finance advisor. I monitor your investment patterns, emotional triggers, and portfolio health in real time. How can I help you today?`
      : `Hello! I'm Modrik, your AI business financial advisor. I have real-time access to your business data and can help with cash flow, expenses, financing, and forecasting. How can I assist?`,
    time: now(),
  }];

  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed, time: now() };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setLoading(true);

    // Simulate natural thinking time (800–1400 ms)
    const delay = 800 + Math.random() * 600;
    await new Promise(r => setTimeout(r, delay));

    setLoading(false);
    setMessages(prev => [{
      id: `ai-${Date.now()}`,
      role: 'assistant',
      text: getLocalResponse(trimmed, mode ?? 'business', firstName),
      time: now(),
    }, ...prev]);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isAI = item.role === 'assistant';
    return (
      <View style={[styles.msgRow, isAI ? styles.msgRowAI : styles.msgRowUser]}>
        {isAI && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={12} color="#fff" />
          </View>
        )}
        <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
          <Text style={[styles.bubbleText, isAI ? styles.bubbleTextAI : styles.bubbleTextUser]}>
            {item.text}
          </Text>
          <Text style={[styles.bubbleTime, isAI ? styles.bubbleTimeAI : styles.bubbleTimeUser]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.modrikAvatar}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Modrik</Text>
            <View style={styles.onlineDot}>
              <View style={styles.dot} />
              <Text style={styles.onlineText}>
                AI Analyst · {isPersonal ? 'Personal Finance' : 'Business Finance'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="notifications-outline" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Panic-protect banner for personal mode */}
      {isPersonal && (
        <View style={styles.alertBanner}>
          <View style={styles.alertLeft}>
            <Ionicons name="warning-outline" size={14} color="#f59e0b" />
            <Text style={styles.alertText}> Modrik: Market volatility detected. Emotional stability score: 88%</Text>
          </View>
          <TouchableOpacity style={styles.protectBtn} onPress={() => sendMessage('Help me protect my portfolio from market volatility')}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#fff" />
            <Text style={styles.protectText}> Protect portfolio</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            loading ? (
              <View style={[styles.msgRow, styles.msgRowAI]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={12} color="#fff" />
                </View>
                <View style={[styles.bubble, styles.bubbleAI]}>
                  <View style={styles.typingDots}>
                    {[0.4, 0.7, 1].map((op, i) => (
                      <View key={i} style={[styles.typingDot, { opacity: op }]} />
                    ))}
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Personal-mode chips */}
        {isPersonal && (
          <View style={styles.personalActions}>
            <TouchableOpacity style={styles.actionChip} onPress={() => sendMessage('Show me my investment history')}>
              <Ionicons name="time-outline" size={13} color="#374151" />
              <Text style={styles.actionChipText}>Show History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionChip} onPress={() => sendMessage('I need help managing my emotions around investing')}>
              <Ionicons name="chatbubble-outline" size={13} color="#374151" />
              <Text style={styles.actionChipText}>Talk it out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick prompts */}
        <View style={styles.quickPrompts}>
          {(isPersonal ? PERSONAL_PROMPTS : BUSINESS_PROMPTS).map((p) => (
            <TouchableOpacity key={p} style={styles.quickChip} onPress={() => sendMessage(p)} activeOpacity={0.8}>
              <Text style={styles.quickChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(bottomPad, 16) }]}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={isPersonal ? 'Ask Modrik about your investments...' : 'Ask Modrik anything...'}
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(input)}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-up" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modrikAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  onlineDot: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  onlineText: { fontSize: 10, color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  headerAction: { padding: 4 },
  alertBanner: { backgroundColor: '#1e1b4b', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', gap: 8 },
  alertLeft: { flexDirection: 'row', alignItems: 'center' },
  alertText: { fontSize: 11, color: '#fde68a', flex: 1, fontFamily: 'Inter_400Regular' },
  protectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4f46e5', borderRadius: 10, paddingVertical: 8 },
  protectText: { fontSize: 12, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold' },
  msgRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  msgRowAI: { justifyContent: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  bubble: { maxWidth: '78%', borderRadius: 18, padding: 12 },
  bubbleAI: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#f1f5f9' },
  bubbleUser: { backgroundColor: '#4f46e5', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  bubbleTextAI: { color: '#1e293b' },
  bubbleTextUser: { color: '#fff' },
  bubbleTime: { fontSize: 10, marginTop: 4, fontFamily: 'Inter_400Regular' },
  bubbleTimeAI: { color: '#94a3b8' },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.6)' },
  typingDots: { flexDirection: 'row', gap: 4, paddingVertical: 2 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#94a3b8' },
  personalActions: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  actionChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#fff' },
  actionChipText: { fontSize: 12, color: '#374151', fontFamily: 'Inter_500Medium' },
  quickPrompts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  quickChip: { backgroundColor: '#eef2ff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#c7d2fe' },
  quickChipText: { fontSize: 12, color: '#4f46e5', fontFamily: 'Inter_500Medium' },
  inputBar: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', padding: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: '#f8fafc', borderRadius: 22, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 8 },
  input: { flex: 1, fontSize: 15, color: '#1e293b', maxHeight: 100, fontFamily: 'Inter_400Regular' },
  sendBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#c7d2fe' },
});
