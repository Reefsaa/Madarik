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
import { useLanguage } from '@/context/LanguageContext';
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

let _defaultRotate = 0;

function getLocalResponse(
  text: string,
  mode: string,
  firstName: string,
): { text: string; miniCard?: { label: string; value: string } } {
  const q = text.toLowerCase().trim();

  if (q.length === 0) return { text: `What's on your mind, ${firstName}?` };

  const isGreeting = /^(hi|hey|hello|سلام|مرحبا|هلا|صباح|مساء)\b/.test(q);
  const isVague    = /^(ok|okay|sure|hmm|oh|ah|right|yeah|yep|nope|no|yes|k|mm|what\??|idk|i don['']?t know|not sure|dunno|ما أدري|لا أعرف)\b/.test(q) || q.length < 6;
  const isThanks   = /thank|شكر|مشكور/.test(q);
  const isHelp     = /help|what can you|what do you|tell me|guide|assist|ساعدني|ماذا تقدر/.test(q);
  const isReport   = /report|summary|overview|ملخص|تقرير/.test(q);
  const isBalance  = /balance|account|card|رصيد|حساب/.test(q);

  if (isGreeting)
    return mode === 'personal'
      ? { text: `Hello ${firstName}! 👋 I'm Modrik, your personal finance AI. I can help you with your portfolio, behavioral score, spending analysis, savings goals, or emotional finance coaching. What would you like to explore today?` }
      : { text: `Hello! I'm Modrik, your business financial advisor. I have real-time access to your cash flow, expenses, revenue, and forecasts. How can I help you today?` };

  if (isThanks)
    return { text: `Glad I could help, ${firstName}! Anytime you want to check your portfolio, review your spending, or talk through a financial decision — I'm right here. 💙` };

  if (isHelp)
    return mode === 'personal'
      ? { text: `Here's what I can do for you, ${firstName}:\n\n📊 Portfolio & investments analysis\n🧠 Behavioral score & emotional coaching\n💳 Spending breakdown & budget alerts\n🎯 Savings goals tracking\n🔒 Panic-sell protection\n📈 Investment history & recovery stats\n\nJust type what you're curious about — or pick a quick option below!` }
      : { text: `Here's what I can help with:\n\n💵 Cash flow analysis & 30-day forecasts\n📉 Expense optimization\n🏦 Loan eligibility & financing options\n📊 Revenue trends & KPIs\n🔮 Quarterly & annual forecasts\n📑 VAT & compliance insights\n\nWhat would you like to dig into?` };

  if (isReport || (mode === 'personal' && isBalance))
    return mode === 'personal'
      ? { text: `Here's your snapshot, ${firstName}:\n\n💰 Total Balance: SAR 8,650\n📈 Portfolio Growth: +3.2% this quarter\n🧠 Behavioral Score: 87/100 (top 18%)\n❤️ Emotional Stability: 88%\n💳 Savings Rate: 32.4%\n🎯 Emergency Fund: 77% complete\n\nWant me to go deeper on any of these?` }
      : { text: `Business snapshot:\n\n💵 Revenue: SAR 310K (+12% YoY)\n📉 Expenses: SAR 280K\n📊 Net Cash Flow: +SAR 90K\n🏥 Health Score: 89/100\n🏦 Cash Position: SAR 420K\n⏰ Pending Invoices: SAR 87K this week\n\nWhat would you like to drill into?` };

  if (mode === 'personal') {
    if (/score|behavioral|assessment|discipline|stability/.test(q))
      return { text: `${firstName}, your Behavioral Score is 87/100 — placing you in the top 18% of Madarik users.\n\n✅ Discipline: 92/100\n✅ Stability: 85/100\n⚠️ Patience during volatility: room to grow\n\nYour score improved +4 points this month. Would you like to take the full Behavioral Assessment to unlock personalized coaching?` };

    if (/invest|portfolio|etf|stock|market|asset/.test(q))
      return { text: `Based on your Moderate risk profile:\n\n📊 60% ETFs\n📘 25% Fixed income\n💵 15% Cash\n\nModrik recommends a gradual +5% shift toward emerging markets — your Discipline Score of 92 supports higher-volatility instruments.\n\nProjected annual return: +9.2%. Want to see a detailed rebalancing plan?` };

    if (/emotion|fomo|fear|panic|stress|anxious|worried|crash|volatil|dip|drop/.test(q))
      return {
        text: `Take a breath, ${firstName}. Your Emotional Stability Score is 88% — you're in a strong position.\n\nHistorically, users who held through similar dips recovered fully within 9 days and avoided costly sell-offs. Locking your panic-sell button for 24 hours is the move that data supports.`,
        miniCard: { label: 'Historical Recovery', value: '﷼ 1,200 saved' },
      };

    if (/protect|lock|yes.*portfolio|activate/.test(q))
      return { text: `Panic-sell protection activated for 24 hours, ${firstName}. 🔒\n\nAny sell order will now require a 10-minute confirmation cooldown. This single behavior has improved outcomes for 91% of users with your profile during similar market conditions.` };

    if (/spend|expense|dining|shopping|budget|buy|paid/.test(q))
      return { text: `Spending this month: SAR 8,430\n\n🍽️ Dining: SAR 2,100 (25%) — 8% over budget\n🛍️ Shopping: SAR 1,850 (22%)\n🚗 Transport: SAR 980 (12%)\n📦 Other: SAR 3,500 (41%)\n\nQuick win: trimming dining by SAR 400/month saves SAR 4,800/year. Want an auto-budget adjustment plan?` };

    if (/goal|saving|emergency|hajj|target|dream/.test(q))
      return { text: `Your active savings goals:\n\n🏦 Emergency Fund: SAR 23,000 / 30,000 (77%) — on track for September ✅\n✈️ Hajj Travel: SAR 8,500 / 15,000 (57%) — projected December\n\nSavings rate: 32.4% — excellent! At this pace you'll hit both goals on time.` };

    if (/histor|show|past|recover|previous|track record/.test(q))
      return {
        text: `Investment history — last 6 months:\n\n📈 Portfolio growth: +8.4%\n🏆 Best month: March (+3.1%)\n📉 Worst month: January (-1.2%, recovered in 9 days)\n🛡️ Panic-sell events avoided: 2\n\nYour calm-hold strategy is working.`,
        miniCard: { label: 'Total Saved by Holding', value: '﷼ 2,840' },
      };

    if (/talk|breathe|calm|ground|relax/.test(q))
      return { text: `It's completely normal to feel uncertain, ${firstName}.\n\nHere's a quick grounding exercise: take 3 slow, deep breaths.\n\nYour money is in diversified assets — a short-term dip is within your risk tolerance. The market has recovered from every correction in the past 5 years. You've already avoided 2 panic-sell events this year by staying disciplined.\n\nYou're doing great. 💙` };

    if (isVague) {
      const options = [
        `No problem! Here are some things I can dig into for you right now:\n\n• Your Behavioral Score (currently 87)\n• Portfolio & investment recommendations\n• Spending breakdown this month\n• Savings goal progress\n• Emotional finance coaching\n\nWhich one interests you?`,
        `That's okay — let me suggest a starting point.\n\nYour most recent signal: Emotional Stability at 88% during a 6% market dip. That's strong. Want me to explain what it means for your investment strategy?`,
        `Not sure where to start? Here's what stands out today:\n\n📈 Portfolio up +3.2% this quarter\n🧠 Behavioral Score: 87 (top 18%)\n⚠️ Dining spend 8% over budget\n\nWant me to go deeper on any of these?`,
      ];
      _defaultRotate = (_defaultRotate + 1) % options.length;
      return { text: options[_defaultRotate] };
    }

    return { text: `I heard you, ${firstName}. Your financial health score is 87/100 today.\n\n📊 Savings rate: 32.4%\n📈 Portfolio growth: +3.2% this quarter\n🧠 Behavioral Score: 87\n\nTell me what you'd like to dig into — investments, spending, savings goals, or behavioral coaching.` };
  }

  if (/cash.?flow|cashflow|liquidity|inflow|outflow/.test(q))
    return { text: `Cash flow analysis:\n\n💵 Inflow: SAR 370K\n📤 Outflow: SAR 280K\n📊 Net: +SAR 90K\n\n30-day forecast: +SAR 120K surplus\n\nRecommendation: move SAR 45K to a high-yield business account now. Cash runway is 4.2 months — healthy. Want a breakdown by cost center?` };

  if (/expense|cost|overhead|payroll|salary|wage/.test(q))
    return { text: `Operational expenses: SAR 280K (+3.2%)\n\n👥 Payroll: SAR 85K (30%)\n🏭 Supplier Costs: 22%\n🏢 Rent: 12%\n📣 Marketing: 8%\n\n💡 Two quick wins:\n• Bulk supplier deal → save SAR 8K/month\n• Software consolidation → save SAR 1,800/month\n= SAR 117,600/year in savings. Want a detailed plan?` };

  if (/loan|financ|credit|borrow|funding/.test(q))
    return { text: `Financing pre-approval:\n\n✅ Up to SAR 500,000 at 4.5% fixed\n🏥 Business Health Score: 89/100\n\nSample: SAR 200K → SAR 17,417/month over 12 months\n\nYour score qualifies you for Tier 1 rates. Shall I prepare a full application summary?` };

  if (/revenue|income|sales|invoice|client/.test(q))
    return { text: `Revenue breakdown:\n\n📈 This month: SAR 310K (+12% YoY, +4.8% MoM)\n📁 Client Projects: 68%\n🔄 Recurring subscriptions: SAR 42K/month\n📊 Q3 forecast: SAR 340K\n\n⚠️ 3 pending invoices totalling SAR 87K due this week. Want me to draft a reminder?` };

  if (/forecast|predict|q3|q4|quarter|annual|year/.test(q))
    return { text: `Q3 Forecast:\n\n📈 Revenue: SAR 340K (+9.7%)\n📉 Expenses: SAR 295K (+5.4%)\n💰 Net Profit: SAR 45K\n\nFull-year projection: Revenue SAR 1.28M · EBITDA margin 24%\n\nTop risk: delayed receivables. Want a contingency cash flow plan?` };

  if (/vat|tax|zakat|compliance|legal/.test(q))
    return { text: `VAT & compliance status:\n\n✅ VAT filing: on time (last filed 15 Dhul Hijja)\n📊 VAT collected this quarter: SAR 46,500\n📋 Next filing deadline: 14 Muharram\n\nZakat assessment due Q1. Want me to generate a compliance checklist?` };

  if (/employee|staff|hr|team|hire/.test(q))
    return { text: `Workforce overview:\n\n👥 Total staff: 24 employees\n💵 Payroll this month: SAR 85,000\n📈 Payroll growth YoY: +4.2%\n\nCost per employee: SAR 3,542/month average. Benchmark for your sector: SAR 3,800 — you're efficient. Need an HR budget projection?` };

  if (isVague) {
    const options = [
      `Got it — here's what I'm seeing right now in your business:\n\n• Cash flow is healthy (+SAR 90K net)\n• 3 invoices totalling SAR 87K are overdue this week\n• Expense savings of SAR 117K/year are available\n\nWhich of these should we tackle first?`,
      `No problem. Your Business Health Score is 89/100 today. The biggest opportunity I see: two expense optimizations that save SAR 9,800/month without cutting headcount. Want me to walk you through them?`,
      `Here are the top items on Modrik's radar for your business:\n\n🔴 SAR 87K in pending invoices (due this week)\n🟡 Supplier costs 3% above industry average\n🟢 Cash runway: 4.2 months (healthy)\n\nWant to act on any of these?`,
    ];
    _defaultRotate = (_defaultRotate + 1) % options.length;
    return { text: options[_defaultRotate] };
  }

  return { text: `Business snapshot:\n\n🏥 Health Score: 89/100\n💵 Revenue: SAR 310K (+12%)\n💰 Cash Position: SAR 420K\n⏰ Upcoming payments: SAR 125K this week\n\nAsk me about cash flow, expenses, loans, payroll, VAT, or revenue forecasts — I have the details ready.` };
}

