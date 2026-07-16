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
  streaming?: boolean;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Fallback responses when API is unavailable
function getFallback(text: string, mode: string): string {
  const lower = text.toLowerCase();
  if (mode === 'personal') {
    if (lower.includes('invest') || lower.includes('portfolio')) return 'Based on your Behavioral Score of 87/100, your investment decisions are consistent and emotionally stable. I recommend maintaining your current 60% ETF allocation with gradual exposure to emerging markets. Your risk profile (Moderate) is well-aligned with your financial goals.';
    if (lower.includes('emotion') || lower.includes('fomo') || lower.includes('panic')) return 'I\'ve detected elevated engagement patterns suggesting possible FOMO tendencies. Historical data shows that your best returns came from holding positions during volatile periods. Take a deep breath — your portfolio is designed for long-term growth, not short-term fluctuations.';
    return 'Your Financial Health Score is 87/100 — excellent! Your savings rate is 32.4%, which is above the recommended 20%. I suggest reviewing your investment allocation and considering increasing your Emergency Fund to 6 months of expenses. Would you like a detailed analysis?';
  }
  if (lower.includes('cash flow') || lower.includes('cashflow')) return 'Your cash flow shows strong inflows with 12% growth. The 30-day forecast projects SAR 120,000 net. I recommend moving your SAR 45,000 surplus to a high-yield account to maximize working capital efficiency.';
  if (lower.includes('expense') || lower.includes('cost')) return 'Operational expenses are up 3.2% this quarter. Key optimization opportunities: (1) Supplier bulk deals — SAR 8,000/month savings, (2) Software consolidation — SAR 1,800/month savings. Total potential: SAR 12,000/month.';
  if (lower.includes('loan') || lower.includes('financ')) return 'You are pre-approved for SAR 50,000 at 4.5% fixed rate. Business Health Score: 89/100. Monthly installment: SAR 4,354 over 12 months.';
  return 'I\'ve analyzed your financial data. Business Health Score: 89/100. Revenue: SAR 310K (+12%). What specific area would you like me to analyze?';
}

const BUSINESS_PROMPTS = ['Analyze cash flow', 'Reduce expenses', 'Loan eligibility', 'Revenue forecast'];
const PERSONAL_PROMPTS = ['My behavioral score', 'Emotion detection', 'Portfolio allocation', 'Investment goals'];

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useAppMode();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || (mode === 'personal' ? 'Noura' : 'Abdulrahman');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const isPersonal = mode === 'personal';
  const quickPrompts = isPersonal ? PERSONAL_PROMPTS : BUSINESS_PROMPTS;

  const INITIAL: Message[] = [{
    id: '0',
    role: 'assistant',
    text: isPersonal
      ? `Hi ${firstName}! I'm Modrik, your behavioral finance advisor. I monitor your investment patterns, emotional triggers, and portfolio health in real time. How can I help you today?`
      : `Hello! I'm Modrik, your AI financial advisor. I have real-time access to your business data and can help with cash flow, expenses, financing, and forecasting. How can I assist you?`,
    time: now(),
  }];

  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const apiBase = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed, time: now() };
    const aiMsgId = `ai-${Date.now()}`;

    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setLoading(true);

    // Build chat history for API (oldest first)
    const history = [...messages].reverse().map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.text,
    }));
    history.push({ role: 'user', content: trimmed });

    try {
      const response = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-20), mode: mode ?? 'business' }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // Add empty streaming message
      setMessages(prev => [{ id: aiMsgId, role: 'assistant', text: '', time: now(), streaming: true }, ...prev]);
      setLoading(false);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6)) as { content?: string; done?: boolean; error?: string };
            if (data.content) {
              fullText += data.content;
              const snap = fullText;
              setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: snap } : m));
            }
            if (data.done || data.error) break;
          } catch {}
        }
      }

      // Finalize
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, streaming: false } : m));

    } catch {
      setLoading(false);
      // Fallback response
      setMessages(prev => [{
        id: aiMsgId, role: 'assistant',
        text: getFallback(trimmed, mode ?? 'business'),
        time: now(),
      }, ...prev]);
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
        <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
          <Text style={[styles.bubbleText, isAI ? styles.bubbleTextAI : styles.bubbleTextUser]}>
            {item.text}
            {item.streaming && <Text style={{ color: '#4f46e5' }}>▍</Text>}
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
          <View style={styles.alertContent}>
            <View style={styles.alertLeft}>
              <Ionicons name="warning-outline" size={14} color="#f59e0b" />
              <Text style={styles.alertText}> Modrik: Market volatility detected. Emotional stability score: 88%</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.protectBtn}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#fff" />
            <Text style={styles.protectText}> Yes, protect my portfolio</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
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

        {/* Personal mode bottom actions */}
        {isPersonal && (
          <View style={styles.personalActions}>
            <TouchableOpacity style={styles.actionChip}>
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
          {quickPrompts.map((p) => (
            <TouchableOpacity key={p} style={styles.quickChip} onPress={() => sendMessage(p)} activeOpacity={0.8}>
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
              placeholder={isPersonal ? "Ask Modrik about your investments..." : "Ask Modrik anything..."}
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(input)}
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

  alertBanner: { backgroundColor: '#1e1b4b', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  alertContent: { marginBottom: 8 },
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
