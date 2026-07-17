import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

function FormField({
  label, value, onChangeText, isRTL, keyboardType, placeholder,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  isRTL: boolean; keyboardType?: any; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.group}>
      <Text style={[f.label, isRTL && { textAlign: 'right' }]}>{label}</Text>
      <TextInput
        style={[f.input, focused && f.focused, isRTL && { textAlign: 'right' }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType ?? 'default'}
        placeholder={placeholder ?? ''}
        placeholderTextColor="#d1d5db"
      />
    </View>
  );
}
const f = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },
  focused: { borderColor: '#4f46e5', backgroundColor: '#fafafe' },
});

export default function CompanyDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [company, setCompany] = useState(user?.company ?? '');
  const [crNumber, setCrNumber] = useState(user?.crNumber ?? '');
  const [taxNumber, setTaxNumber] = useState(user?.taxNumber ?? '');
  const [industry, setIndustry] = useState(user?.industry ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [saving, setSaving] = useState(false);

  const initials = (company || 'CO').substring(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!company.trim()) {
      Alert.alert('', isRTL ? 'اسم الشركة مطلوب' : 'Company name is required');
      return;
    }
    setSaving(true);
    try {
      await updateUser({ company: company.trim(), crNumber: crNumber.trim(), taxNumber: taxNumber.trim(), industry: industry.trim(), address: address.trim() });
      Alert.alert('', t('cdSaved'));
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
          <Text style={s.headerTitle}>{t('cdTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        {/* Company avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.avatarName}>{company || (isRTL ? 'اسم الشركة' : 'Company Name')}</Text>
        </View>

        <View style={s.form}>
          <FormField label={t('cdCompanyName')} value={company} onChangeText={setCompany} isRTL={isRTL} />
          <FormField label={t('cdCrNumber')} value={crNumber} onChangeText={setCrNumber} isRTL={isRTL} keyboardType="numeric" placeholder="1010XXXXXX" />
          <FormField label={t('cdTaxNumber')} value={taxNumber} onChangeText={setTaxNumber} isRTL={isRTL} keyboardType="numeric" placeholder="3XXXXXXXXXXXXXXXXX" />
          <FormField label={t('cdIndustry')} value={industry} onChangeText={setIndustry} isRTL={isRTL} placeholder={isRTL ? 'مثال: التجزئة' : 'e.g. Retail'} />
          <FormField label={t('cdAddress')} value={address} onChangeText={setAddress} isRTL={isRTL} placeholder={isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'} />
        </View>

        <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.65 }]} onPress={handleSave} activeOpacity={0.85} disabled={saving}>
          <Text style={s.saveBtnText}>{saving ? '...' : t('cdSave')}</Text>
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
  avatar: { width: 72, height: 72, borderRadius: 18, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 10 },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  avatarName: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  form: { padding: 16 },
  saveBtn: { marginHorizontal: 16, marginTop: 8, backgroundColor: '#4f46e5', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
});
