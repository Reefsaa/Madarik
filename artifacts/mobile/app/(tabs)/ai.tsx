import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppMode } from '@/context/AppModeContext';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  purple:  '#6C5CE7',
  green:   '#00B894',
  red:     '#D63031',
  dark:    '#1A237E',
  grey:    '#F5F6FA',
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  miniCard?: { label: string; value: string };
  prompt?: string;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Local knowledge base ─────────────────────────────────────────────────────
function getLocalResponse(text: string, mode: string, firstName: string): { text: string; miniCard?: { label: string; value: string } } {
  const q = text.toLowerCase();

  if (mode === 'personal') {
    if (q.includes('score') || q.includes('behavioral') || q.includes('assessment'))
      return { text: `${firstName}, your Behavioral Score is 87/100 — top 18% of Madarik users. Strengths: Discipline 92/100 and Stability 85/100. Growth area: patience during volatility. Would you like to take the full Monthly Behavioral Assessment?` };
    if (q.includes('invest') || q.includes('portfolio'))
      return { text: 'Based on your Moderate risk profile: 60% ETFs, 25% fixed income, 15% cash. Recommend a gradual +5% shift toward emerging markets — your Discipline Score supports higher-volatility instruments. Expected return: +9.2% annually.' };
    if (q.includes('emotion') || q.includes('fomo') || q.includes('fear') || q.includes('panic') || q.includes('volatil') || q.includes('protect'))
      return { text: `Take a deep breath, ${firstName}. Historically, holding during this phase saved you money. Your Emotional Stability Score is 88% — strong. I recommend locking the panic-sell button for 24 hours.`, miniCard: { label: 'Historical Recovery', value: '﷼ 1,200 saved' } };
    if (q.includes('spending') || q.includes('expense'))
      return { text: 'Spending this month: SAR 8,430. Top: Dining (SAR 2,100 · 25%), Shopping (SAR 1,850 · 22%), Transport (SAR 980 · 12%). You are 8% over your dining budget. Want an adjustment plan?' };
    if (q.includes('goal') || q.includes('saving'))
      return { text: 'Active goals: Emergency Fund (SAR 23,000 / 30,000 — 77%, on track for September) · Hajj Travel (SAR 8,500 / 15,000 — 57%, projected December). Savings rate 32.4% — excellent.' };
    if (q.includes('history') || q.includes('show'))
      return { text: 'Investment history (last 6 months): Portfolio grew +8.4%. Best month: March (+3.1%). Worst: January (-1.2%, recovered in 9 days). Your calm-hold strategy saved you from 2 panic-sell events.', miniCard: { label: 'Total Saved by Holding', value: '﷼ 2,840' } };
    if (q.includes('lock') || q.includes('yes') || q.includes('protect'))
      return { text: `Panic-sell protection activated for 24 hours, ${firstName}. You will need to confirm any sell order with a 10-minute cooldown period. This has historically improved outcomes for users with your profile.` };
    if (q.includes('talk') || q.includes('stress') || q.includes('anxious'))
      return { text: "It's completely normal to feel anxious during market dips. Here's a grounding exercise: take 3 slow breaths. Your money is invested in diversified assets — a 6% dip is within your risk tolerance. The market has recovered from every dip in the past 5 years. You're doing great." };
    return { text: `${firstName}, your financial health is 87/100. Savings rate: 32.4% ✓. Portfolio growth: +3.2% this quarter. Behavioral Score: 87. I can analyze your investments, spending patterns, behavioral triggers, or savings goals. What would you like to explore?` };
  }

  // Business
  if (q.includes('cash flow') || q.includes('cashflow') || q.includes('liquidity'))
    return { text: 'Cash flow: SAR 370K inflow vs SAR 280K outflow. Net +SAR 90K. 30-day forecast: +SAR 120K surplus. Recommendation: move SAR 45K to a high-yield business account. Cash runway: 4.2 months — healthy.' };
  if (q.includes('expense') || q.includes('cost'))
    return { text: 'Operational expenses SAR 280K (+3.2%). Payroll 30% (SAR 85K), Supplier Costs 22%, Rent 12%, Marketing 8%. Potential savings: bulk supplier deal (SAR 8K/month) + software consolidation (SAR 1,800/month) = SAR 12K/month.' };
  if (q.includes('loan') || q.includes('financ'))
    return { text: 'Pre-approved: up to SAR 500,000 at 4.5% fixed. Business Health Score 89/100. SAR 200K → SAR 17,417/month over 12 months. Shall I prepare the application?' };
  if (q.includes('revenue') || q.includes('income'))
    return { text: 'Revenue: SAR 310K (+12% YoY, +4.8% MoM). Client Projects 68%. Recurring subscriptions: SAR 42K/month. Q3 forecast: SAR 340K. 3 pending invoices totaling SAR 87K due this week.' };
  if (q.includes('forecast') || q.includes('predict'))
    return { text: 'Q3 Forecast: Revenue SAR 340K (+9.7%), Expenses SAR 295K (+5.4%), Net Profit SAR 45K. Full-year: Revenue SAR 1.28M, EBITDA margin 24%.' };
  return { text: 'Business Health Score: 89/100 · Revenue: SAR 310K (+12%) · Cash Position: SAR 420K · Upcoming Payments: SAR 125K this week. Ask me about cash flow, expenses, loans, payroll, VAT, or forecasts.' };
}

