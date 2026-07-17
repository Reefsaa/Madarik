import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';
import { useLanguage } from '@/context/LanguageContext';

const SUPPORT_EMAIL = 'madarik.amad@gmail.com';

interface RowProps { icon: keyof typeof Ionicons.glyphMap; label: string; sub?: string; value?: string; onPress?: () => void; isRTL?: boolean }

function SettingRow({ icon, label, sub, value, onPress, isRTL }: RowProps) {
  return (
    <TouchableOpacity style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#1e40af" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, isRTL && { textAlign: 'right' }]}>{label}</Text>
        {sub ? <Text style={[styles.rowSub, isRTL && { textAlign: 'right' }]}>{sub}</Text> : null}
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color="#d1d5db" />
    </TouchableOpacity>
  );
}

export default function PersonalSettings() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { setMode, clearMode } = useAppMode();
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const firstName = user?.name?.split(' ')[0] || '';
  const lastName = user?.name?.split(' ').slice(1).join(' ') || '';
  const username = user?.email?.split('@')[0] || '';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  const handleLogout = async () => {
    await clearMode();
    await logout();
    router.replace('/(auth)/');
  };

  const handleSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Madarik Support Request`).catch(() => {});
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <LinearGradient colors={['#0a0e27', '#1a1060', '#2d1b8e']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.notifRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={20} color="#c7d2fe" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.profileName}>{firstName} {lastName}</Text>
        <TouchableOpacity style={styles.usernameRow}>
          <Text style={styles.usernameText}>{username}</Text>
          <Ionicons name="pencil-outline" size={13} color="#818cf8" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Settings list */}
      <View style={styles.listSection}>
        <SettingRow isRTL={isRTL} icon="person-outline" label={t('settingsPersonalInfo')} />
        <View style={styles.divider} />
        <SettingRow isRTL={isRTL} icon="card-outline" label={t('settingsCards')} />
        <View style={styles.divider} />
        <SettingRow isRTL={isRTL} icon="shield-outline" label={t('settingsPrivacy')} />
        <View style={styles.divider} />
        <SettingRow
          isRTL={isRTL}
          icon="language-outline"
          label={t('settingsLanguage')}
          value={language === 'en' ? 'EN' : 'ع'}
          onPress={toggleLanguage}
        />
        <View style={styles.divider} />
        <SettingRow
          isRTL={isRTL}
          icon="notifications-outline"
          label={t('settingsNotifications')}
          onPress={() => router.push('/notifications')}
        />
        <View style={styles.divider} />
        <SettingRow
          isRTL={isRTL}
          icon="headset-outline"
          label={t('settingsSupport')}
          sub={SUPPORT_EMAIL}
          onPress={handleSupport}
        />
      </View>

      {/* Referral code */}
      <TouchableOpacity style={styles.referralCard} activeOpacity={0.85}>
        <Ionicons name="qr-code-outline" size={20} color="#1e40af" />
        <Text style={styles.referralText}>{t('settingsReferral')}</Text>
      </TouchableOpacity>

      {/* Switch to Business */}
      <TouchableOpacity style={[styles.switchCard, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => setMode('business')} activeOpacity={0.85}>
        <Ionicons name="swap-horizontal-outline" size={18} color="#4f46e5" />
        <Text style={styles.switchText}>{t('settingsSwitchBusiness')}</Text>
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color="#4f46e5" />
      </TouchableOpacity>

      {/* Behavioral Assessment */}
      <TouchableOpacity style={[styles.assessCard, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => router.push('/behavioral-assessment')} activeOpacity={0.85}>
        <Ionicons name="analytics-outline" size={18} color="#7c3aed" />
        <Text style={styles.assessText}>{t('settingsBehavioral')}</Text>
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color="#7c3aed" />
      </TouchableOpacity>

      {/* Log out */}
      <TouchableOpacity style={styles.logoutCard} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.logoutText}>{t('settingsLogout')}</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>{t('settingsVersion')} · {t('personalMode')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { alignItems: 'center', paddingHorizontal: 16, paddingBottom: 24 },
  notifRow: { flexDirection: 'row', width: '100%', marginBottom: 16 },
  notifBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold', marginBottom: 4 },
  usernameRow: { flexDirection: 'row', alignItems: 'center' },
  usernameText: { fontSize: 13, color: '#818cf8', fontFamily: 'Inter_400Regular' },
  listSection: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginTop: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { fontSize: 14, color: '#111827', fontFamily: 'Inter_500Medium' },
  rowSub: { fontSize: 11, color: '#9ca3af', marginTop: 1, fontFamily: 'Inter_400Regular' },
  rowValue: { fontSize: 13, color: '#6b7280', marginRight: 6, fontFamily: 'Inter_500Medium' },
  divider: { height: 1, backgroundColor: '#f9fafb', marginLeft: 64 },
  referralCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#eff6ff', borderRadius: 14, marginHorizontal: 16, marginTop: 12, paddingVertical: 14, borderWidth: 1, borderColor: '#bfdbfe' },
  referralText: { fontSize: 14, fontWeight: '600', color: '#1e40af', fontFamily: 'Inter_600SemiBold' },
  switchCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginTop: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#e0e7ff' },
  switchText: { flex: 1, fontSize: 14, color: '#4f46e5', fontFamily: 'Inter_600SemiBold' },
  assessCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginTop: 10, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#ede9fe' },
  assessText: { flex: 1, fontSize: 14, color: '#7c3aed', fontFamily: 'Inter_600SemiBold' },
  logoutCard: { backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginTop: 10, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  logoutText: { fontSize: 14, color: '#6b7280', fontFamily: 'Inter_500Medium' },
  versionText: { textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 16, fontFamily: 'Inter_400Regular' },
});
