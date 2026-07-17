import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const INITIAL_METHODS = [
  { id: '1', type: 'Bank Transfer', typeAr: 'تحويل بنكي', bank: 'Saudi National Bank', last4: '3271', icon: 'business-outline', isDefault: true },
  { id: '2', type: 'Mada',          typeAr: 'مدى',        bank: 'Al Rajhi Bank',        last4: '5890', icon: 'card-outline',     isDefault: false },
];

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isRTL, language } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [methods, setMethods] = useState(INITIAL_METHODS);

  const setDefault = (id: string) =>
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));

  const remove = (id: string) =>
    Alert.alert(t('pmRemove'), isRTL ? 'هل تريد حذف طريقة الدفع هذه؟' : 'Remove this payment method?', [
      { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
      { text: isRTL ? 'حذف' : 'Remove', style: 'destructive', onPress: () => setMethods(p => p.filter(m => m.id !== id)) },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
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
                  <Ionicons name={m.icon as any} size={20} color="#4f46e5" />
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

        <TouchableOpacity
          style={s.addBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert(t('pmAdd'), isRTL ? 'هذه الميزة ستكون متاحة قريباً.' : 'This feature will be available soon.')}
        >
          <Ionicons name="add-circle-outline" size={18} color="#4f46e5" />
          <Text style={s.addBtnText}>{t('pmAdd')}</Text>
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
