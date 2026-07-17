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
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';
import MadarikLogo from '@/components/MadarikLogo';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { mode } = useAppMode();
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const isPersonal = mode === 'personal';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
      router.replace('/(tabs)/');
    } catch {
      setError(isRTL ? 'بيانات غير صحيحة. حاول مرة أخرى.' : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Dark header */}
          <LinearGradient
            colors={['#04071a', '#0a0e27', '#130d3a', '#1a1060']}
            style={[styles.logoSection, { paddingTop: topPad + 20 }]}
          >
            <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(auth)/mode-select')}>
              <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={18} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>

            {/* Language toggle */}
            <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage} activeOpacity={0.7}>
              <Ionicons name="globe-outline" size={16} color="rgba(255,255,255,0.65)" />
              <Text style={styles.langLabel}>{language === 'en' ? 'عربي' : 'EN'}</Text>
            </TouchableOpacity>

            <MadarikLogo size="medium" />

            <View style={[styles.modeBadge, isPersonal && styles.modeBadgePersonal]}>
              <Ionicons name={isPersonal ? 'person' : 'briefcase'} size={11} color={isPersonal ? '#c084fc' : '#818cf8'} />
              <Text style={[styles.modeBadgeText, isPersonal && { color: '#c084fc' }]}>
                {isPersonal ? t('personalMode') : t('businessMode')}
              </Text>
            </View>
          </LinearGradient>

          {/* White bottom sheet */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <ScrollView
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.title, { textAlign: 'center', writingDirection: dir }]}>{t('loginTitle')}</Text>

              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="person-outline" size={16} color="#9ca3af" style={isRTL ? styles.inputIconRTL : styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { textAlign }]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder={t('loginUserPlaceholder')}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                  />
                </View>
                <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="lock-closed-outline" size={16} color="#9ca3af" style={isRTL ? styles.inputIconRTL : styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1, textAlign }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t('loginPassPlaceholder')}
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}
                    style={{ paddingVertical: 6, paddingHorizontal: 4 }}
                  >
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.rememberRow, isRTL && { flexDirection: 'row-reverse' }]}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={11} color="#fff" />}
                </View>
                <Text style={[styles.rememberText, { writingDirection: dir }]}>{t('loginRemember')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginBtn, loading && styles.btnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.loginBtnText}>{t('loginBtn')}</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={[styles.forgotText, { writingDirection: dir }]}>{t('loginForgot')}</Text>
              </TouchableOpacity>

              <View style={[styles.signupRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.signupPrompt, { writingDirection: dir }]}>{t('loginNoAccount')}</Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
                  <Text style={[styles.signupLink, { writingDirection: dir }]}>{t('loginSignUp')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity style={[styles.contactRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="call-outline" size={12} color="#6b7280" />
                  <Text style={[styles.contactText, { writingDirection: dir }]}> {t('loginContact')}</Text>
                </TouchableOpacity>
                <Text style={[styles.copyright, { writingDirection: dir }]}>{t('loginCopyright')}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },

  logoSection: { alignItems: 'center', paddingBottom: 36, position: 'relative' },
  backBtn: { position: 'absolute', top: 56, left: 16, width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  langBtn: { position: 'absolute', top: 56, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  langLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_600SemiBold' },
  modeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: 'rgba(129,140,248,0.4)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  modeBadgePersonal: { borderColor: 'rgba(192,132,252,0.4)' },
  modeBadgeText: { fontSize: 11, color: '#818cf8', fontFamily: 'Inter_500Medium' },

  sheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -16 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  formContent: { paddingHorizontal: 28, paddingBottom: 40 },

  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 8, marginBottom: 22, fontFamily: 'Inter_700Bold' },

  errorBanner: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, marginBottom: 12 },
  errorText: { fontSize: 13, color: '#ef4444', textAlign: 'center', fontFamily: 'Inter_400Regular' },

  inputGroup: { gap: 12, marginBottom: 14 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, height: 50 },
  inputIcon: { marginRight: 10 },
  inputIconRTL: { marginLeft: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },

  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#9ca3af', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkboxChecked: { backgroundColor: '#1e40af', borderColor: '#1e40af' },
  rememberText: { fontSize: 13, color: '#6b7280', fontFamily: 'Inter_400Regular' },

  loginBtn: { backgroundColor: '#1e2d6e', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 16 },
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
