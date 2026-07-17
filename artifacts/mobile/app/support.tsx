import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const SUPPORT_EMAIL = 'madarik.amad@gmail.com';
const SUPPORT_PHONE = '+966-11-XXX-XXXX';

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [focusedSubject, setFocusedSubject] = useState(false);
  const [focusedMsg, setFocusedMsg] = useState(false);

  const FAQ = [
    { q: t('suppFaqQ1'), a: t('suppFaqA1') },
    { q: t('suppFaqQ2'), a: t('suppFaqA2') },
    { q: t('suppFaqQ3'), a: t('suppFaqA3') },
    { q: t('suppFaqQ4'), a: t('suppFaqA4') },
    { q: t('suppFaqQ5'), a: t('suppFaqA5') },
  ];

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('', isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }
    setSent(true);
    setSubject('');
    setMessage('');
  };

  const SLabel = ({ title }: { title: string }) => (
    <Text style={[sec.title, isRTL && { textAlign: 'right' }]}>{title}</Text>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('suppTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* FAQ */}
        <SLabel title={t('suppFaqSection')} />
        <View style={s.card}>
          {FAQ.map((item, i) => {
            const open = expandedFaq === i;
            return (
              <View key={i}>
                <TouchableOpacity style={[s.faqQ, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => setExpandedFaq(open ? null : i)} activeOpacity={0.8}>
                  <Text style={[s.faqQText, isRTL && { textAlign: 'right' }, open && { color: '#4f46e5' }]} numberOfLines={open ? undefined : 2}>
                    {item.q}
                  </Text>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={open ? '#4f46e5' : '#9ca3af'} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                {open && <Text style={[s.faqA, isRTL && { textAlign: 'right' }]}>{item.a}</Text>}
                {i < FAQ.length - 1 && <View style={s.divider} />}
              </View>
            );
          })}
        </View>

        {/* Contact */}
        <SLabel title={t('suppContactSection')} />
        <View style={s.card}>
          <TouchableOpacity
            style={[s.contactRow, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {})}
            activeOpacity={0.8}
          >
            <View style={s.contactIcon}><Ionicons name="mail-outline" size={18} color="#4f46e5" /></View>
            <View style={[s.contactInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={s.contactLabel}>{t('suppEmailLabel')}</Text>
              <Text style={s.contactValue}>{SUPPORT_EMAIL}</Text>
              <Text style={s.contactDesc}>{t('suppEmailDesc')}</Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color="#d1d5db" />
          </TouchableOpacity>
          <View style={s.divider} />
          <TouchableOpacity
            style={[s.contactRow, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() => {})}
            activeOpacity={0.8}
          >
            <View style={s.contactIcon}><Ionicons name="call-outline" size={18} color="#4f46e5" /></View>
            <View style={[s.contactInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={s.contactLabel}>{t('suppPhoneLabel')}</Text>
              <Text style={s.contactValue}>{SUPPORT_PHONE}</Text>
              <Text style={s.contactDesc}>{t('suppPhoneDesc')}</Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Message form */}
        <SLabel title={t('suppMsgSection')} />
        {sent ? (
          <View style={s.sentCard}>
            <Ionicons name="checkmark-circle" size={40} color="#10b981" />
            <Text style={s.sentText}>{t('suppSentMsg')}</Text>
            <TouchableOpacity onPress={() => setSent(false)} style={s.sentResetBtn}>
              <Text style={s.sentResetText}>{isRTL ? 'إرسال رسالة أخرى' : 'Send another message'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.formCard}>
            <Text style={[s.fieldLabel, isRTL && { textAlign: 'right' }]}>{t('suppSubjectPh')}</Text>
            <TextInput
              style={[s.input, focusedSubject && s.inputFocused, isRTL && { textAlign: 'right' }]}
              placeholder={t('suppSubjectPh')}
              value={subject}
              onChangeText={setSubject}
              onFocus={() => setFocusedSubject(true)}
              onBlur={() => setFocusedSubject(false)}
              placeholderTextColor="#9ca3af"
            />
            <Text style={[s.fieldLabel, { marginTop: 12 }, isRTL && { textAlign: 'right' }]}>{isRTL ? 'الرسالة' : 'Message'}</Text>
            <TextInput
              style={[s.textarea, focusedMsg && s.inputFocused, isRTL && { textAlign: 'right' }]}
              placeholder={t('suppMsgPh')}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setFocusedMsg(true)}
              onBlur={() => setFocusedMsg(false)}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity style={s.sendBtn} onPress={handleSend} activeOpacity={0.85}>
              <Ionicons name="send-outline" size={16} color="#fff" />
              <Text style={s.sendBtnText}>{t('suppSend')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const sec = StyleSheet.create({ title: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 22, marginBottom: 8 } });

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backRTL: { marginRight: 0, marginLeft: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  faqQ: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  faqQText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151', fontFamily: 'Inter_600SemiBold' },
  faqA: { fontSize: 13, color: '#6b7280', lineHeight: 20, paddingHorizontal: 16, paddingBottom: 14, fontFamily: 'Inter_400Regular', backgroundColor: '#fafafe' },
  divider: { height: 1, backgroundColor: '#f9fafb' },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
  contactIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 13, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  contactValue: { fontSize: 12, color: '#4f46e5', marginTop: 2, fontFamily: 'Inter_400Regular' },
  contactDesc: { fontSize: 11, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  formCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#f3f4f6', padding: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111827', fontFamily: 'Inter_400Regular' },
  textarea: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111827', fontFamily: 'Inter_400Regular', minHeight: 110 },
  inputFocused: { borderColor: '#4f46e5', backgroundColor: '#fff' },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 13, marginTop: 14 },
  sendBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  sentCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#d1fae5', padding: 24, alignItems: 'center', gap: 12 },
  sentText: { fontSize: 14, color: '#065f46', fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 22 },
  sentResetBtn: { marginTop: 4 },
  sentResetText: { fontSize: 13, color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
});
