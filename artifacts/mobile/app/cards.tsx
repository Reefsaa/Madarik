import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const INITIAL_CARDS = [
  { id: '1', network: 'Visa', last4: '4242', expiry: '09/27', colors: ['#1A237E', '#4f46e5'] as const, balance: '8,500.00' },
  { id: '2', network: 'Mada', last4: '1234', expiry: '03/26', colors: ['#1e40af', '#0284c7'] as const, balance: '2,150.00' },
];

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [cards, setCards] = useState(INITIAL_CARDS);
  const [frozen, setFrozen] = useState<Record<string, boolean>>({});

  const toggleFreeze = (id: string) =>
    setFrozen(prev => ({ ...prev, [id]: !prev[id] }));

  const removeCard = (id: string) =>
    Alert.alert(t('cardsRemove'), t('cardsRemoveConfirm'), [
      { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
      { text: isRTL ? 'حذف' : 'Remove', style: 'destructive', onPress: () => setCards(prev => prev.filter(c => c.id !== id)) },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[s.header, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.back, isRTL && s.backRTL]}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('cardsTitle')}</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        <Text style={[s.sectionTitle, isRTL && { textAlign: 'right', marginRight: 16 }]}>{t('cardsMyCards')}</Text>

        {cards.length === 0 && (
          <View style={s.emptyState}>
            <Ionicons name="card-outline" size={48} color="#d1d5db" />
            <Text style={s.emptyText}>{isRTL ? 'لا توجد بطاقات مضافة' : 'No cards added yet'}</Text>
          </View>
        )}

        {cards.map(card => {
          const isFrozen = frozen[card.id] ?? false;
          const cardHolder = user?.name ?? 'Card Holder';
          return (
            <View key={card.id} style={s.cardWrap}>
              <LinearGradient colors={card.colors} style={[s.card, isFrozen && s.cardFrozen]}>
                <View style={[s.cardTopRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={s.cardNetwork}>{card.network}</Text>
                  {isFrozen && (
                    <View style={s.frozenBadge}>
                      <Ionicons name="snow-outline" size={11} color="#93c5fd" />
                      <Text style={s.frozenText}> {t('cardsFrozen')}</Text>
                    </View>
                  )}
                </View>
                <Text style={s.cardNumber}>•••• •••• •••• {card.last4}</Text>
                <View style={[s.cardBottom, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View>
                    <Text style={s.cardLabel}>{isRTL ? 'حامل البطاقة' : 'Card Holder'}</Text>
                    <Text style={s.cardHolder}>{cardHolder}</Text>
                  </View>
                  <View style={isRTL ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }}>
                    <Text style={s.cardLabel}>{t('cardsExpires')}</Text>
                    <Text style={s.cardHolder}>{card.expiry}</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Actions */}
              <View style={[s.actionsRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                  style={[s.actionBtn, isFrozen && s.actionBtnWarn]}
                  onPress={() => toggleFreeze(card.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={isFrozen ? 'sunny-outline' : 'snow-outline'} size={15} color={isFrozen ? '#f59e0b' : '#4f46e5'} />
                  <Text style={[s.actionText, { color: isFrozen ? '#f59e0b' : '#4f46e5' }]}>
                    {isFrozen ? t('cardsUnfreeze') : t('cardsFreeze')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtnDanger} onPress={() => removeCard(card.id)} activeOpacity={0.8}>
                  <Ionicons name="trash-outline" size={15} color="#ef4444" />
                  <Text style={[s.actionText, { color: '#ef4444' }]}>{t('cardsRemove')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={s.addBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert(t('cardsAddCard'), t('cardsAddSoon'))}
        >
          <Ionicons name="add-circle-outline" size={18} color="#4f46e5" />
          <Text style={s.addBtnText}>{t('cardsAddCard')}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 18, marginBottom: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  cardWrap: { marginHorizontal: 16, marginBottom: 16 },
  card: { borderRadius: 18, padding: 20, height: 140, justifyContent: 'space-between' },
  cardFrozen: { opacity: 0.75 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNetwork: { fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  frozenBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  frozenText: { fontSize: 10, color: '#93c5fd', fontFamily: 'Inter_500Medium' },
  cardNumber: { fontSize: 16, color: 'rgba(255,255,255,0.85)', letterSpacing: 2, fontFamily: 'Inter_500Medium' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  cardHolder: { fontSize: 12, color: '#fff', fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#eef2ff', borderRadius: 10, paddingVertical: 10 },
  actionBtnWarn: { backgroundColor: '#fffbeb' },
  actionBtnDanger: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#fef2f2', borderRadius: 10, paddingVertical: 10 },
  actionText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#e0e7ff' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
});
