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

// ─── Personal form fields ─────────────────────────────────────────────────────
interface PersonalForm {
  nationalId: string; mobile: string; email: string;
  firstName: string; lastName: string; username: string; password: string;
}

// ─── Business form fields ─────────────────────────────────────────────────────
interface BusinessForm {
  crNumber: string; businessEmail: string; companyName: string;
  repName: string; mobile: string; password: string;
}

function InputRow({ label, placeholder, value, onChange, keyType, secure, showToggle, onEye, isRTL }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; keyType?: any;
  secure?: boolean; showToggle?: boolean; onEye?: () => void; isRTL?: boolean;
}) {
  return (
    <View style={{ marginBottom: 2 }}>
      <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{label}</Text>
      <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
        <TextInput
          style={[styles.input, isRTL && { textAlign: 'right' }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={keyType || 'default'}
          secureTextEntry={secure}
          autoCapitalize="none"
        />
        {showToggle && (
          <TouchableOpacity onPress={onEye}>
            <Ionicons name={secure ? 'eye-outline' : 'eye-off-outline'} size={16} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const { mode } = useAppMode();
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const isBusiness = mode === 'business';
  const dir = isRTL ? 'rtl' : 'ltr';

  const [personal, setPersonal] = useState<PersonalForm>({ nationalId: '', mobile: '', email: '', firstName: '', lastName: '', username: '', password: '' });
  const [business, setBusiness] = useState<BusinessForm>({ crNumber: '', businessEmail: '', companyName: '', repName: '', mobile: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setP = (k: keyof PersonalForm) => (v: string) => setPersonal(p => ({ ...p, [k]: v }));
  const setB = (k: keyof BusinessForm) => (v: string) => setBusiness(b => ({ ...b, [k]: v }));

  const handleSignup = async () => {
    if (!agreed) { setError('Please agree to the Terms and Conditions'); return; }
    setError('');
    setLoading(true);
    try {
      if (isBusiness) {
        const { crNumber, businessEmail, companyName, repName, password } = business;
        if (!crNumber || !businessEmail || !companyName || !repName || !password) {
          setError('Please fill in all required fields'); setLoading(false); return;
        }
        await signup(repName.trim(), businessEmail.trim(), password, companyName.trim());
      } else {
        const { firstName, lastName, email, password, username } = personal;
        if (!firstName || !lastName || !email || !password || !username) {
          setError('Please fill in all required fields'); setLoading(false); return;
        }
        await signup(`${firstName.trim()} ${lastName.trim()}`, email.trim(), password, username.trim());
      }
      router.replace('/(tabs)/');
    } catch {
      setError('Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#04071a', '#0a0e27', '#130d3a', '#1a1060']} style={[styles.logoSection, { paddingTop: topPad + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(auth)/mode-select')}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={18} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
          <Ionicons name="globe-outline" size={16} color="rgba(255,255,255,0.65)" />
          <Text style={styles.langLabel}>{language === 'en' ? 'عربي' : 'EN'}</Text>
        </TouchableOpacity>
        <MadarikLogo size="medium" />
        <View style={[styles.modeBadge, isBusiness ? styles.modeBadgeBusiness : styles.modeBadgePersonal]}>
          <Ionicons name={isBusiness ? 'briefcase' : 'person'} size={11} color={isBusiness ? '#818cf8' : '#c084fc'} />
          <Text style={[styles.modeBadgeText, { color: isBusiness ? '#818cf8' : '#c084fc' }]}>
            {isBusiness ? t('businessMode') : t('personalMode')}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { writingDirection: dir }]}>
            {isBusiness ? 'Business Registration' : t('signupTitle')}
          </Text>

          {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}

          {isBusiness ? (
            /* ── Business fields ── */
            <>
              <InputRow isRTL={isRTL} label="Commercial Registration Number (CR)" placeholder="Enter CR number" value={business.crNumber} onChange={setB('crNumber')} keyType="numeric" />
              <InputRow isRTL={isRTL} label="Business Email" placeholder="company@example.sa" value={business.businessEmail} onChange={setB('businessEmail')} keyType="email-address" />
              <InputRow isRTL={isRTL} label="Company Name" placeholder="Enter company name" value={business.companyName} onChange={setB('companyName')} />
              <InputRow isRTL={isRTL} label="Authorized Representative Name" placeholder="Full legal name" value={business.repName} onChange={setB('repName')} />
              <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>Mobile Number</Text>
              <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.dialCode}>+966</Text>
                <TextInput style={[styles.input, isRTL && { textAlign: 'right' }]} value={business.mobile} onChangeText={setB('mobile')} placeholder="" placeholderTextColor="#9ca3af" keyboardType="phone-pad" />
              </View>
              <InputRow isRTL={isRTL} label="Password" placeholder="Create a strong password" value={business.password} onChange={setB('password')} secure={!showPass} showToggle onEye={() => setShowPass(!showPass)} />
            </>
          ) : (
            /* ── Personal fields ── */
            <>
              <InputRow isRTL={isRTL} label={t('signupNationalId')} placeholder={t('signupNationalIdPh')} value={personal.nationalId} onChange={setP('nationalId')} keyType="numeric" />
              <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{t('signupMobile')}</Text>
              <View style={[styles.inputWrap, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.dialCode}>+966</Text>
                <TextInput style={[styles.input, isRTL && { textAlign: 'right' }]} value={personal.mobile} onChangeText={setP('mobile')} placeholder="" placeholderTextColor="#9ca3af" keyboardType="phone-pad" />
              </View>
              <InputRow isRTL={isRTL} label={t('signupEmail')} placeholder={t('signupEmailPh')} value={personal.email} onChange={setP('email')} keyType="email-address" />
              <View style={styles.twoCol}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{t('signupFirstName')}</Text>
                  <View style={[styles.inputWrap, { marginBottom: 0 }]}>
                    <TextInput style={styles.input} value={personal.firstName} onChangeText={setP('firstName')} placeholder={t('signupFirstName')} placeholderTextColor="#9ca3af" />
                  </View>
                </View>
                <View style={{ width: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{t('signupLastName')}</Text>
                  <View style={[styles.inputWrap, { marginBottom: 0 }]}>
                    <TextInput style={styles.input} value={personal.lastName} onChangeText={setP('lastName')} placeholder={t('signupLastName')} placeholderTextColor="#9ca3af" />
                  </View>
                </View>
              </View>
              <InputRow isRTL={isRTL} label={t('signupUsername')} placeholder={t('signupUsernamePh')} value={personal.username} onChange={setP('username')} />
              <InputRow isRTL={isRTL} label={t('signupPassword')} placeholder={t('signupPasswordPh')} value={personal.password} onChange={setP('password')} secure={!showPass} showToggle onEye={() => setShowPass(!showPass)} />
            </>
          )}

          <TouchableOpacity style={[styles.agreeRow, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => setAgreed(!agreed)} activeOpacity={0.7}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={11} color="#fff" />}
            </View>
            <Text style={[styles.agreeText, isRTL && { textAlign: 'right' }]}>{t('signupAgree')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signupBtn, loading && styles.btnDisabled]} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.signupBtnText}>{isBusiness ? 'Register Business' : t('signupBtn')}</Text>
            )}
          </TouchableOpacity>

          <View style={[styles.loginRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.loginPrompt}>{t('signupHaveAccount')}</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLink}>{t('signupLogin')}</Text>
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
  modeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  modeBadgeBusiness: { borderColor: 'rgba(129,140,248,0.4)' },
  modeBadgePersonal: { borderColor: 'rgba(192,132,252,0.4)' },
  modeBadgeText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  sheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', alignSelf: 'center', marginTop: 12, marginBottom: 2 },
  formContent: { paddingHorizontal: 22, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 6, marginBottom: 14, fontFamily: 'Inter_700Bold', textAlign: 'center' },
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
