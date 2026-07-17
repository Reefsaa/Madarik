import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

function FormField({
  label, value, onChangeText, isRTL, disabled, note, keyboardType,
}: {
  label: string; value: string; onChangeText?: (v: string) => void;
  isRTL: boolean; disabled?: boolean; note?: string; keyboardType?: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.group}>
      <Text style={[f.label, isRTL && { textAlign: 'right' }]}>{label}</Text>
      {disabled ? (
        <View style={f.disabled}>
          <Text style={[f.disabledText, isRTL && { textAlign: 'right' }]}>{value}</Text>
        </View>
      ) : (
        <TextInput
          style={[f.input, focused && f.inputFocused, isRTL && { textAlign: 'right' }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType ?? 'default'}
          editable={!disabled}
        />
      )}
      {note ? <Text style={[f.note, isRTL && { textAlign: 'right' }]}>{note}</Text> : null}
    </View>
  );
}

const f = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },
  inputFocused: { borderColor: '#4f46e5', backgroundColor: '#fafafe' },
  disabled: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13 },
  disabledText: { fontSize: 15, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  note: { fontSize: 11, color: '#9ca3af', marginTop: 4, fontFamily: 'Inter_400Regular' },
});

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const parts = (user?.name ?? '').split(' ');
  const [firstName, setFirstName] = useState(parts[0] ?? '');
  const [lastName, setLastName] = useState(parts.slice(1).join(' ') ?? '');
  const [mobile, setMobile] = useState(user?.mobile ?? '');
  const [nationalId, setNationalId] = useState(user?.nationalId ?? '');
  const [saving, setSaving] = useState(false);

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '??';

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('', isRTL ? 'الاسم الأول مطلوب' : 'First name is required');
      return;
    }
    setSaving(true);
    try {
      await updateUser({
        name: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
        mobile: mobile.trim(),
        nationalId: nationalId.trim(),
      });
      Alert.alert('', t('piSaved'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('piTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.avatarName}>{firstName} {lastName}</Text>
          <Text style={s.avatarEmail}>{user?.email}</Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          <FormField label={t('piFirstName')} value={firstName} onChangeText={setFirstName} isRTL={isRTL} />
          <FormField label={t('piLastName')} value={lastName} onChangeText={setLastName} isRTL={isRTL} />
          <FormField label={t('piEmail')} value={user?.email ?? ''} isRTL={isRTL} disabled note={t('piEmailNote')} />
          <FormField label={t('piMobile')} value={mobile} onChangeText={setMobile} isRTL={isRTL} keyboardType="phone-pad" />
          <FormField label={t('piNationalId')} value={nationalId} onChangeText={setNationalId} isRTL={isRTL} keyboardType="numeric" />
        </View>

        <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.65 }]} onPress={handleSave} activeOpacity={0.85} disabled={saving}>
          <Text style={s.saveBtnText}>{saving ? '...' : t('piSave')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backRTL: { marginRight: 0, marginLeft: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  avatarSection: { alignItems: 'center', paddingVertical: 24, backgroundColor: '#1e1b4b' },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 10 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  avatarName: { fontSize: 17, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  avatarEmail: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 3, fontFamily: 'Inter_400Regular' },
  form: { padding: 16 },
  saveBtn: { marginHorizontal: 16, marginTop: 8, backgroundColor: '#4f46e5', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
});
