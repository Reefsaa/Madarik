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
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';
import MadarikLogo from '@/components/MadarikLogo';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const { mode } = useAppMode();
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const isPersonal = mode === 'personal';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';

  const [form, setForm] = useState({ nationalId: '', mobile: '', email: '', firstName: '', lastName: '', username: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSignup = async () => {
    const { firstName, lastName, email, password, username } = form;
    if (!firstName || !lastName || !email || !password || !username) {
      setError(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }
    if (!agreed) { setError(isRTL ? 'يرجى الموافقة على الشروط والأحكام' : 'Please agree to the Terms and Conditions'); return; }
    setError('');
    setLoading(true);
    try {
      await signup(`${firstName.trim()} ${lastName.trim()}`, email.trim(), password, username.trim());
      router.replace('/(tabs)/');
    } catch {
      setError(isRTL ? 'فشل إنشاء الحساب. حاول مرة أخرى.' : 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, ph, value, onCh, keyType, secure, onEye }: any) => (
    <View style={{ marginBottom: 2 }}>
      <Text style={[styles.fieldLabel, { writingDirection: dir, textAlign }]}>{label}</Text>
      <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
        {ph === '+966' ? (
          <Text style={[styles.dialCode, isRTL && { marginLeft: 8, marginRight: 0 }]}>+966</Text>
        ) : null}
        <TextInput
          style={[styles.input, { textAlign }]}
          value={value}
          onChangeText={onCh}
          placeholder={ph !== '+966' ? ph : ''}
          placeholderTextColor="#9ca3af"
          keyboardType={keyType || 'default'}
          secureTextEntry={secure === true}
          autoCapitalize="none"
        />
        {onEye ? (
          <TouchableOpacity onPress={onEye}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#04071a', '#0a0e27', '#130d3a', '#1a1060']} style={[styles.logoSection, { paddingTop: topPad + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(auth)/mode-select')}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={18} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
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

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { writingDirection: dir, textAlign: 'center' }]}>{t('signupTitle')}</Text>
          {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}

          <Field label={t('signupNationalId')} ph={t('signupNationalIdPh')} value={form.nationalId} onCh={set('nationalId')} keyType="numeric" />
          <Field label={t('signupMobile')} ph="+966" value={form.mobile} onCh={set('mobile')} keyType="phone-pad" />
          <Field label={t('signupEmail')} ph={t('signupEmailPh')} value={form.email} onCh={set('email')} keyType="email-address" />

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { writingDirection: dir, textAlign }]}>{t('signupFirstName')}</Text>
              <View style={[styles.inputWrap, { marginBottom: 0 }]}>
                <TextInput style={[styles.input, { textAlign }]} value={form.firstName} onChangeText={set('firstName')} placeholder={t('signupFirstName')} placeholderTextColor="#9ca3af" />
              </View>
            </View>
            <View style={{ width: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { writingDirection: dir, textAlign }]}>{t('signupLastName')}</Text>
              <View style={[styles.inputWrap, { marginBottom: 0 }]}>
                <TextInput style={[styles.input, { textAlign }]} value={form.lastName} onChangeText={set('lastName')} placeholder={t('signupLastName')} placeholderTextColor="#9ca3af" />
              </View>
            </View>
          </View>

          <Field label={t('signupUsername')} ph={t('signupUsernamePh')} value={form.username} onCh={set('username')} />
          <Field label={t('signupPassword')} ph={t('signupPasswordPh')} value={form.password} onCh={set('password')} secure={!showPass} onEye={() => setShowPass(!showPass)} />

          <TouchableOpacity style={[styles.agreeRow, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => setAgreed(!agreed)} activeOpacity={0.7}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={11} color="#fff" />}
            </View>
            <Text style={[styles.agreeText, { writingDirection: dir, textAlign }]}>{t('signupAgree')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signupBtn, loading && styles.btnDisabled]} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupBtnText}>{t('signupBtn')}</Text>}
          </TouchableOpacity>

          <View style={[styles.loginRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.loginPrompt, { writingDirection: dir }]}>{t('signupHaveAccount')}</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={[styles.loginLink, { writingDirection: dir }]}>{t('signupLogin')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
  logoSection: { alignItems: 'center', paddingBottom: 28, position: 'relative' },
  backBtn: { position: 'absolute', top: 44, left: 16, width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  langBtn: { position: 'absolute', top: 44, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  langLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_600SemiBold' },
  modeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: 'rgba(129,140,248,0.4)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  modeBadgePersonal: { borderColor: 'rgba(192,132,252,0.4)' },
  modeBadgeText: { fontSize: 11, color: '#818cf8', fontFamily: 'Inter_500Medium' },
  sheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', alignSelf: 'center', marginTop: 12, marginBottom: 2 },
  formContent: { paddingHorizontal: 22, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 6, marginBottom: 14, fontFamily: 'Inter_700Bold' },
  errorBanner: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, marginBottom: 10 },
  errorText: { fontSize: 12, color: '#ef4444', textAlign: 'center', fontFamily: 'Inter_400Regular' },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: '#374151', marginBottom: 4, marginTop: 10, fontFamily: 'Inter_600SemiBold' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, height: 46 },
  dialCode: { fontSize: 13, color: '#374151', fontFamily: 'Inter_500Medium', marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#111827', fontFamily: 'Inter_400Regular' },
  twoCol: { flexDirection: 'row', marginBottom: 2, marginTop: 2 },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, marginBottom: 14, gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#9ca3af', marginTop: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkboxChecked: { backgroundColor: '#1e40af', borderColor: '#1e40af' },
  agreeText: { flex: 1, fontSize: 11, color: '#6b7280', lineHeight: 16, fontFamily: 'Inter_400Regular' },
  signupBtn: { backgroundColor: '#1e2d6e', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  btnDisabled: { opacity: 0.7 },
  signupBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginPrompt: { fontSize: 13, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  loginLink: { fontSize: 13, fontWeight: '700', color: '#1e40af', fontFamily: 'Inter_700Bold' },
});
