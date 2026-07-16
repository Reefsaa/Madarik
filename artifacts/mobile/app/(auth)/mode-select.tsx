import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppMode, type AppMode } from '@/context/AppModeContext';
import MadarikLogo from '@/components/MadarikLogo';

export default function ModeSelectScreen() {
  const insets = useSafeAreaInsets();
  const { setMode } = useAppMode();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSelect = async (m: AppMode) => {
    await setMode(m);
    router.replace('/(tabs)/');
  };

  return (
    <LinearGradient colors={['#0a0e27', '#1a1060', '#2d1b8e', '#1e3a8a']} style={styles.container}>
      <View style={[styles.content, { paddingTop: topPad + 40, paddingBottom: bottomPad + 32 }]}>
        <MadarikLogo size="medium" textColor="#c7d2fe" />

        <Text style={styles.question}>How would you like to use{'\n'}Madarik today?</Text>
        <Text style={styles.sub}>Choose your experience. You can switch anytime.</Text>

        {/* Business Mode Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelect('business')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['rgba(79,70,229,0.25)', 'rgba(79,70,229,0.08)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardIconWrap}>
              <Ionicons name="briefcase" size={32} color="#818cf8" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Business Mode</Text>
              <Text style={styles.cardDesc}>
                Manage company cash flow, business banking, revenues, and expenses with AI-powered insights.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Personal Mode Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelect('personal')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['rgba(168,85,247,0.25)', 'rgba(168,85,247,0.08)']}
            style={styles.cardGradient}
          >
            <View style={[styles.cardIconWrap, { backgroundColor: 'rgba(168,85,247,0.2)' }]}>
              <Ionicons name="person" size={32} color="#c084fc" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Personal Mode</Text>
              <Text style={styles.cardDesc}>
                Smart investing, behavioral AI scoring, emotion detection, and personal financial health coaching.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footer}>Powered by Modrik AI · مدارك</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },

  question: {
    fontSize: 24, fontWeight: '800', color: '#fff',
    textAlign: 'center', marginTop: 32, marginBottom: 8,
    fontFamily: 'Inter_700Bold', lineHeight: 32,
  },
  sub: {
    fontSize: 13, color: '#94a3b8', textAlign: 'center',
    marginBottom: 36, fontFamily: 'Inter_400Regular',
  },

  card: {
    width: '100%', borderRadius: 20, overflow: 'hidden',
    marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  cardGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14 },
  cardIconWrap: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: 'rgba(79,70,229,0.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 5 },
  cardDesc: { fontSize: 12, color: '#94a3b8', lineHeight: 17, fontFamily: 'Inter_400Regular' },

  footer: { position: 'absolute', bottom: 24, fontSize: 11, color: '#475569', fontFamily: 'Inter_400Regular' },
});
