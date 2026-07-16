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
import MadarikLogo from '@/components/MadarikLogo';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [form, setForm] = useState({
    nationalId: '', mobile: '', email: '',
    firstName: '', lastName: '', username: '', password: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSignup = async () => {
    const { firstName, lastName, email, password, username } = form;
    if (!firstName || !lastName || !email || !password || !username) {
      setError('Please fill in all required fields');
      return;
    }
    if (!agreed) { setError('Please agree to the Terms and Conditions'); return; }
    setError('');
    setLoading(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`;
      await signup(name, email.trim(), password, username.trim());
      router.replace('/(auth)/mode-select');
    } catch {
      setError('Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1060', '#2d1b8e']}
        style={[styles.logoSection, { paddingTop: topPad + 24 }]}
      >
        <View style={styles.globeRow}>
          <Ionicons name="globe-outline" size={22} color="rgba(255,255,255,0.5)" />
        </View>
        <MadarikLogo size="medium" textColor="#c7d2fe" />
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Sign up</Text>
          {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}

          <Text style={styles.fieldLabel}>National id / Iqama number</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="card-outline" size={15} color="#9ca3af" style={styles.icon} />
            <TextInput style={styles.input} value={form.nationalId} onChangeText={set('nationalId')} placeholder="Fill your ID/Iqama" placeholderTextColor="#9ca3af" keyboardType="numeric" />
          </View>

          <Text style={styles.fieldLabel}>Mobile Number</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.dialCode}>+966</Text>
            <TextInput style={styles.input} value={form.mobile} onChangeText={set('mobile')} placeholder="" placeholderTextColor="#9ca3af" keyboardType="phone-pad" />
          </View>

          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={15} color="#9ca3af" style={styles.icon} />
            <TextInput style={styles.input} value={form.email} onChangeText={set('email')} placeholder="Fill your Email" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>First Name</Text>
              <View style={[styles.inputWrap, { marginBottom: 0 }]}>
                <TextInput style={styles.input} value={form.firstName} onChangeText={set('firstName')} placeholder="First Name" placeholderTextColor="#9ca3af" />
              </View>
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Last Name</Text>
              <View style={[styles.inputWrap, { marginBottom: 0 }]}>
                <TextInput style={styles.input} value={form.lastName} onChangeText={set('lastName')} placeholder="Last Name" placeholderTextColor="#9ca3af" />
              </View>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Username</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={15} color="#9ca3af" style={styles.icon} />
            <TextInput style={styles.input} value={form.username} onChangeText={set('username')} placeholder="Fill your Username" placeholderTextColor="#9ca3af" autoCapitalize="none" />
          </View>

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputWrap}>
            <TextInput style={[styles.input, { flex: 1 }]} value={form.password} onChangeText={set('password')} placeholder="Fill your password" placeholderTextColor="#9ca3af" secureTextEntry={!showPass} />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.agreeRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.7}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={11} color="#fff" />}
            </View>
            <Text style={styles.agreeText}>
              I Agree to the Terms And Conditions and confirm that I have read and understood the Privacy Notice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signupBtn, loading && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupBtnText}>Sign up</Text>}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLink}> Log-in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1060' },
  logoSection: { alignItems: 'center', paddingBottom: 40, position: 'relative' },
  globeRow: { position: 'absolute', top: 44, right: 20 },
  sheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', alignSelf: 'center', marginTop: 12, marginBottom: 2 },
  formContent: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center', marginTop: 6, marginBottom: 16, fontFamily: 'Inter_700Bold' },
  errorBanner: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, marginBottom: 12 },
  errorText: { fontSize: 12, color: '#ef4444', textAlign: 'center', fontFamily: 'Inter_400Regular' },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 5, marginTop: 10, fontFamily: 'Inter_600SemiBold' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, height: 46, marginBottom: 2 },
  icon: { marginRight: 8 },
  dialCode: { fontSize: 14, color: '#374151', fontFamily: 'Inter_500Medium', marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#111827', fontFamily: 'Inter_400Regular' },
  twoCol: { flexDirection: 'row', marginBottom: 2 },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, marginBottom: 16, gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#9ca3af', marginTop: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkboxChecked: { backgroundColor: '#1e40af', borderColor: '#1e40af' },
  agreeText: { flex: 1, fontSize: 11, color: '#6b7280', lineHeight: 16, fontFamily: 'Inter_400Regular' },
  signupBtn: { backgroundColor: '#1e2d6e', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 14 },
  btnDisabled: { opacity: 0.7 },
  signupBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginPrompt: { fontSize: 13, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  loginLink: { fontSize: 13, fontWeight: '700', color: '#1e40af', fontFamily: 'Inter_700Bold' },
});
