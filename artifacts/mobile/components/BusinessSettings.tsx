import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';

const SUPPORT_EMAIL = 'madarik.amad@gmail.com';

interface RowProps { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; danger?: boolean; onPress?: () => void; isRTL?: boolean }

function SettingRow({ icon, label, value, danger, onPress, isRTL }: RowProps) {
  return (
    <TouchableOpacity style={[styles.settingRow, isRTL && { flexDirection: 'row-reverse' }]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
        <Ionicons name={icon} size={17} color={danger ? '#ef4444' : '#4f46e5'} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger, isRTL && { textAlign: 'right' }]}>{label}</Text>
      {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={15} color="#d1d5db" />
    </TouchableOpacity>
  );
}

export default function BusinessSettings() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { setMode, clearMode } = useAppMode();
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  const handleLogout = async () => {
    await clearMode();
    await logout();
    router.replace('/(auth)/');
  };

  const handleSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Madarik Business Support Request`).catch(() => {});
  };

  const sections = [
    {
      title: t('settingsAccount'),
      items: [
        { icon: 'person-outline' as const, label: t('settingsPersonalInfo') },
        { icon: 'business-outline' as const, label: t('settingsCompanyDetails') },
        { icon: 'card-outline' as const, label: t('settingsPaymentMethods') },
        { icon: 'document-text-outline' as const, label: t('settingsBilling') },
      ],
    },
    {
      title: t('settingsPreferences'),
      items: [
        { icon: 'notifications-outline' as const, label: t('settingsNotifications'), value: 'On', onPress: () => router.push('/notifications') },
        { icon: 'language-outline' as const, label: t('settingsLanguage'), value: language === 'en' ? 'EN' : 'ع', onPress: toggleLanguage },
        { icon: 'cash-outline' as const, label: t('settingsCurrency'), value: 'SAR' },
      ],
    },
    {
      title: t('settingsSecurity'),
      items: [
        { icon: 'lock-closed-outline' as const, label: t('settingsChangePassword') },
        { icon: 'finger-print-outline' as const, label: t('settingsBiometric'), value: 'On' },
        { icon: 'shield-outline' as const, label: t('settingsTwoFactor'), value: 'On' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('settingsProfileTitle')}</Text>
        <View style={[styles.profileCard, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isRTL && { textAlign: 'right' }]}>{user?.name || 'User'}</Text>
            <Text style={[styles.profileEmail, isRTL && { textAlign: 'right' }]}>{user?.email || ''}</Text>
            <Text style={[styles.profileCompany, isRTL && { textAlign: 'right' }]}>{user?.company || ''}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={14} color="#818cf8" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {[
            { l: t('homeHealthScore'), v: '89' },
            { l: t('homeAccounts'), v: '4' },
            { l: t('homeAlerts'), v: '3' },
          ].map(s => (
            <View key={s.l} style={styles.statItem}>
              <Text style={styles.statValue}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <View key={item.label}>
                  <SettingRow
                    isRTL={isRTL}
                    icon={item.icon}
                    label={item.label}
                    value={'value' in item ? item.value : undefined}
                    onPress={'onPress' in item ? item.onPress : undefined}
                  />
                  {idx < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t('settingsHelp')}</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              isRTL={isRTL}
              icon="headset-outline"
              label={t('settingsSupport')}
              value={SUPPORT_EMAIL}
              onPress={handleSupport}
            />
          </View>
        </View>

        {/* Switch to Personal */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <SettingRow isRTL={isRTL} icon="person-outline" label={t('settingsSwitchPersonal')} onPress={() => setMode('personal')} />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <SettingRow isRTL={isRTL} icon="log-out-outline" label={t('settingsSignOut')} danger onPress={handleLogout} />
          </View>
        </View>

        <Text style={styles.versionText}>{t('settingsVersion')} · {t('businessMode')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 16, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 16 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  profileEmail: { fontSize: 11, color: '#94a3b8', marginTop: 2, fontFamily: 'Inter_400Regular' },
  profileCompany: { fontSize: 11, color: '#818cf8', marginTop: 2, fontFamily: 'Inter_400Regular' },
  editBtn: { width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, color: '#64748b', marginTop: 2, fontFamily: 'Inter_400Regular' },
  content: { padding: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase', fontFamily: 'Inter_700Bold' },
  sectionCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13 },
  settingIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  settingIconDanger: { backgroundColor: '#fef2f2' },
  settingLabel: { flex: 1, fontSize: 14, color: '#111827', fontFamily: 'Inter_500Medium' },
  settingLabelDanger: { color: '#ef4444' },
  settingValue: { fontSize: 11, color: '#9ca3af', marginRight: 6, fontFamily: 'Inter_400Regular' },
  divider: { height: 1, backgroundColor: '#f9fafb', marginLeft: 58 },
  versionText: { textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 8, fontFamily: 'Inter_400Regular' },
});
