import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppMode, type AppMode } from '@/context/AppModeContext';
import { useAuth } from '@/context/AuthContext';
import MadarikLogo from '@/components/MadarikLogo';

export default function ModeSelectScreen() {
  const insets = useSafeAreaInsets();
  const { setMode } = useAppMode();
  const { user } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSelect = async (m: AppMode) => {
    await setMode(m);
    // If already authenticated, go straight to dashboard; otherwise go to login
    if (user) {
      router.replace('/(tabs)/');
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <LinearGradient
      colors={['#04071a', '#0a0e27', '#130d3a', '#1a1060']}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: topPad + 24, paddingBottom: bottomPad + 24 }]}>

        {/* Logo */}
        <MadarikLogo size="medium" />

        {/* Headline */}
        <View style={styles.headlineWrap}>
          <Text style={styles.welcome}>Welcome to Madarik</Text>
          <Text style={styles.choosePath}>Choose Your Path</Text>
          <Text style={styles.sub}>
            Select the experience that fits your financial goals. You can switch anytime from your profile.
          </Text>
        </View>

        {/* Business card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelect('business')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['rgba(79,70,229,0.30)', 'rgba(79,70,229,0.10)', 'rgba(79,70,229,0.04)']}
            style={styles.cardInner}
          >
            <View style={[styles.cardIconBg, { backgroundColor: 'rgba(79,70,229,0.25)' }]}>
              <Ionicons name="briefcase" size={30} color="#818cf8" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Madarik for Business</Text>
              <Text style={styles.cardDesc}>
                Manage company cash flow, business banking, revenues, and expenses with AI-powered insights.
              </Text>
              <View style={styles.cardFeatures}>
                {['Cash flow analytics', 'Business banking', 'AI financial advisor'].map(f => (
                  <View key={f} style={styles.featurePill}>
                    <Ionicons name="checkmark-circle" size={11} color="#818cf8" />
                    <Text style={styles.featurePillText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="arrow-forward-circle" size={26} color="#818cf8" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Personal card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelect('personal')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['rgba(139,92,246,0.30)', 'rgba(139,92,246,0.10)', 'rgba(139,92,246,0.04)']}
            style={styles.cardInner}
          >
            <View style={[styles.cardIconBg, { backgroundColor: 'rgba(139,92,246,0.25)' }]}>
              <Ionicons name="person" size={30} color="#c084fc" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Madarik Personal</Text>
              <Text style={styles.cardDesc}>
                Smart investing, behavioral AI scoring, emotion detection, and personal cards management.
              </Text>
              <View style={styles.cardFeatures}>
                {['Behavioral AI score', 'Portfolio tracking', 'Smart insights'].map(f => (
                  <View key={f} style={styles.featurePill}>
                    <Ionicons name="checkmark-circle" size={11} color="#c084fc" />
                    <Text style={[styles.featurePillText, { color: '#c084fc' }]}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="arrow-forward-circle" size={26} color="#c084fc" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footer}>Trusted by 2,400+ businesses and investors across Saudi Arabia</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, alignItems: 'center' },

  headlineWrap: { alignItems: 'center', marginTop: 20, marginBottom: 28 },
  welcome: { fontSize: 13, fontWeight: '600', color: '#818cf8', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'Inter_600SemiBold', marginBottom: 6 },
  choosePath: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center', fontFamily: 'Inter_700Bold', lineHeight: 36, marginBottom: 10 },
  sub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 19, fontFamily: 'Inter_400Regular', maxWidth: 300 },

  card: {
    width: '100%', borderRadius: 22, overflow: 'hidden',
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
  },
  cardInner: { padding: 18, gap: 14 },
  cardIconBg: {
    width: 58, height: 58, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  cardDesc: { fontSize: 12, color: '#94a3b8', lineHeight: 17, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  cardFeatures: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  featurePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 },
  featurePillText: { fontSize: 10, color: '#818cf8', fontFamily: 'Inter_500Medium' },
  cardArrow: { alignSelf: 'flex-end' },

  footer: { fontSize: 11, color: '#334155', textAlign: 'center', fontFamily: 'Inter_400Regular', marginTop: 8 },
});
