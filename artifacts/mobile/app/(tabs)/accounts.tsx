import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const firstName = user?.name?.split(' ')[0] || 'there';

  const QUICK_ACTIONS = [
    { icon: 'arrow-redo-outline'         as const, label: t('accountsTransfer') },
    { icon: 'clipboard-outline'          as const, label: t('accountsTransactions') },
    { icon: 'information-circle-outline' as const, label: t('accountsAccountInfo') },
    { icon: 'document-text-outline'      as const, label: t('accountsStatements') },
  ];

  const ACCOUNTS = [
    { icon: 'briefcase-outline' as const, nameEn: 'Main Business',   typeEn: 'Checking Account',   nameAr: 'الحساب الرئيسي',      typeAr: 'حساب جارٍ',        balance: 'SAR 420,000', badge: true,  rlKey: t('accountsLastTx'),        rv: '2h ago',      rvc: undefined,     highlighted: true  },
    { icon: 'save-outline'      as const, nameEn: 'Business Savings', typeEn: 'High-Yield Savings', nameAr: 'مدخرات الأعمال',      typeAr: 'ادخار عالي العائد', balance: 'SAR 300,000', badge: false, rlKey: t('accountsInterestEarned'), rv: 'SAR 1,250',  rvc: '#818cf8',     highlighted: false },
    { icon: 'card-outline'      as const, nameEn: 'Payroll Account',  typeEn: 'Employee Payments',  nameAr: 'حساب الرواتب',        typeAr: 'مدفوعات الموظفين', balance: 'SAR 95,000',  badge: true,  rlKey: t('accountsNextPayroll'),    rv: '5 Days',     rvc: undefined,     highlighted: true  },
    { icon: 'card-outline'      as const, nameEn: 'Business Credit',  typeEn: 'Credit Facility',    nameAr: 'ائتمان الأعمال',      typeAr: 'تسهيلات ائتمانية', balance: 'SAR 55,000',  badge: false, rlKey: t('accountsAvailCredit'),    rv: 'SAR 200,000', rvc: '#818cf8',    highlighted: false },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[styles.headerDark, { paddingTop: topPad + 12 }]}>
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.headerTitle}>{t('accountsTitle')}</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.welcome, isRTL && { textAlign: 'right' }]}>
          {t('homeWelcomeBack')} {firstName}
        </Text>
        <Text style={[styles.welcomeSub, isRTL && { textAlign: 'right' }]}>{t('accountsWelcomeSub')}</Text>

        {/* Total Balance */}
        <LinearGradient colors={['#a5b4fc', '#818cf8', '#6366f1']} start={{ x:0, y:0 }} end={{ x:1, y:1 }} style={styles.balanceCard}>
          <View style={[styles.balanceHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.balanceCardLabel}>{t('accountsTotalBalance')}</Text>
            <View style={styles.trendCircle}>
              <Ionicons name="trending-up" size={14} color="#4f46e5" />
            </View>
          </View>
          <Text style={[styles.balanceCardValue, isRTL && { textAlign: 'right' }]}>SAR 845,000</Text>
          <View style={[styles.balanceStatsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={isRTL ? { alignItems: 'flex-end' } : undefined}>
              <Text style={styles.balanceStatLabel}>{t('accountsAvailCash')}</Text>
              <Text style={styles.balanceStatValue}>SAR 420,000</Text>
            </View>
            <View style={isRTL ? { alignItems: 'flex-end' } : undefined}>
              <Text style={styles.balanceStatLabel}>{t('accountsTodayChange')}</Text>
              <Text style={styles.balanceStatValue}>+SAR 8,500</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={[styles.quickRow, isRTL && { flexDirection: 'row-reverse' }]}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity key={a.label} style={styles.quickAction} activeOpacity={0.8}>
              <View style={styles.quickIconWrap}>
                <Ionicons name={a.icon} size={17} color="#111827" />
              </View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Accounts list */}
      <LinearGradient colors={['#312e81', '#1e1b4b', '#0f172a']} style={styles.accountsSection}>
        <View style={[styles.sectionHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.sectionTitle}>{t('accountsYourAccounts')}</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.viewAll}>{t('accountsViewAll')}</Text>
          </TouchableOpacity>
        </View>

        {ACCOUNTS.map((ac, i) => {
          const name = isRTL ? ac.nameAr : ac.nameEn;
          const type = isRTL ? ac.typeAr : ac.typeEn;
          return (
            <TouchableOpacity key={i} style={[styles.accountCard, ac.highlighted && styles.accountCardHighlighted]} activeOpacity={0.85}>
              <View style={[styles.accountTopRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.accountIconWrap}>
                    <Ionicons name={ac.icon} size={16} color="#4f46e5" />
                  </View>
                  <View style={[{ marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={styles.accountName}>{name}</Text>
                    <Text style={styles.accountType}>{type}</Text>
                  </View>
                </View>
                {ac.badge && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>{t('accountsActive')}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.accountBottomRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={isRTL ? { alignItems: 'flex-end' } : undefined}>
                  <Text style={styles.balanceLabel}>{t('accountsCurrBalance')}</Text>
                  <Text style={styles.balanceValue}>{ac.balance}</Text>
                </View>
                <View style={isRTL ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }}>
                  <Text style={styles.balanceLabel}>{ac.rlKey}</Text>
                  <Text style={[styles.rightValue, { color: ac.rvc || '#111827' }]}>{ac.rv}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        <View style={[styles.helpCard, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.helpIconWrap}>
            <Ionicons name="sparkles-outline" size={18} color="#4f46e5" />
          </View>
          <View style={[{ flex: 1, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }, isRTL && { alignItems: 'flex-end' }]}>
            <Text style={styles.helpTitle}>{t('accountsNeedHelp')}</Text>
            <Text style={styles.helpDesc}>{t('accountsHelpDesc')}</Text>
          </View>
          <TouchableOpacity style={styles.askBtn} activeOpacity={0.85}>
            <Text style={styles.askBtnText}>{t('accountsAskBtn')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f172a' },
  headerDark: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 19, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  addBtn: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  welcome: { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 14, fontFamily: 'Inter_700Bold' },
  welcomeSub: { fontSize: 11, color: '#c7d2fe', marginTop: 3, fontFamily: 'Inter_400Regular' },
  balanceCard: { borderRadius: 18, padding: 16, marginTop: 16 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceCardLabel: { fontSize: 12, color: '#eef2ff', fontFamily: 'Inter_500Medium' },
  trendCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  balanceCardValue: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  balanceStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.25)' },
  balanceStatLabel: { fontSize: 9, color: '#eef2ff', fontFamily: 'Inter_400Regular' },
  balanceStatValue: { fontSize: 13, fontWeight: '700', color: '#fff', marginTop: 3, fontFamily: 'Inter_700Bold' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  quickAction: { alignItems: 'center', width: '23%' },
  quickIconWrap: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 9, color: '#e0e7ff', marginTop: 6, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  accountsSection: { padding: 16, paddingTop: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  viewAll: { fontSize: 12, fontWeight: '600', color: '#a5b4fc', fontFamily: 'Inter_600SemiBold' },
  accountCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10 },
  accountCardHighlighted: { backgroundColor: '#c7d2fe' },
  accountTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  accountIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(79,70,229,0.1)', alignItems: 'center', justifyContent: 'center' },
  accountName: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  accountType: { fontSize: 10, color: '#6b7280', marginTop: 1, fontFamily: 'Inter_400Regular' },
  activeBadge: { backgroundColor: '#e0e7ff', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  activeBadgeText: { fontSize: 9, fontWeight: '700', color: '#4338ca', fontFamily: 'Inter_700Bold' },
  accountBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 },
  balanceLabel: { fontSize: 8, color: '#6b7280', letterSpacing: 0.3, fontFamily: 'Inter_400Regular' },
  balanceValue: { fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2, fontFamily: 'Inter_700Bold' },
  rightValue: { fontSize: 12, fontWeight: '700', marginTop: 2, fontFamily: 'Inter_700Bold' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 14 },
  helpCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#c7d2fe', borderRadius: 16, padding: 14 },
  helpIconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  helpTitle: { fontSize: 12, fontWeight: '700', color: '#312e81', fontFamily: 'Inter_700Bold' },
  helpDesc: { fontSize: 10, color: '#3730a3', marginTop: 2, lineHeight: 14, fontFamily: 'Inter_400Regular' },
  askBtn: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  askBtnText: { fontSize: 11, fontWeight: '700', color: '#4338ca', fontFamily: 'Inter_700Bold' },
});
