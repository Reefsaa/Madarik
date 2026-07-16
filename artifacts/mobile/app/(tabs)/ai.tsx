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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  'Analyze my cash flow',
  'Reduce expenses',
  'Loan eligibility',
  'Revenue forecast',
];

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('cash flow') || lower.includes('cashflow')) {
    return "Based on your current data, your cash flow shows strong inflows with 12% growth. Your 30-day forecast projects SAR 120,000 net, though there's a 4.2% decline trend. I recommend moving your SAR 45,000 surplus to a high-yield account to maximize working capital efficiency.";
  }
  if (lower.includes('expense') || lower.includes('cost') || lower.includes('reduce')) {
    return "Your operational expenses are up 3.2% this quarter. Key areas to optimize: (1) Supplier costs — negotiate bulk deals for potential SAR 8,000/month savings, (2) Office utilities at SAR 8,400/month — switch to off-peak usage, (3) Software subscriptions — audit unused tools. Potential total savings: SAR 12,000/month.";
  }
  if (lower.includes('revenue') || lower.includes('income') || lower.includes('forecast')) {
    return "Revenue is stable at SAR 310,000/month with consistent growth from Clients #241 and #156. Q3 projected revenue: SAR 940,000. Recommendation: Expand service offerings to your top 5 clients — this could boost revenue by 18% based on your current engagement rates.";
  }
  if (lower.includes('loan') || lower.includes('financ') || lower.includes('eligib')) {
    return "Great news! You are pre-approved for a SAR 50,000 working capital loan at 4.5% fixed annual rate. Based on your Business Health Score of 89/100 and consistent cash flow, your approval probability is 96%. Monthly installment: SAR 4,354 over 12 months with zero processing fees.";
  }
  if (lower.includes('payroll') || lower.includes('salary') || lower.includes('employee')) {
    return "Your next payroll is due in 5 days for SAR 85,000. Your Payroll Account shows a balance of SAR 95,000 — sufficient to cover this cycle. I recommend scheduling the transfer 2 business days early to ensure timely processing and avoid potential delays.";
  }
  if (lower.includes('invest') || lower.includes('saving')) {
    return "With SAR 300,000 in business savings at current market rates, you could earn SAR 15,000/year in a high-yield account. I recommend a diversified allocation: 60% high-yield savings, 30% short-term bonds (5.2% yield), and 10% liquid reserve for operational flexibility.";
  }
  if (lower.includes('health') || lower.includes('score')) {
    return "Your Business Health Score is 89/100 — Excellent! Breakdown: Cash Flow (95/100), Liquidity (88/100), Revenue Stability (91/100), Expense Control (82/100), Financial Risk (87/100). Your main opportunity for improvement is Expense Control — addressing supplier costs could push your score above 92.";
  }
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('help')) {
    return "Hello! I'm Modrik, your AI financial advisor. I have full visibility into your business finances and can help with cash flow analysis, expense optimization, loan recommendations, revenue forecasting, and more. What would you like to explore today?";
  }
  return "I've analyzed your financial data. Based on your current performance metrics — Business Health Score 89/100, monthly revenue SAR 310,000, and strong liquidity — your business is in excellent financial health. Would you like me to deep-dive into any specific area of your finances?";
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const INITIAL: Message[] = [
  {
    id: '1',
    role: 'assistant',
    text: "Hello! I'm Modrik, your AI financial advisor. I have real-time access to your business data. How can I help you today?",
    time: now(),
  },
];

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      time: now(),
    };
    setMessages((prev) => [userMsg, ...prev]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: getResponse(trimmed),
        time: now(),
      };
      setMessages((prev) => [aiMsg, ...prev]);
      setTyping(false);
    }, 900 + Math.random() * 600);
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
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.modrikAvatar}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Modrik AI</Text>
            <View style={styles.onlineDot}>
              <View style={styles.dot} />
              <Text style={styles.onlineText}>Active • Analyzing your data</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            typing ? (
              <View style={[styles.msgRow, styles.msgRowAI]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={12} color="#fff" />
                </View>
                <View style={[styles.bubble, styles.bubbleAI, styles.typingBubble]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, { opacity: 0.4 }]} />
                    <View style={[styles.typingDot, { opacity: 0.7 }]} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick prompts */}
        <View style={styles.quickPrompts}>
          {QUICK_PROMPTS.map((p) => (
            <TouchableOpacity key={p} style={styles.quickChip} onPress={() => send(p)} activeOpacity={0.8}>
              <Text style={styles.quickChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(bottomPad, 16) }]}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask Modrik anything..."
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              onSubmitEditing={() => send(input)}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={() => send(input)}
              disabled={!input.trim()}
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
  modrikAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  onlineDot: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  onlineText: { fontSize: 10, color: '#94a3b8', fontFamily: 'Inter_400Regular' },
  headerAction: { padding: 4 },

  msgRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  msgRowAI: { justifyContent: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  aiAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  bubble: { maxWidth: '78%', borderRadius: 18, padding: 12 },
  bubbleAI: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#f1f5f9' },
  bubbleUser: { backgroundColor: '#4f46e5', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  bubbleTextAI: { color: '#1e293b' },
  bubbleTextUser: { color: '#fff' },
  bubbleTime: { fontSize: 10, marginTop: 4, fontFamily: 'Inter_400Regular' },
  bubbleTimeAI: { color: '#94a3b8' },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.6)' },

  typingBubble: { paddingVertical: 14 },
  typingDots: { flexDirection: 'row', gap: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#94a3b8' },

  quickPrompts: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingHorizontal: 16, paddingBottom: 8,
  },
  quickChip: {
    backgroundColor: '#eef2ff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: '#c7d2fe',
  },
  quickChipText: { fontSize: 12, color: '#4f46e5', fontFamily: 'Inter_500Medium' },

  inputBar: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', padding: 12 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: '#f8fafc', borderRadius: 22,
    borderWidth: 1, borderColor: '#e2e8f0',
    paddingHorizontal: 14, paddingVertical: 8,
  },
  input: { flex: 1, fontSize: 15, color: '#1e293b', maxHeight: 100, fontFamily: 'Inter_400Regular' },
  sendBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#c7d2fe' },
});
