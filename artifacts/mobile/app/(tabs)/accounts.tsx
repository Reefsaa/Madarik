import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function QuickAction({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.8}>
      <View style={styles.quickIconWrap}>
        <Ionicons name={icon} size={17} color="#111827" />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

interface AccountCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  type: string;
  balance: string;
  badge?: string;
  rightLabel: string;
  rightValue: string;
  rightValueColor?: string;
  highlighted?: boolean;
}

function AccountCard({ icon, name, type, balance, badge, rightLabel, rightValue, rightValueColor, highlighted }: AccountCardProps) {
  return (
    <TouchableOpacity style={[styles.accountCard, highlighted && styles.accountCardHighlighted]} activeOpacity={0.85}>
      <View style={styles.accountTopRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.accountIconWrap}>
            <Ionicons name={icon} size={16} color="#4f46e5" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.accountName}>{name}</Text>
            <Text style={styles.accountType}>{type}</Text>
          </View>
        </View>
        {badge ? (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.accountBottomRow}>
        <View>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>{balance}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.balanceLabel}>{rightLabel}</Text>
          <Text style={[styles.rightValue, { color: rightValueColor || '#111827' }]}>{rightValue}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={[styles.headerDark, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Business Accounts</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.welcome}>Welcome back, Abdulrahman</Text>
        <Text style={styles.welcomeSub}>Manage all your business accounts in one place.</Text>

        {/* Total Balance */}
        <LinearGradient
          colors={['#a5b4fc', '#818cf8', '#6366f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceCardLabel}>Total Business Balance</Text>
            <View style={styles.trendCircle}>
              <Ionicons name="trending-up" size={14} color="#4f46e5" />
            </View>
          </View>
          <Text style={styles.balanceCardValue}>SAR 845,000</Text>
          <View style={styles.balanceStatsRow}>
            <View>
              <Text style={styles.balanceStatLabel}>AVAILABLE CASH</Text>
              <Text style={styles.balanceStatValue}>SAR 420,000</Text>
            </View>
            <View>
              <Text style={styles.balanceStatLabel}>TODAY'S CHANGE</Text>
              <Text style={styles.balanceStatValue}>+SAR 8,500</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <QuickAction icon="arrow-redo-outline" label="Transfer" />
          <QuickAction icon="clipboard-outline" label="Transactions" />
          <QuickAction icon="information-circle-outline" label="Account Info" />
          <QuickAction icon="document-text-outline" label="Statements" />
        </View>
      </LinearGradient>

      {/* Accounts list */}
      <LinearGradient colors={['#312e81', '#1e1b4b', '#0f172a']} style={styles.accountsSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <AccountCard
          icon="briefcase-outline"
          name="Main Business"
          type="Checking Account"
          balance="SAR 420,000"
          badge="Active"
          rightLabel="LAST TRANSACTION"
          rightValue="2h ago"
          highlighted
        />
        <AccountCard
          icon="save-outline"
          name="Business Savings"
          type="High-Yield Savings"
          balance="SAR 300,000"
          rightLabel="INTEREST EARNED"
          rightValue="SAR 1,250"
          rightValueColor="#818cf8"
        />
        <AccountCard
          icon="card-outline"
          name="Payroll Account"
          type="Employee Payments"
          balance="SAR 95,000"
          badge="Active"
          rightLabel="NEXT PAYROLL"
          rightValue="5 Days"
          highlighted
        />
        <AccountCard
          icon="card-outline"
          name="Business Credit"
          type="Credit Facility"
          balance="SAR 55,000"
          rightLabel="AVAILABLE CREDIT"
          rightValue="SAR 200,000"
          rightValueColor="#818cf8"
        />

        <View style={styles.divider} />

        <View style={styles.helpCard}>
          <View style={styles.helpIconWrap}>
            <Ionicons name="sparkles-outline" size={18} color="#4f46e5" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.helpTitle}>Need help with your accounts?</Text>
            <Text style={styles.helpDesc}>Ask Modrik about cash flow or transaction history.</Text>
          </View>
          <TouchableOpacity style={styles.askBtn} activeOpacity={0.85}>
            <Text style={styles.askBtnText}>Ask Modrik</Text>
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
  addBtn: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  welcome: { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 14, fontFamily: 'Inter_700Bold' },
  welcomeSub: { fontSize: 11, color: '#c7d2fe', marginTop: 3, fontFamily: 'Inter_400Regular' },

  balanceCard: { borderRadius: 18, padding: 16, marginTop: 16 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceCardLabel: { fontSize: 12, color: '#eef2ff', fontFamily: 'Inter_500Medium' },
  trendCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  balanceCardValue: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 4, fontFamily: 'Inter_700Bold' },
  balanceStatsRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.25)',
  },
  balanceStatLabel: { fontSize: 9, color: '#eef2ff', fontFamily: 'Inter_400Regular' },
  balanceStatValue: { fontSize: 13, fontWeight: '700', color: '#fff', marginTop: 3, fontFamily: 'Inter_700Bold' },

  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  quickAction: { alignItems: 'center', width: '23%' },
  quickIconWrap: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontSize: 9, color: '#e0e7ff', marginTop: 6, textAlign: 'center', fontFamily: 'Inter_400Regular' },

  accountsSection: { padding: 16, paddingTop: 20 },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'Inter_700Bold' },
  viewAll: { fontSize: 12, fontWeight: '600', color: '#a5b4fc', fontFamily: 'Inter_600SemiBold' },

  accountCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10 },
  accountCardHighlighted: { backgroundColor: '#c7d2fe' },
  accountTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  accountIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(79,70,229,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  accountName: { fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' },
  accountType: { fontSize: 10, color: '#6b7280', marginTop: 1, fontFamily: 'Inter_400Regular' },
  activeBadge: { backgroundColor: '#e0e7ff', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  activeBadgeText: { fontSize: 9, fontWeight: '700', color: '#4338ca', fontFamily: 'Inter_700Bold' },
  accountBottomRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginTop: 12,
  },
  balanceLabel: { fontSize: 8, color: '#6b7280', letterSpacing: 0.3, fontFamily: 'Inter_400Regular' },
  balanceValue: { fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2, fontFamily: 'Inter_700Bold' },
  rightValue: { fontSize: 12, fontWeight: '700', marginTop: 2, fontFamily: 'Inter_700Bold' },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 14 },
  helpCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#c7d2fe', borderRadius: 16, padding: 14,
  },
  helpIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  helpTitle: { fontSize: 12, fontWeight: '700', color: '#312e81', fontFamily: 'Inter_700Bold' },
  helpDesc: { fontSize: 10, color: '#3730a3', marginTop: 2, lineHeight: 14, fontFamily: 'Inter_400Regular' },
  askBtn: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  askBtnText: { fontSize: 11, fontWeight: '700', color: '#4338ca', fontFamily: 'Inter_700Bold' },
});
