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
import { useAuth, ApiError } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';
import MadarikLogo from '@/components/MadarikLogo';

// ─── Regex ────────────────────────────────────────────────────────────────────
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_RE   = /^\d{10}$/;
const NATID_RE    = /^\d{10,}$/;
const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

// ─── Form interfaces ──────────────────────────────────────────────────────────
interface PersonalForm {
  nationalId: string; mobile: string; email: string;
  firstName: string; lastName: string; username: string; password: string;
}
interface BusinessForm {
  crNumber: string; businessEmail: string; companyName: string;
  repName: string; mobile: string; password: string;
}

// ─── InputRow with inline error ───────────────────────────────────────────────
function InputRow({
  label, placeholder, value, onChange, keyType,
  secure, showToggle, onEye, isRTL, error, onFocusClear,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; keyType?: any;
  secure?: boolean; showToggle?: boolean; onEye?: () => void;
  isRTL?: boolean; error?: string; onFocusClear?: () => void;
}) {
  const hasErr = !!error;
  return (
    <View style={{ marginBottom: 2 }}>
      <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{label}</Text>
      <View style={[
        styles.inputWrap,
        hasErr && styles.inputWrapError,
        isRTL && { flexDirection: 'row-reverse' },
      ]}>
        <TextInput
          style={[styles.input, isRTL && { textAlign: 'right' }]}
          value={value}
          onChangeText={v => { onChange(v); onFocusClear?.(); }}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={keyType ?? 'default'}
          secureTextEntry={secure}
          autoCapitalize="none"
        />
        {showToggle && (
          <TouchableOpacity
            onPress={onEye}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ padding: 6 }}
          >
            <Ionicons name={secure ? 'eye-outline' : 'eye-off-outline'} size={18} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
      {hasErr && (
        <View style={[styles.fieldErrRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="alert-circle-outline" size={12} color="#ef4444" style={{ marginTop: 1 }} />
          <Text style={[styles.fieldErrText, isRTL && { textAlign: 'right' }]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const { mode } = useAppMode();
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const isBusiness = mode === 'business';
  const dir = isRTL ? 'rtl' : 'ltr';

  const [personal, setPersonal] = useState<PersonalForm>({
    nationalId: '', mobile: '', email: '',
    firstName: '', lastName: '', username: '', password: '',
  });
  const [business, setBusiness] = useState<BusinessForm>({
    crNumber: '', businessEmail: '', companyName: '', repName: '', mobile: '', password: '',
  });
  const [agreed, setAgreed]       = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setP = (k: keyof PersonalForm) => (v: string) => setPersonal(p => ({ ...p, [k]: v }));
  const setB = (k: keyof BusinessForm) => (v: string) => setBusiness(b => ({ ...b, [k]: v }));
  const clearField = (key: string) => () =>
    setFieldErrors(prev => { const n = { ...prev }; delete n[key]; return n; });

  // ─── Validation helpers ──────────────────────────────────────────────────
  function pwErrors(pw: string): string | null {
    if (!pw)               return t('validRequired');
    if (pw.length < 8)     return t('validPassLen');
    if (!/[A-Z]/.test(pw)) return t('validPassUpper');
    if (!/[a-z]/.test(pw)) return t('validPassLower');
    if (!/[0-9]/.test(pw)) return t('validPassDigit');
    if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~]/.test(pw)) return t('validPassSpecial');
    return null;
  }

  function validatePersonal(): Record<string, string> {
    const e: Record<string, string> = {};
    const p = personal;

    if (!p.nationalId.trim())
      e.nationalId = t('validRequired');
    else if (!/^\d+$/.test(p.nationalId))
      e.nationalId = t('validNationalIdDigits');
    else if (!NATID_RE.test(p.nationalId))
      e.nationalId = t('validNationalIdMin');

    if (!p.mobile.trim())
      e.mobile = t('validRequired');
    else if (!/^\d+$/.test(p.mobile))
      e.mobile = t('validMobileDigits');
    else if (!MOBILE_RE.test(p.mobile))
      e.mobile = t('validMobileLen');

    if (!p.email.trim())
      e.email = t('validRequired');
    else if (!EMAIL_RE.test(p.email.trim()))
      e.email = t('validEmailFormat');

    if (!p.firstName.trim()) e.firstName = t('validRequired');
    if (!p.lastName.trim())  e.lastName  = t('validRequired');

    if (!p.username.trim())
      e.username = t('validRequired');
    else if (!USERNAME_RE.test(p.username.trim()))
      e.username = t('validUsernameChars');

    const pw = pwErrors(p.password);
    if (pw) e.password = pw;

    return e;
  }

  function validateBusiness(): Record<string, string> {
    const e: Record<string, string> = {};
    const b = business;

    if (!b.crNumber.trim())      e.crNumber     = t('validRequired');
    if (!b.businessEmail.trim()) e.businessEmail = t('validRequired');
    else if (!EMAIL_RE.test(b.businessEmail.trim())) e.businessEmail = t('validEmailFormat');
    if (!b.companyName.trim())   e.companyName   = t('validRequired');
    if (!b.repName.trim())       e.repName       = t('validRequired');

    if (!b.mobile.trim())
      e.mobile = t('validRequired');
    else if (!/^\d+$/.test(b.mobile))
      e.mobile = t('validMobileDigits');
    else if (!MOBILE_RE.test(b.mobile))
      e.mobile = t('validMobileLen');

    const pw = pwErrors(b.password);
    if (pw) e.password = pw;

    return e;
  }

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!agreed) { setError(isRTL ? 'يرجى الموافقة على الشروط والأحكام' : 'Please agree to the Terms and Conditions'); return; }
    setError('');

    const errs = isBusiness ? validateBusiness() : validatePersonal();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      if (isBusiness) {
        const { crNumber, businessEmail, companyName, repName, mobile, password } = business;
        await signup(repName.trim(), businessEmail.trim(), password, companyName.trim(), {
          mobile: mobile.trim(),
          crNumber: crNumber.trim(),
        });
      } else {
        const { firstName, lastName, email, password, username, nationalId, mobile } = personal;
        await signup(
          `${firstName.trim()} ${lastName.trim()}`,
          email.trim(),
          password,
          '',
          { nationalId: nationalId.trim(), mobile: mobile.trim(), username: username.trim() },
        );
      }
      router.replace('/(tabs)/');
    } catch (err) {
      // ApiError: put on field if backend returned a field reference
      if (err instanceof ApiError && err.field) {
        const fieldKey = err.field === 'businessEmail' || err.field === 'email' ? (isBusiness ? 'businessEmail' : 'email') : err.field;
        // Map server field names to form field names
        const translated = translateServerErr(err.message);
        setFieldErrors(prev => ({ ...prev, [fieldKey]: translated }));
      } else {
        setError(err instanceof Error ? err.message : isRTL ? 'فشل إنشاء الحساب. حاول مرة أخرى.' : 'Account creation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Map English server messages to the current language translation key
  function translateServerErr(msg: string): string {
    if (msg.includes('email') && msg.includes('already')) return t('validEmailTaken');
    if (msg.includes('username') && msg.includes('taken'))  return t('validUsernameTaken');
    if (msg.includes('National ID'))                        return t('validNationalIdTaken');
    if (msg.includes('mobile'))                             return t('validMobileTaken');
    return msg;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#04071a', '#0a0e27', '#130d3a', '#1a1060']}
        style={[styles.logoSection, { paddingTop: topPad + 16 }]}
      >
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
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { writingDirection: dir }]}>
            {isBusiness ? (isRTL ? 'تسجيل الأعمال' : 'Business Registration') : t('signupTitle')}
          </Text>

          {/* General error banner (for non-field errors only) */}
          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="warning-outline" size={14} color="#ef4444" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {isBusiness ? (
            /* ── Business fields ─────────────────────────────────────────── */
            <>
              <InputRow isRTL={isRTL}
                label={isRTL ? 'رقم السجل التجاري (CR)' : 'Commercial Registration Number (CR)'}
                placeholder={isRTL ? 'أدخل رقم السجل' : 'Enter CR number'}
                value={business.crNumber} onChange={setB('crNumber')}
                keyType="numeric" error={fieldErrors.crNumber}
                onFocusClear={clearField('crNumber')} />

              <InputRow isRTL={isRTL}
                label={isRTL ? 'البريد الإلكتروني للشركة' : 'Business Email'}
                placeholder={isRTL ? 'company@example.sa' : 'company@example.sa'}
                value={business.businessEmail} onChange={setB('businessEmail')}
                keyType="email-address" error={fieldErrors.businessEmail}
                onFocusClear={clearField('businessEmail')} />

              <InputRow isRTL={isRTL}
                label={isRTL ? 'اسم الشركة' : 'Company Name'}
                placeholder={isRTL ? 'أدخل اسم الشركة' : 'Enter company name'}
                value={business.companyName} onChange={setB('companyName')}
                error={fieldErrors.companyName} onFocusClear={clearField('companyName')} />

              <InputRow isRTL={isRTL}
                label={isRTL ? 'اسم المفوّض' : 'Authorized Representative Name'}
                placeholder={isRTL ? 'الاسم القانوني الكامل' : 'Full legal name'}
                value={business.repName} onChange={setB('repName')}
                error={fieldErrors.repName} onFocusClear={clearField('repName')} />

              <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>
                {isRTL ? 'رقم الجوال' : 'Mobile Number'}
              </Text>
              <View style={[
                styles.inputWrap,
                fieldErrors.mobile && styles.inputWrapError,
                isRTL && { flexDirection: 'row-reverse' },
              ]}>
                <Text style={styles.dialCode}>+966</Text>
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  value={business.mobile}
                  onChangeText={v => { setB('mobile')(v.replace(/\D/g, '').slice(0, 10)); clearField('mobile')(); }}
                  placeholder=""
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {fieldErrors.mobile && (
                <View style={[styles.fieldErrRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="alert-circle-outline" size={12} color="#ef4444" style={{ marginTop: 1 }} />
                  <Text style={styles.fieldErrText}>{fieldErrors.mobile}</Text>
                </View>
              )}

              <InputRow isRTL={isRTL}
                label={isRTL ? 'كلمة المرور' : 'Password'}
                placeholder={isRTL ? 'كلمة مرور قوية' : 'Create a strong password'}
                value={business.password} onChange={setB('password')}
                secure={!showPass} showToggle onEye={() => setShowPass(!showPass)}
                error={fieldErrors.password} onFocusClear={clearField('password')} />

              {/* Password strength hint */}
              <PasswordHint password={business.password} isRTL={isRTL} />
            </>
          ) : (
            /* ── Personal fields ─────────────────────────────────────────── */
            <>
              <InputRow isRTL={isRTL}
                label={t('signupNationalId')} placeholder={t('signupNationalIdPh')}
                value={personal.nationalId}
                onChange={v => setP('nationalId')(v.replace(/\D/g, '').slice(0, 12))}
                keyType="numeric" error={fieldErrors.nationalId}
                onFocusClear={clearField('nationalId')} />

              <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{t('signupMobile')}</Text>
              <View style={[
                styles.inputWrap,
                fieldErrors.mobile && styles.inputWrapError,
                isRTL && { flexDirection: 'row-reverse' },
              ]}>
                <Text style={styles.dialCode}>+966</Text>
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  value={personal.mobile}
                  onChangeText={v => { setP('mobile')(v.replace(/\D/g, '').slice(0, 10)); clearField('mobile')(); }}
                  placeholder=""
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {fieldErrors.mobile && (
                <View style={[styles.fieldErrRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="alert-circle-outline" size={12} color="#ef4444" style={{ marginTop: 1 }} />
                  <Text style={styles.fieldErrText}>{fieldErrors.mobile}</Text>
                </View>
              )}

              <InputRow isRTL={isRTL}
                label={t('signupEmail')} placeholder={t('signupEmailPh')}
                value={personal.email} onChange={setP('email')}
                keyType="email-address" error={fieldErrors.email}
                onFocusClear={clearField('email')} />

              {/* First + Last name row */}
              <View style={styles.twoCol}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{t('signupFirstName')}</Text>
                  <View style={[
                    styles.inputWrap, { marginBottom: 0 },
                    fieldErrors.firstName && styles.inputWrapError,
                  ]}>
                    <TextInput
                      style={styles.input}
                      value={personal.firstName}
                      onChangeText={v => { setP('firstName')(v); clearField('firstName')(); }}
                      placeholder={t('signupFirstName')}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  {fieldErrors.firstName && (
                    <Text style={styles.fieldErrText}>{fieldErrors.firstName}</Text>
                  )}
                </View>
                <View style={{ width: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, isRTL && { textAlign: 'right' }]}>{t('signupLastName')}</Text>
                  <View style={[
                    styles.inputWrap, { marginBottom: 0 },
                    fieldErrors.lastName && styles.inputWrapError,
                  ]}>
                    <TextInput
                      style={styles.input}
                      value={personal.lastName}
                      onChangeText={v => { setP('lastName')(v); clearField('lastName')(); }}
                      placeholder={t('signupLastName')}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  {fieldErrors.lastName && (
                    <Text style={styles.fieldErrText}>{fieldErrors.lastName}</Text>
                  )}
                </View>
              </View>

              <InputRow isRTL={isRTL}
                label={t('signupUsername')} placeholder={t('signupUsernamePh')}
                value={personal.username} onChange={setP('username')}
                error={fieldErrors.username} onFocusClear={clearField('username')} />

              <InputRow isRTL={isRTL}
                label={t('signupPassword')} placeholder={t('signupPasswordPh')}
                value={personal.password} onChange={setP('password')}
                secure={!showPass} showToggle onEye={() => setShowPass(!showPass)}
                error={fieldErrors.password} onFocusClear={clearField('password')} />

              {/* Password strength hint */}
              <PasswordHint password={personal.password} isRTL={isRTL} />
            </>
          )}

          {/* Terms */}
          <TouchableOpacity
            style={[styles.agreeRow, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={11} color="#fff" />}
            </View>
            <Text style={[styles.agreeText, isRTL && { textAlign: 'right' }]}>{t('signupAgree')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signupBtn, loading && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupBtnText}>
                {isBusiness ? (isRTL ? 'تسجيل الشركة' : 'Register Business') : t('signupBtn')}
              </Text>
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

// ─── Password strength checklist ──────────────────────────────────────────────
function PasswordHint({ password, isRTL }: { password: string; isRTL: boolean }) {
  if (!password) return null;
  const rules = [
    { ok: password.length >= 8,     en: '8+ characters',      ar: '٨ أحرف على الأقل'        },
    { ok: /[A-Z]/.test(password),   en: 'Uppercase (A-Z)',     ar: 'حرف كبير (A-Z)'           },
    { ok: /[a-z]/.test(password),   en: 'Lowercase (a-z)',     ar: 'حرف صغير (a-z)'           },
    { ok: /[0-9]/.test(password),   en: 'Number (0-9)',        ar: 'رقم (0-9)'                 },
    { ok: /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~]/.test(password),
                                     en: 'Special character',   ar: 'رمز خاص (!@#$…)'          },
  ];
  return (
    <View style={hint.wrap}>
      {rules.map((r, i) => (
        <View key={i} style={[hint.row, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons
            name={r.ok ? 'checkmark-circle' : 'ellipse-outline'}
            size={13}
            color={r.ok ? '#22c55e' : '#d1d5db'}
          />
          <Text style={[hint.label, { color: r.ok ? '#22c55e' : '#9ca3af' }]}>
            {isRTL ? r.ar : r.en}
          </Text>
        </View>
      ))}
    </View>
  );
}

const hint = StyleSheet.create({
  wrap:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6, marginBottom: 8, paddingHorizontal: 2 },
  row:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
  logoSection: { alignItems: 'center', paddingBottom: 28, position: 'relative' },
  backBtn: {
    position: 'absolute', top: 44, left: 16,
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  langBtn: {
    position: 'absolute', top: 44, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  langLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_600SemiBold' },
  modeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8,
  },
  modeBadgeBusiness: { borderColor: 'rgba(129,140,248,0.4)' },
  modeBadgePersonal: { borderColor: 'rgba(192,132,252,0.4)' },
  modeBadgeText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  sheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', alignSelf: 'center', marginTop: 12, marginBottom: 2 },
  formContent: { paddingHorizontal: 22, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 6, marginBottom: 14, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, marginBottom: 10 },
  errorText: { flex: 1, fontSize: 12, color: '#ef4444', fontFamily: 'Inter_400Regular' },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: '#374151', marginBottom: 4, marginTop: 10, fontFamily: 'Inter_600SemiBold' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, height: 46 },
  inputWrapError: { borderColor: '#ef4444', backgroundColor: '#fff5f5' },
  dialCode: { fontSize: 13, color: '#374151', fontFamily: 'Inter_500Medium', marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#111827', fontFamily: 'Inter_400Regular' },
  fieldErrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginTop: 4, marginBottom: 2 },
  fieldErrText: { flex: 1, fontSize: 11, color: '#ef4444', fontFamily: 'Inter_400Regular', lineHeight: 15 },
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
