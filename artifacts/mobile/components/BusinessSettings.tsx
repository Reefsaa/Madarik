import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useAppMode } from '@/context/AppModeContext';

const SUPPORT_EMAIL = 'madarik.amad@gmail.com';

interface RowProps { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; danger?: boolean; onPress?: () => void }

function SettingRow({ icon, label, value, danger, onPress }: RowProps) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
        <Ionicons name={icon} size={17} color={danger ? '#ef4444' : '#4f46e5'} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={15} color="#d1d5db" />
    </TouchableOpacity>
  );
}

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline' as const, label: 'Personal Information' },
      { icon: 'business-outline' as const, label: 'Company Details' },
      { icon: 'card-outline' as const, label: 'Payment Methods' },
      { icon: 'document-text-outline' as const, label: 'Billing & Invoices' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications-outline' as const, label: 'Notifications', value: 'On' },
      { icon: 'language-outline' as const, label: 'Language', value: 'English' },
      { icon: 'cash-outline' as const, label: 'Currency', value: 'SAR' },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: 'lock-closed-outline' as const, label: 'Change Password' },
      { icon: 'finger-print-outline' as const, label: 'Biometric Login', value: 'Enabled' },
      { icon: 'shield-outline' as const, label: 'Two-Factor Auth', value: 'On' },
    ],
  },
];

export default function BusinessSettings() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { setMode, clearMode } = useAppMode();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AB';

  const handleLogout = async () => {
    await clearMode();
    await logout();
    router.replace('/(auth)/');
  };

  const handleSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Madarik Business Support Request`).catch(() => {});
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'abdulrahman@madarik.sa'}</Text>
            <Text style={styles.profileCompany}>{user?.company || 'Madarik Holdings'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={14} color="#818cf8" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {[{ l: 'Health Score', v: '89' }, { l: 'Accounts', v: '4' }, { l: 'Alerts', v: '3' }].map(s => (
            <View key={s.l} style={styles.statItem}>
              <Text style={styles.statValue}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <View key={item.label}>
                  <SettingRow
                    icon={item.icon}
                    label={item.label}
                    value={'value' in item ? item.value : undefined}
                    onPress={item.label === 'Notifications' ? () => router.push('/notifications') : undefined}
                  />
                  {idx < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="headset-outline"
              label="Support"
              value={SUPPORT_EMAIL}
              onPress={handleSupport}
            />
          </View>
        </View>

        {/* Switch to Personal */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <SettingRow icon="person-outline" label="Switch to Personal Mode" onPress={() => setMode('personal')} />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <SettingRow icon="log-out-outline" label="Sign Out" danger onPress={handleLogout} />
          </View>
        </View>

        <Text style={styles.versionText}>Madarik v1.0.0 · Business Mode</Text>
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
