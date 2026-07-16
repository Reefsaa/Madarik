import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FEATURES = [
  { icon: 'stats-chart-outline' as const, title: 'AI Cash Flow Analysis', desc: 'Real-time forecasting with predictive insights' },
  { icon: 'flash-outline' as const, title: 'Instant Financing', desc: 'Pre-approved loan offers in minutes' },
  { icon: 'shield-checkmark-outline' as const, title: 'Business Health Score', desc: 'Know your financial standing at a glance' },
  { icon: 'sparkles-outline' as const, title: 'Modrik AI Advisor', desc: 'Ask anything about your business finances' },
];

export default function LaunchScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#312e81']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoLetter}>M</Text>
          </View>
          <Text style={styles.appName}>Madarik</Text>
          <View style={styles.taglineBadge}>
            <Ionicons name="sparkles" size={10} color="#a5b4fc" />
            <Text style={styles.taglineText}>AI-Powered Business Finance</Text>
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>Your Business,{'\n'}Intelligently Managed</Text>
          <Text style={styles.subheadline}>
            Get real-time financial insights, AI-driven recommendations, and instant access to
            financing — all in one place.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon} size={18} color="#818cf8" />
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Sign In to Existing Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Trusted by 2,400+ businesses across Saudi Arabia
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  logoLetter: { fontSize: 34, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  appName: { fontSize: 28, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 8 },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79,70,229,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.3)',
    gap: 5,
  },
  taglineText: { fontSize: 11, color: '#a5b4fc', fontFamily: 'Inter_500Medium' },

  headlineSection: { alignItems: 'center', marginBottom: 32 },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 38,
    fontFamily: 'Inter_700Bold',
    marginBottom: 14,
  },
  subheadline: {
    fontSize: 14,
    color: '#c7d2fe',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 10,
  },
  featureCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(79,70,229,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  featureDesc: { fontSize: 10, color: '#94a3b8', lineHeight: 14, fontFamily: 'Inter_400Regular' },

  ctaSection: { gap: 12, marginBottom: 24 },
  primaryBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryBtnText: {
    color: '#e0e7ff',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'Inter_400Regular',
  },
});