const PERSONAL_QUICK = ['Yes, protect my portfolio', 'Show History', 'Talk it out', 'My behavioral score'];
const BUSINESS_QUICK = ['Analyze cash flow', 'Reduce expenses', 'Loan eligibility', 'Revenue forecast'];

// ── Initial bot message matching spec ─────────────────────────────────────────
function buildInitial(isPersonal: boolean, firstName: string): Message {
  if (isPersonal) {
    return {
      id: '0',
      role: 'assistant',
      text: `Hi ${firstName}! I noticed the crypto market is experiencing a sudden 6% drop, and you've opened the app 4 times in the last hour.\n\nTake a deep breath. Historically, holding during this phase saved you money.\n\nWould you like to lock your panic-sell button for the next 24 hours?`,
      time: nowTime(),
      miniCard: { label: 'Historical Recovery', value: '﷼ 1,200 saved' },
    };
  }
  return {
    id: '0',
    role: 'assistant',
    text: "Hello! I'm Modrik, your AI business financial advisor. I have real-time access to your business data and can help with cash flow, expenses, financing, and forecasting. How can I assist?",
    time: nowTime(),
  };
}

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useAppMode();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || (mode === 'personal' ? 'Noura' : 'Abdulrahman');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const isPersonal = mode === 'personal';

  const [messages, setMessages] = useState<Message[]>([buildInitial(isPersonal, firstName)]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed, time: nowTime() };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setLoading(true);

    // Simulate Modrik "calculating risks..."
    const delay = 800 + Math.random() * 700;
    await new Promise(r => setTimeout(r, delay));

    const response = getLocalResponse(trimmed, mode ?? 'business', firstName);
    setLoading(false);
    setMessages(prev => [{
      id: `ai-${Date.now()}`,
      role: 'assistant',
      text: response.text,
      time: nowTime(),
      miniCard: response.miniCard,
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
        <View style={{ maxWidth: '78%' }}>
          <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
            <Text style={[styles.bubbleText, isAI ? styles.bubbleTextAI : styles.bubbleTextUser]}>
              {item.text}
            </Text>

            {/* Nested mini-card */}
            {item.miniCard && (
              <View style={styles.miniCard}>
                <Ionicons name="shield-checkmark-outline" size={13} color={C.green} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.miniCardLabel}>{item.miniCard.label}</Text>
                  <Text style={styles.miniCardValue}>{item.miniCard.value}</Text>
                </View>
              </View>
            )}

            <Text style={[styles.bubbleTime, isAI ? styles.bubbleTimeAI : styles.bubbleTimeUser]}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Today date stamp
  const stamp = `TODAY • ${nowTime().replace(/:\d\d\s(AM|PM)/, '')}${(() => { const d = new Date(); const h = d.getHours(); const m = d.getMinutes(); return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; })()}`.replace('TODAY • ', 'TODAY • ');

  return (
    <View style={styles.container}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.modrikAvatar}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Modrik</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>AI Analyst · Analyzing market sentiment...</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </LinearGradient>

      {/* ── Panic-protect banner (personal mode) ────────────────────── */}
      {isPersonal && (
        <View style={styles.alertBanner}>
          <Ionicons name="warning-outline" size={13} color="#f59e0b" />
          <Text style={styles.alertText}> Modrik: Market volatility detected. Emotional stability: 88%</Text>
          <TouchableOpacity style={styles.protectBtn} onPress={() => sendMessage('Yes, protect my portfolio')}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#fff" />
            <Text style={styles.protectText}> Protect</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          inverted
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            /* Date stamp shown at "top" (footer in inverted list) */
            <View style={styles.dateStamp}>
              <Text style={styles.dateStampText}>
                TODAY • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          }
          ListHeaderComponent={
            loading ? (
              <View style={[styles.msgRow, styles.msgRowAI]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={12} color="#fff" />
                </View>
                <View style={[styles.bubble, styles.bubbleAI]}>
                  {/* Calculating risks status */}
                  <View style={styles.calculatingRow}>
                    <View style={styles.typingDots}>
                      {[0.35, 0.65, 1].map((op, i) => (
                        <View key={i} style={[styles.typingDot, { opacity: op }]} />
                      ))}
                    </View>
                    <Text style={styles.calculatingText}>Modrik is calculating risks...</Text>
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* ── Quick choice buttons ─────────────────────────────────── */}
        <View style={styles.quickWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {(isPersonal ? PERSONAL_QUICK : BUSINESS_QUICK).map((p) => (
              <TouchableOpacity key={p} style={styles.quickChip} onPress={() => sendMessage(p)} activeOpacity={0.8}>
                <Text style={styles.quickChipText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Input bar ────────────────────────────────────────────── */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(bottomPad, 16) }]}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={
                isPersonal
                  ? 'Type a message, or ask Modrik about your assets...'
                  : 'Ask Modrik anything...'
              }
              placeholderTextColor="#94a3b8"
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(input)}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-up" size={17} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Header
  header:        { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modrikAvatar:  { width: 42, height: 42, borderRadius: 21, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  onlineRow:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  onlineText:    { fontSize: 10, color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  headerAction:  { padding: 4 },

  // Alert banner
  alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1b4b', paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  alertText:   { flex: 1, fontSize: 11, color: '#fde68a', fontFamily: 'Inter_400Regular' },
  protectBtn:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.purple, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10 },
  protectText: { fontSize: 11, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold' },

  // Date stamp
  dateStamp:     { alignItems: 'center', marginBottom: 14 },
  dateStampText: { fontSize: 10, color: '#94a3b8', fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },

  // Messages
  msgRow:        { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  msgRowAI:      { justifyContent: 'flex-start' },
  msgRowUser:    { justifyContent: 'flex-end' },
  aiAvatar:      { width: 30, height: 30, borderRadius: 15, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  bubble:        { borderRadius: 18, padding: 13 },
  bubbleAI:      { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  bubbleUser:    { backgroundColor: C.purple, borderBottomRightRadius: 4 },
  bubbleText:    { fontSize: 14, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  bubbleTextAI:  { color: '#1e293b' },
  bubbleTextUser:{ color: '#fff' },
  bubbleTime:    { fontSize: 10, marginTop: 6, fontFamily: 'Inter_400Regular' },
  bubbleTimeAI:  { color: '#94a3b8' },
  bubbleTimeUser:{ color: 'rgba(255,255,255,0.6)' },

  // Mini-card inside bubble
  miniCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', borderRadius: 10, padding: 10, marginTop: 10, borderWidth: 1, borderColor: '#bbf7d0' },
  miniCardLabel:  { fontSize: 9, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  miniCardValue:  { fontSize: 14, fontWeight: '700', color: C.green, fontFamily: 'Inter_700Bold' },

  // Calculating indicator
  calculatingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingDots:     { flexDirection: 'row', gap: 4 },
  typingDot:      { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#94a3b8' },
  calculatingText:{ fontSize: 11, color: '#94a3b8', fontFamily: 'Inter_400Regular', fontStyle: 'italic' },

  // Quick choices
  quickWrap:   { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingVertical: 8 },
  quickRow:    { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  quickChip:   { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#eef2ff', borderWidth: 1, borderColor: '#c7d2fe' },
  quickChipText:{ fontSize: 12, color: C.purple, fontFamily: 'Inter_600SemiBold' },

  // Input bar
  inputBar:  { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', padding: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: '#f8fafc', borderRadius: 22, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 8 },
  input:     { flex: 1, fontSize: 14, color: '#1e293b', maxHeight: 100, fontFamily: 'Inter_400Regular' },
  sendBtn:          { width: 34, height: 34, borderRadius: 17, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled:  { backgroundColor: '#c7d2fe' },
});
