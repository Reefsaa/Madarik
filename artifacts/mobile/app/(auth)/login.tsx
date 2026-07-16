import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import MadarikLogo from '@/components/MadarikLogo';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
      router.replace('/(auth)/mode-select');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Dark header with logo */}
          <LinearGradient
            colors={['#0a0e27', '#1a1060', '#2d1b8e']}
            style={[styles.logoSection, { paddingTop: topPad + 36 }]}
          >
            <View style={styles.globeRow}>
              <Ionicons name="globe-outline" size={22} color="rgba(255,255,255,0.5)" />
            </View>
            <MadarikLogo size="medium" textColor="#c7d2fe" />
          </LinearGradient>

          {/* White bottom sheet */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <ScrollView
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Log in</Text>

              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <View style={styles.inputWrap}>
                  <Ionicons name="person-outline" size={16} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username or ID"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    autoComplete="username"
                  />
                </View>
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={16} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember me */}
              <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)} activeOpacity={0.7}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={11} color="#fff" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginBtn, loading && styles.btnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.loginBtnText}>Log in</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Your Credentials?</Text>
              </TouchableOpacity>

              <View style={styles.signupRow}>
                <Text style={styles.signupPrompt}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
                  <Text style={styles.signupLink}> Sign up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.contactRow}>
                  <Ionicons name="call-outline" size={12} color="#6b7280" />
                  <Text style={styles.contactText}> CONTACT US</Text>
                </TouchableOpacity>
                <Text style={styles.copyright}>Madarik 2026. All rights reserved</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1060' },

  logoSection: { alignItems: 'center', paddingBottom: 48, position: 'relative' },
  globeRow: { position: 'absolute', top: 56, right: 20 },

  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#d1d5db',
    alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  formContent: { paddingHorizontal: 28, paddingBottom: 40 },

  title: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center', marginTop: 8, marginBottom: 24, fontFamily: 'Inter_700Bold' },

  errorBanner: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, marginBottom: 14 },
  errorText: { fontSize: 13, color: '#ef4444', textAlign: 'center', fontFamily: 'Inter_400Regular' },

  inputGroup: { gap: 12, marginBottom: 14 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, paddingHorizontal: 14, height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },

  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: {
    width: 18, height: 18, borderRadius: 4, borderWidth: 1.5,
    borderColor: '#9ca3af', marginRight: 8, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#1e40af', borderColor: '#1e40af' },
  rememberText: { fontSize: 13, color: '#6b7280', fontFamily: 'Inter_400Regular' },

  loginBtn: {
    backgroundColor: '#1e2d6e', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginBottom: 16,
  },
  btnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  forgotBtn: { alignItems: 'center', marginBottom: 16 },
  forgotText: { fontSize: 13, color: '#1e40af', textDecorationLine: 'underline', fontFamily: 'Inter_400Regular' },

  signupRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  signupPrompt: { fontSize: 14, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  signupLink: { fontSize: 14, fontWeight: '700', color: '#1e40af', fontFamily: 'Inter_700Bold' },

  footer: { alignItems: 'center', gap: 6 },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  contactText: { fontSize: 11, color: '#6b7280', letterSpacing: 0.5, fontFamily: 'Inter_500Medium' },
  copyright: { fontSize: 10, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
});
