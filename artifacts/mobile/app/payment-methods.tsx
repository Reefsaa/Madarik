import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const INITIAL_METHODS = [
  { id: '1', type: 'Bank Transfer', typeAr: 'تحويل بنكي', bank: 'Saudi National Bank', last4: '3271', icon: 'business-outline' as const, isDefault: true  },
  { id: '2', type: 'Mada',          typeAr: 'مدى',        bank: 'Al Rajhi Bank',        last4: '5890', icon: 'card-outline' as const,     isDefault: false },
];

type Method = typeof INITIAL_METHODS[number];

function AddMethodForm({
  isRTL,
  onAdd,
  onCancel,
}: {
  isRTL: boolean;
  onAdd: (m: Omit<Method, 'id'>) => void;
  onCancel: () => void;
}) {
  const [bank, setBank]     = useState('');
  const [last4, setLast4]   = useState('');
  const [type, setType]     = useState<'Bank Transfer' | 'Mada' | 'Visa'>('Bank Transfer');
  const [focused, setFocused] = useState<string | null>(null);

  const TYPES: Array<{ val: 'Bank Transfer' | 'Mada' | 'Visa'; labelEn: string; labelAr: string }> = [
    { val: 'Bank Transfer', labelEn: 'Bank Transfer', labelAr: 'تحويل بنكي' },
    { val: 'Mada',          labelEn: 'Mada',          labelAr: 'مدى'        },
    { val: 'Visa',          labelEn: 'Visa',           labelAr: 'فيزا'      },
  ];

  const handleAdd = () => {
    if (!bank.trim()) {
      Alert.alert('', isRTL ? 'يرجى إدخال اسم البنك' : 'Please enter the bank name');
      return;
    }
    if (last4.trim().length !== 4 || !/^\d{4}$/.test(last4.trim())) {
      Alert.alert('', isRTL ? 'يرجى إدخال آخر 4 أرقام' : 'Please enter the last 4 digits');
      return;
    }
    const chosen = TYPES.find(t => t.val === type)!;
    onAdd({
      type:    chosen.labelEn,
      typeAr:  chosen.labelAr,
      bank:    bank.trim(),
      last4:   last4.trim(),
      icon:    type === 'Bank Transfer' ? 'business-outline' : 'card-outline',
      isDefault: false,
    });
  };

  return (
    <View style={f.container}>
      <Text style={[f.title, isRTL && { textAlign: 'right' }]}>
        {isRTL ? 'إضافة طريقة دفع' : 'Add Payment Method'}
      </Text>

      {/* Type selector */}
      <Text style={[f.label, isRTL && { textAlign: 'right' }]}>
        {isRTL ? 'النوع' : 'Type'}
      </Text>
      <View style={[f.typeRow, isRTL && { flexDirection: 'row-reverse' }]}>
        {TYPES.map(t => (
          <TouchableOpacity
            key={t.val}
            style={[f.typeChip, type === t.val && f.typeChipActive]}
            onPress={() => setType(t.val)}
            activeOpacity={0.8}
          >
            <Text style={[f.typeChipText, type === t.val && f.typeChipTextActive]}>
              {isRTL ? t.labelAr : t.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bank name */}
      <Text style={[f.label, isRTL && { textAlign: 'right' }]}>
        {isRTL ? 'اسم البنك' : 'Bank Name'}
      </Text>
      <TextInput
        style={[f.input, focused === 'bank' && f.inputFocused, isRTL && { textAlign: 'right' }]}
        value={bank}
        onChangeText={setBank}
        placeholder={isRTL ? 'مثال: مصرف الراجحي' : 'e.g. Al Rajhi Bank'}
        placeholderTextColor="#9ca3af"
        onFocus={() => setFocused('bank')}
        onBlur={() => setFocused(null)}
      />

      {/* Last 4 digits */}
      <Text style={[f.label, isRTL && { textAlign: 'right' }]}>
        {isRTL ? 'آخر 4 أرقام' : 'Last 4 Digits'}
      </Text>
      <TextInput
        style={[f.input, focused === 'last4' && f.inputFocused, isRTL && { textAlign: 'right' }]}
        value={last4}
        onChangeText={v => setLast4(v.replace(/\D/g, '').slice(0, 4))}
        placeholder="XXXX"
        placeholderTextColor="#9ca3af"
        keyboardType="number-pad"
        maxLength={4}
        onFocus={() => setFocused('last4')}
        onBlur={() => setFocused(null)}
      />

      <View style={[f.btnRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity style={f.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={f.cancelText}>{isRTL ? 'إلغاء' : 'Cancel'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={f.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <Text style={f.addText}>{isRTL ? 'إضافة' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const f = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginTop: 12, padding: 16, borderWidth: 1, borderColor: '#e0e7ff' },
  title: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6', borderWidth: 1.5, borderColor: '#f3f4f6' },
  typeChipActive: { backgroundColor: '#eef2ff', borderColor: '#4f46e5' },
  typeChipText: { fontSize: 13, fontWeight: '500', color: '#6b7280', fontFamily: 'Inter_500Medium' },
  typeChipTextActive: { color: '#4f46e5', fontWeight: '700', fontFamily: 'Inter_700Bold' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular', marginBottom: 12 },
  inputFocused: { borderColor: '#4f46e5', backgroundColor: '#fff' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: '#6b7280', fontFamily: 'Inter_600SemiBold' },
  addBtn: { flex: 1, backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  addText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
});

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [showAddForm, setShowAddForm] = useState(false);

  const setDefault = (id: string) =>
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));

  const remove = (id: string) =>
    Alert.alert(t('pmRemove'), isRTL ? 'هل تريد حذف طريقة الدفع هذه؟' : 'Remove this payment method?', [
      { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
      { text: isRTL ? 'حذف' : 'Remove', style: 'destructive', onPress: () => setMethods(p => p.filter(m => m.id !== id)) },
    ]);

  const handleAdd = (m: Omit<Method, 'id'>) => {
    setMethods(prev => [...prev, { ...m, id: String(Date.now()) }]);
    setShowAddForm(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={s.screen}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('pmTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        <View style={[s.listCard, { marginTop: 20 }]}>
          {methods.length === 0 && (
            <View style={s.empty}>
              <Ionicons name="card-outline" size={40} color="#d1d5db" />
              <Text style={s.emptyText}>{t('pmNone')}</Text>
            </View>
          )}
          {methods.map((m, i) => (
            <View key={m.id}>
              <View style={[s.row, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={s.iconWrap}>
                  <Ionicons name={m.icon} size={20} color="#4f46e5" />
                </View>
                <View style={[s.info, isRTL && { alignItems: 'flex-end' }]}>
                  <View style={[s.typeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Text style={s.typeName}>{language === 'ar' ? m.typeAr : m.type}</Text>
                    {m.isDefault && (
                      <View style={s.defaultBadge}>
                        <Text style={s.defaultText}>{t('pmDefault')}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.bankName}>{m.bank} •••• {m.last4}</Text>
                </View>
                <View style={s.actions}>
                  {!m.isDefault && (
                    <TouchableOpacity style={s.actionBtn} onPress={() => setDefault(m.id)} activeOpacity={0.8}>
                      <Text style={s.actionTextPrimary}>{isRTL ? 'افتراضي' : 'Default'}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={s.removeBtn} onPress={() => remove(m.id)} activeOpacity={0.8}>
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
              {i < methods.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        {/* Add method form or button */}
        {showAddForm ? (
          <AddMethodForm isRTL={isRTL} onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
        ) : (
          <TouchableOpacity style={s.addBtn} activeOpacity={0.85} onPress={() => setShowAddForm(true)}>
            <Ionicons name="add-circle-outline" size={18} color="#4f46e5" />
            <Text style={s.addBtnText}>{t('pmAdd')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backRTL: { marginRight: 0, marginLeft: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  listCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 13, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 13, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeName: { fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: 'Inter_600SemiBold' },
  defaultBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  defaultText: { fontSize: 10, fontWeight: '700', color: '#065f46', fontFamily: 'Inter_700Bold' },
  bankName: { fontSize: 12, color: '#9ca3af', marginTop: 2, fontFamily: 'Inter_400Regular' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionBtn: { backgroundColor: '#eef2ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  actionTextPrimary: { fontSize: 11, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  removeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: '#f9fafb', marginLeft: 70 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginTop: 12, paddingVertical: 14, borderWidth: 1, borderColor: '#e0e7ff' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
});