function buildInitial(isPersonal: boolean, firstName: string): Message {
  if (isPersonal) {
    return {
      id: '0', role: 'assistant', time: nowTime(),
      text: `Hi ${firstName}! I noticed the crypto market is experiencing a sudden 6% drop, and you've opened the app 4 times in the last hour.\n\nTake a deep breath. Historically, holding during this phase saved you money.\n\nWould you like to lock your panic-sell button for the next 24 hours?`,
      miniCard: { label: 'Historical Recovery', value: '﷼ 1,200 saved' },
    };
  }
  return {
    id: '0', role: 'assistant', time: nowTime(),
    text: "Hello! I'm Modrik, your AI business financial advisor. I have real-time access to your business data and can help with cash flow, expenses, financing, and forecasting. How can I assist?",
  };
}

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useAppMode();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const isPersonal = mode === 'personal';

  const PERSONAL_QUICK = [t('aiPersonalQ1'), t('aiPersonalQ2'), t('aiPersonalQ3'), t('aiPersonalQ4')];
  const BUSINESS_QUICK = [t('aiBusinessQ1'), t('aiBusinessQ2'), t('aiBusinessQ3'), t('aiBusinessQ4')];

  const [messages, setMessages] = useState<Message[]>([buildInitial(isPersonal, firstName)]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const historyForApi = [...messages]
      .reverse()
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.text }));
    historyForApi.push({ role: 'user', content: trimmed });

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed, time: nowTime() };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setLoading(true);

    const aiMsgId = `ai-${Date.now()}`;
    const apiUrl = Platform.OS === 'web' && typeof window !== 'undefined'
      ? `${window.location.origin}/api/chat`
      : null;

    try {
      if (apiUrl) {
        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyForApi, mode: mode ?? 'personal' }),
        });
        if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);
        setLoading(false);
        setMessages(prev => [{ id: aiMsgId, role: 'assistant', text: '', time: nowTime() }, ...prev]);
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';
        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) break outer;
              if (data.error) throw new Error(data.error);
              if (data.content) {
                fullText += data.content;
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
              }
            } catch (parseErr: unknown) {
              if (parseErr instanceof Error && parseErr.message !== 'SyntaxError') throw parseErr;
            }
          }
        }
        if (fullText) return;
        throw new Error('Empty stream');
      }
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      const response = getLocalResponse(trimmed, mode ?? 'personal', firstName);
      setMessages(prev => {
        const existing = prev.find(m => m.id === aiMsgId);
        const updated: Message = { id: aiMsgId, role: 'assistant', text: response.text, time: nowTime(), miniCard: response.miniCard };
        return existing ? prev.map(m => m.id === aiMsgId ? updated : m) : [updated, ...prev];
      });
    } catch {
      const response = getLocalResponse(trimmed, mode ?? 'personal', firstName);
      setMessages(prev => {
        const existing = prev.find(m => m.id === aiMsgId);
        const updated: Message = { id: aiMsgId, role: 'assistant', text: response.text, time: nowTime(), miniCard: response.miniCard };
        return existing ? prev.map(m => m.id === aiMsgId ? updated : m) : [updated, ...prev];
      });
    } finally {
      setLoading(false);
    }
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
            <Text style={[styles.bubbleText, isAI ? styles.bubbleTextAI : styles.bubbleTextUser, isRTL && { textAlign: 'right' }]}>
              {item.text}
            </Text>
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

  return (
    <View style={styles.container}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={[styles.headerLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.modrikAvatar}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <View style={isRTL ? { alignItems: 'flex-end' } : undefined}>
            <Text style={styles.headerTitle}>Modrik</Text>
            <View style={[styles.onlineRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{t('aiAnalyzing')}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </LinearGradient>

      {/* ── Panic-protect banner (personal mode) ────────────────────── */}
      {isPersonal && (
        <View style={[styles.alertBanner, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="warning-outline" size={13} color="#f59e0b" />
          <Text style={[styles.alertText, isRTL && { textAlign: 'right' }]}> {t('aiVolatilityAlert')}</Text>
          <TouchableOpacity style={styles.protectBtn} onPress={() => sendMessage(t('aiPersonalQ1'))}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#fff" />
            <Text style={styles.protectText}> {t('aiProtect')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1, marginBottom: Platform.OS === 'web' ? 84 : 49 + insets.bottom }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? topPad + 60 : 0}
      >
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
            <View style={styles.dateStamp}>
              <Text style={styles.dateStampText}>
                {t('aiToday')} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  <View style={styles.calculatingRow}>
                    <View style={styles.typingDots}>
                      {[0.35, 0.65, 1].map((op, i) => (
                        <View key={i} style={[styles.typingDot, { opacity: op }]} />
                      ))}
                    </View>
                    <Text style={styles.calculatingText}>{t('aiCalculating')}</Text>
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
          <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
            <TextInput
              style={[styles.input, isRTL && { textAlign: 'right' }]}
              value={input}
              onChangeText={setInput}
              placeholder={isPersonal ? t('aiTypePlaceholderPersonal') : t('aiTypePlaceholder')}
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
              <Ionicons name={isRTL ? 'arrow-back' : 'arrow-up'} size={17} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header:        { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modrikAvatar:  { width: 42, height: 42, borderRadius: 21, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  onlineRow:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  onlineText:    { fontSize: 10, color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  headerAction:  { padding: 4 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1b4b', paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  alertText:   { flex: 1, fontSize: 11, color: '#fde68a', fontFamily: 'Inter_400Regular' },
  protectBtn:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.purple, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10 },
  protectText: { fontSize: 11, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold' },
  dateStamp:     { alignItems: 'center', marginBottom: 14 },
  dateStampText: { fontSize: 10, color: '#94a3b8', fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },
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
  miniCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', borderRadius: 10, padding: 10, marginTop: 10, borderWidth: 1, borderColor: '#bbf7d0' },
  miniCardLabel:  { fontSize: 9, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  miniCardValue:  { fontSize: 14, fontWeight: '700', color: C.green, fontFamily: 'Inter_700Bold' },
  calculatingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingDots:     { flexDirection: 'row', gap: 4 },
  typingDot:      { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#94a3b8' },
  calculatingText:{ fontSize: 11, color: '#94a3b8', fontFamily: 'Inter_400Regular', fontStyle: 'italic' },
  quickWrap:   { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingVertical: 8 },
  quickRow:    { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  quickChip:   { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#eef2ff', borderWidth: 1, borderColor: '#c7d2fe' },
  quickChipText:{ fontSize: 12, color: C.purple, fontFamily: 'Inter_600SemiBold' },
  inputBar:  { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', padding: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: '#f8fafc', borderRadius: 22, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 8 },
  input:     { flex: 1, fontSize: 14, color: '#1e293b', maxHeight: 100, fontFamily: 'Inter_400Regular' },
  sendBtn:          { width: 34, height: 34, borderRadius: 17, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled:  { backgroundColor: '#c7d2fe' },
});
