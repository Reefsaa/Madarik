import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const options = [
    {
      code: 'en' as const,
      name: t('langEnglish'),
      native: 'English',
      desc: t('langEnDesc'),
      icon: '🇬🇧',
      dir: 'LTR',
    },
    {
      code: 'ar' as const,
      name: t('langArabic'),
      native: 'العربية',
      desc: t('langArDesc'),
      icon: '🇸🇦',
      dir: 'RTL',
    },
  ];

  const select = (code: 'en' | 'ar') => {
    if (code !== language) toggleLanguage();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('langSettingsTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        <Text style={[s.subtitle, isRTL && { textAlign: 'right' }]}>{t('langSelect')}</Text>

        {options.map(opt => {
          const active = language === opt.code;
          return (
            <TouchableOpacity
              key={opt.code}
              style={[s.card, active && s.cardActive]}
              onPress={() => select(opt.code)}
              activeOpacity={0.85}
            >
              <View style={[s.cardInner, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={s.flag}>{opt.icon}</Text>
                <View style={[s.cardInfo, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[s.cardName, active && s.cardNameActive]}>{opt.native}</Text>
                  <Text style={s.cardDesc}>{opt.desc}</Text>
                  <View style={[s.dirBadge, isRTL && { alignSelf: 'flex-end' }]}>
                    <Text style={s.dirText}>{opt.dir}</Text>
                  </View>
                </View>
                {active && (
                  <View style={s.checkWrap}>
                    <Ionicons name="checkmark-circle" size={24} color="#4f46e5" />
                    <Text style={s.activeLabel}>{t('langActive')}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={s.note}>
          <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
          <Text style={[s.noteText, isRTL && { textAlign: 'right' }]}>
            {isRTL
              ? 'سيتم تطبيق اللغة المختارة فوراً في جميع أنحاء التطبيق.'
              : 'The selected language is applied immediately throughout the app.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backRTL: { marginRight: 0, marginLeft: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, color: '#6b7280', fontFamily: 'Inter_400Regular', marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, backgroundColor: '#fff', borderWidth: 2, borderColor: '#f3f4f6', padding: 18 },
  cardActive: { borderColor: '#4f46e5', backgroundColor: '#fafafe' },
  cardInner: { flexDirection: 'row', alignItems: 'center' },
  flag: { fontSize: 36, marginRight: 14 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: '700', color: '#374151', fontFamily: 'Inter_700Bold' },
  cardNameActive: { color: '#4f46e5' },
  cardDesc: { fontSize: 12, color: '#9ca3af', marginTop: 3, fontFamily: 'Inter_400Regular' },
  dirBadge: { marginTop: 6, backgroundColor: '#f3f4f6', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  dirText: { fontSize: 10, fontWeight: '700', color: '#6b7280', fontFamily: 'Inter_700Bold' },
  checkWrap: { alignItems: 'center', gap: 4 },
  activeLabel: { fontSize: 10, fontWeight: '700', color: '#4f46e5', fontFamily: 'Inter_700Bold' },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginTop: 8, padding: 14, borderWidth: 1, borderColor: '#f3f4f6' },
  noteText: { flex: 1, fontSize: 12, color: '#6b7280', fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
