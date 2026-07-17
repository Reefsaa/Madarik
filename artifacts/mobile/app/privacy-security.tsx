import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';

const PS_KEY = 'madarik_privacy_v1';

function SectionHeader({ title, isRTL }: { title: string; isRTL: boolean }) {
  return <Text style={[sh.t, isRTL && { textAlign: 'right' }]}>{title}</Text>;
}
const sh = StyleSheet.create({ t: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 22, marginBottom: 8 } });

export default function PrivacySecurityScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { clearMode } = useAppMode();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  // Password form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');

  // Toggles
  const [biometric, setBiometric] = useState(false);
  const [tfa, setTfa] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PS_KEY).then(val => {
      if (val) { const p = JSON.parse(val); setBiometric(p.biometric ?? false); setTfa(p.tfa ?? false); }
    }).catch(() => {});
  }, []);

  const savePrivacy = async (b: boolean, t2: boolean) => {
    await AsyncStorage.setItem(PS_KEY, JSON.stringify({ biometric: b, tfa: t2 })).catch(() => {});
  };

  const handleBiometric = (v: boolean) => { setBiometric(v); savePrivacy(v, tfa); };
  const handleTfa = (v: boolean) => { setTfa(v); savePrivacy(biometric, v); };

  const handleUpdatePassword = async () => {
    setPassError('');
    if (!currentPass || !newPass || !confirmPass) {
      setPassError(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }
    if (newPass !== confirmPass) { setPassError(t('psPassMismatch')); return; }
    if (newPass.length < 6) { setPassError(t('psPassTooShort')); return; }

    setPassLoading(true);
    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      if (!domain) throw new Error('offline');

      const resp = await fetch(`https://${domain}/api/auth/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? 'Failed');

      setCurrentPass(''); setNewPass(''); setConfirmPass('');
      Alert.alert('', t('psPassUpdated'));
    } catch (err: any) {
      if (err.message === 'offline') {
        setPassError(isRTL ? 'غير متاح بدون اتصال' : 'Requires internet connection');
      } else {
        setPassError(err.message === 'Current password is incorrect' ? t('psWrongCurrent') : err.message);
      }
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('psDeleteAcct'), t('psDeleteMsg'), [
      { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
      {
        text: isRTL ? 'حذف نهائياً' : 'Delete Permanently',
        style: 'destructive',
        onPress: async () => { await clearMode(); await logout(); router.replace('/(auth)'); },
      },
    ]);
  };

  const PassField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);
    return (
      <View style={ps.fieldGroup}>
        <Text style={[ps.label, isRTL && { textAlign: 'right' }]}>{label}</Text>
        <View style={[ps.inputWrap, focused && ps.inputWrapFocused]}>
          <TextInput
            style={[ps.input, isRTL && { textAlign: 'right', paddingRight: 14, paddingLeft: 40 }]}
            value={value}
            onChangeText={onChange}
            secureTextEntry={!show}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="none"
          />
          <TouchableOpacity style={[ps.eyeBtn, isRTL && { left: 12, right: undefined }]} onPress={() => setShow(v => !v)}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={ps.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[ps.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[ps.back, isRTL && ps.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={ps.headerTitle}>{t('psTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* Change Password */}
        <SectionHeader title={t('psChangePassSection')} isRTL={isRTL} />
        <View style={ps.card}>
          <PassField label={t('psCurrentPass')} value={currentPass} onChange={setCurrentPass} />
          <View style={ps.divider} />
          <PassField label={t('psNewPass')} value={newPass} onChange={setNewPass} />
          <View style={ps.divider} />
          <PassField label={t('psConfirmPass')} value={confirmPass} onChange={setConfirmPass} />
          {passError ? <Text style={ps.errorText}>{passError}</Text> : null}
          <TouchableOpacity
            style={[ps.savePassBtn, passLoading && { opacity: 0.6 }]}
            onPress={handleUpdatePassword}
            activeOpacity={0.85}
            disabled={passLoading}
          >
            <Text style={ps.savePassText}>{passLoading ? '...' : t('psSavePass')}</Text>
          </TouchableOpacity>
        </View>

        {/* Biometric */}
        <SectionHeader title={t('psBioSection')} isRTL={isRTL} />
        <View style={ps.card}>
          <View style={[ps.toggleRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={ps.toggleIconWrap}>
              <Ionicons name="finger-print-outline" size={20} color="#4f46e5" />
            </View>
            <View style={[ps.toggleInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={ps.toggleLabel}>{t('psBioSection')}</Text>
              <Text style={ps.toggleDesc}>{t('psBioDesc')}</Text>
            </View>
            <Switch
              value={biometric}
              onValueChange={handleBiometric}
              trackColor={{ false: '#e5e7eb', true: '#a5b4fc' }}
              thumbColor={biometric ? '#4f46e5' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Two-Factor Auth */}
        <SectionHeader title={t('psTfaSection')} isRTL={isRTL} />
        <View style={ps.card}>
          <View style={[ps.toggleRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={ps.toggleIconWrap}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#4f46e5" />
            </View>
            <View style={[ps.toggleInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={ps.toggleLabel}>{t('psTfaSection')}</Text>
              <Text style={ps.toggleDesc}>{t('psTfaDesc')}</Text>
            </View>
            <Switch
              value={tfa}
              onValueChange={handleTfa}
              trackColor={{ false: '#e5e7eb', true: '#a5b4fc' }}
              thumbColor={tfa ? '#4f46e5' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <SectionHeader title={t('psDangerZone')} isRTL={isRTL} />
        <View style={ps.card}>
          <TouchableOpacity style={[ps.dangerRow, isRTL && { flexDirection: 'row-reverse' }]} onPress={handleDeleteAccount} activeOpacity={0.8}>
            <View style={ps.dangerIconWrap}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </View>
            <View style={[ps.toggleInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={ps.dangerLabel}>{t('psDeleteAcct')}</Text>
              <Text style={ps.dangerDesc}>{t('psDeleteMsg')}</Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color="#fca5a5" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const ps = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backRTL: { marginRight: 0, marginLeft: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden', padding: 16 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 8 },
  fieldGroup: { marginBottom: 4 },
  label: { fontSize: 11, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12 },
  inputWrapFocused: { borderColor: '#4f46e5', backgroundColor: '#fff' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },
  eyeBtn: { position: 'absolute', right: 12 },
  errorText: { fontSize: 12, color: '#ef4444', fontFamily: 'Inter_400Regular', marginTop: 8 },
  savePassBtn: { backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 14 },
  savePassText: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  toggleIconWrap: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  toggleInfo: { flex: 1 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  toggleDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  dangerRow: { flexDirection: 'row', alignItems: 'center' },
  dangerIconWrap: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dangerLabel: { fontSize: 14, fontWeight: '600', color: '#ef4444', fontFamily: 'Inter_600SemiBold' },
  dangerDesc: { fontSize: 11, color: '#fca5a5', marginTop: 2, fontFamily: 'Inter_400Regular', flexShrink: 1 },
});
