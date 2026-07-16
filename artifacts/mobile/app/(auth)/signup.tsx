import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !company.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password, company.trim());
      router.replace('/(tabs)/');
    } catch {
      setError('Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', value: name, setter: setName, icon: 'person-outline' as const, placeholder: 'Abdulrahman Al-Rashidi', type: 'default' as const },
    { label: 'Business Email', value: email, setter: setEmail, icon: 'mail-outline' as const, placeholder: 'you@company.com', type: 'email-address' as const },
    { label: 'Company Name', value: company, setter: setCompany, icon: 'briefcase-outline' as const, placeholder: 'Madarik Holdings', type: 'default' as const },
  ];

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#a5b4fc" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoLetter}>M</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join 2,400+ businesses on Madarik</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={15} color="#fca5a5" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {fields.map((f) => (
            <View key={f.label} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.inputWrap}>
                <Ionicons name={f.icon} size={16} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor="#475569"
                  keyboardType={f.type}
                  autoCapitalize={f.type === 'email-address' ? 'none' : 'words'}
                />
              </View>
            </View>
          ))}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 8 characters"
                placeholderTextColor="#475569"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signUpBtn, loading && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signUpBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.footerLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoLetter: { fontSize: 28, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94a3b8', fontFamily: 'Inter_400Regular' },

  form: { gap: 14, marginBottom: 28 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  errorText: { fontSize: 13, color: '#fca5a5', fontFamily: 'Inter_400Regular', flex: 1 },

  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#94a3b8', fontFamily: 'Inter_600SemiBold' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#fff', fontFamily: 'Inter_400Regular' },
  eyeBtn: { padding: 4 },

  signUpBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.7 },
  signUpBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  termsText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  termsLink: { color: '#818cf8', fontFamily: 'Inter_500Medium' },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14, color: '#64748b', fontFamily: 'Inter_400Regular' },
  footerLink: { fontSize: 14, color: '#818cf8', fontFamily: 'Inter_600SemiBold' },
});
