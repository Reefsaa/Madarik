import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppMode, type AppMode } from '@/context/AppModeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import MadarikLogo from '@/components/MadarikLogo';

export default function ModeSelectScreen() {
  const insets = useSafeAreaInsets();
  const { setMode } = useAppMode();
  const { user } = useAuth();
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSelect = async (m: AppMode) => {
    await setMode(m);
    if (user) {
      router.replace('/(tabs)/');
    } else {
      router.replace('/(auth)/login');
    }
  };

  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'center';

  return (
    <LinearGradient
      colors={['#04071a', '#0a0e27', '#130d3a', '#1a1060']}
      style={styles.container}
    >
      {/* Language toggle */}
      <TouchableOpacity
        style={[styles.langBtn, { top: topPad + 12, right: 16 }]}
        onPress={toggleLanguage}
        activeOpacity={0.7}
      >
        <Ionicons name="globe-outline" size={18} color="rgba(255,255,255,0.65)" />
        <Text style={styles.langLabel}>{language === 'en' ? 'عربي' : 'EN'}</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 52, paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <MadarikLogo size="medium" />

        <View style={styles.headlineWrap}>
          <Text style={[styles.welcome, { textAlign }]}>{t('modeSelectTag')}</Text>
          <Text style={[styles.choosePath, { textAlign, writingDirection: dir }]}>{t('modeSelectTitle')}</Text>
          <Text style={[styles.sub, { textAlign, writingDirection: dir }]}>{t('modeSelectSub')}</Text>
        </View>

        {/* Business card */}
        <TouchableOpacity style={styles.card} onPress={() => handleSelect('business')} activeOpacity={0.85}>
          <LinearGradient
            colors={['rgba(79,70,229,0.30)', 'rgba(79,70,229,0.10)', 'rgba(79,70,229,0.04)']}
            style={styles.cardInner}
          >
            <View style={[styles.cardIconBg, { backgroundColor: 'rgba(79,70,229,0.25)' }]}>
              <Ionicons name="briefcase" size={28} color="#818cf8" />
            </View>
            <Text style={[styles.cardTitle, { writingDirection: dir, textAlign: isRTL ? 'right' : 'left' }]}>{t('businessTitle')}</Text>
            <Text style={[styles.cardDesc, { writingDirection: dir, textAlign: isRTL ? 'right' : 'left' }]}>{t('businessDesc')}</Text>
            <View style={[styles.cardFeatures, isRTL && { flexDirection: 'row-reverse' }]}>
              {([t('businessF1'), t('businessF2'), t('businessF3')] as string[]).map((f) => (
                <View key={f} style={styles.featurePill}>
                  <Ionicons name="checkmark-circle" size={11} color="#818cf8" />
                  <Text style={styles.featurePillText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.cardFooter, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.cardCta, { color: '#818cf8' }]}>{isRTL ? 'البدء' : 'Get started'}</Text>
              <Ionicons name={isRTL ? 'arrow-back-circle' : 'arrow-forward-circle'} size={22} color="#818cf8" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Personal card */}
        <TouchableOpacity style={[styles.card, { borderColor: 'rgba(139,92,246,0.30)' }]} onPress={() => handleSelect('personal')} activeOpacity={0.85}>
          <LinearGradient
            colors={['rgba(139,92,246,0.30)', 'rgba(139,92,246,0.10)', 'rgba(139,92,246,0.04)']}
            style={styles.cardInner}
          >
            <View style={[styles.cardIconBg, { backgroundColor: 'rgba(139,92,246,0.25)' }]}>
              <Ionicons name="person" size={28} color="#c084fc" />
            </View>
            <Text style={[styles.cardTitle, { writingDirection: dir, textAlign: isRTL ? 'right' : 'left' }]}>{t('personalTitle')}</Text>
            <Text style={[styles.cardDesc, { writingDirection: dir, textAlign: isRTL ? 'right' : 'left' }]}>{t('personalDesc')}</Text>
            <View style={[styles.cardFeatures, isRTL && { flexDirection: 'row-reverse' }]}>
              {([t('personalF1'), t('personalF2'), t('personalF3')] as string[]).map((f) => (
                <View key={f} style={styles.featurePill}>
                  <Ionicons name="checkmark-circle" size={11} color="#c084fc" />
                  <Text style={[styles.featurePillText, { color: '#c084fc' }]}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.cardFooter, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.cardCta, { color: '#c084fc' }]}>{isRTL ? 'البدء' : 'Get started'}</Text>
              <Ionicons name={isRTL ? 'arrow-back-circle' : 'arrow-forward-circle'} size={22} color="#c084fc" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={[styles.footer, { textAlign, writingDirection: dir }]}>{t('modeFooter')}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  langBtn: {
    position: 'absolute', zIndex: 10,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6,
  },
  langLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_600SemiBold' },

  content: { alignItems: 'center', paddingHorizontal: 20 },

  headlineWrap: { alignItems: 'center', width: '100%', marginTop: 18, marginBottom: 22 },
  welcome: { fontSize: 11, fontWeight: '600', color: '#818cf8', letterSpacing: 1.4, textTransform: 'uppercase', fontFamily: 'Inter_600SemiBold', marginBottom: 6 },
  choosePath: { fontSize: 30, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', lineHeight: 36, marginBottom: 10 },
  sub: { fontSize: 13, color: '#64748b', lineHeight: 19, fontFamily: 'Inter_400Regular', maxWidth: 300 },

  card: {
    width: '100%', borderRadius: 22, overflow: 'hidden',
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(79,70,229,0.30)',
  },
  cardInner: { padding: 18, gap: 10 },
  cardIconBg: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  cardDesc: { fontSize: 12, color: '#94a3b8', lineHeight: 17, fontFamily: 'Inter_400Regular' },
  cardFeatures: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  featurePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 4,
  },
  featurePillText: { fontSize: 10, color: '#818cf8', fontFamily: 'Inter_500Medium' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 2 },
  cardCta: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  footer: { fontSize: 11, color: '#334155', fontFamily: 'Inter_400Regular', marginTop: 8 },
});
