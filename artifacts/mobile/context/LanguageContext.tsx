import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ar';
const LANG_KEY = 'madarik_lang_v1';

const translations = {
  en: {
    // Mode select
    modeSelectTag: 'WELCOME TO MADARIK',
    modeSelectTitle: 'Choose Your Path',
    modeSelectSub: 'Select the experience that fits your financial goals. You can switch anytime from your profile.',
    businessTitle: 'Madarik for Business',
    businessDesc: 'Manage company cash flow, business banking, revenues, and expenses with AI-powered insights.',
    businessF1: 'Cash flow analytics',
    businessF2: 'Business banking',
    businessF3: 'AI financial advisor',
    personalTitle: 'Madarik Personal',
    personalDesc: 'Smart investing, behavioral AI scoring, emotion detection, and personal cards management.',
    personalF1: 'Behavioral AI score',
    personalF2: 'Portfolio tracking',
    personalF3: 'Smart insights',
    modeFooter: 'Trusted by 2,400+ businesses and investors across Saudi Arabia',
    // Login
    loginTitle: 'Log in',
    loginUserPlaceholder: 'Username or ID',
    loginPassPlaceholder: 'Password',
    loginRemember: 'Remember me',
    loginBtn: 'Log in',
    loginForgot: 'Forgot Your Credentials?',
    loginNoAccount: "Don't have an account?",
    loginSignUp: ' Sign up',
    loginContact: 'CONTACT US',
    loginCopyright: 'Madarik 2026. All rights reserved',
    // Signup
    signupTitle: 'Sign up',
    signupNationalId: 'National id / Iqama number',
    signupNationalIdPh: 'Fill your ID/Iqama',
    signupMobile: 'Mobile Number',
    signupEmail: 'Email',
    signupEmailPh: 'Fill your Email',
    signupFirstName: 'First Name',
    signupLastName: 'Last Name',
    signupUsername: 'Username',
    signupUsernamePh: 'Fill your Username',
    signupPassword: 'Password',
    signupPasswordPh: 'Fill your password',
    signupAgree: 'I Agree to the Terms And Conditions and confirm that I have read and understood the Privacy Notice',
    signupBtn: 'Sign up',
    signupHaveAccount: 'already have an account?',
    signupLogin: ' Log-in',
    // Modes
    businessMode: 'Business Mode',
    personalMode: 'Personal Mode',
    // Settings — shared
    settingsLanguage: 'Language',
    settingsLanguageValue: 'English',
    settingsNotifications: 'Notifications',
    settingsLogout: 'Log out',
    settingsSignOut: 'Sign Out',
    settingsSwitchBusiness: 'Switch to Business Mode',
    settingsSwitchPersonal: 'Switch to Personal Mode',
    settingsReferral: 'Referral Code',
    settingsVersion: 'Madarik v1.0.0',
    settingsSupport: 'Support',
    settingsHelp: 'Help',
    // Settings — Personal
    settingsPersonalInfo: 'Personal Information',
    settingsCards: 'Cards Management',
    settingsPrivacy: 'Privacy & Security',
    settingsBehavioral: 'Behavioral Assessment',
    settingsProfileTitle: 'Profile',
    // Settings — Business
    settingsAccount: 'Account',
    settingsCompanyDetails: 'Company Details',
    settingsPaymentMethods: 'Payment Methods',
    settingsBilling: 'Billing & Invoices',
    settingsPreferences: 'Preferences',
    settingsCurrency: 'Currency',
    settingsSecurity: 'Security',
    settingsChangePassword: 'Change Password',
    settingsBiometric: 'Biometric Login',
    settingsTwoFactor: 'Two-Factor Auth',
    // Home — Personal
    homeGoodMorning: 'GOOD MORNING',
    homeWelcomeBack: 'Welcome back,',
    homeBalance: 'Total Balance',
    homePortfolio: 'Portfolio',
    homeRecentTx: 'Recent Transactions',
    homeViewAll: 'View all',
    homeInvest: 'Investments',
    homeScore: 'Behavioral Score',
    homeSavings: 'Savings',
    homeCards: 'My Cards',
    // Home — Business
    homeRevenue: 'Revenue',
    homeExpenses: 'Expenses',
    homeCashflow: 'Cash Flow',
    homePayments: 'Upcoming Payments',
    homeActivity: 'Recent Activity',
    homeTotalBal: 'Total Business Balance',
    homeHealthScore: 'Health Score',
    homeAccounts: 'Accounts',
    homeAlerts: 'Alerts',
    // AI
    aiOnline: 'AI Analyst · Online',
    aiTypePlaceholder: 'Ask Modrik anything...',
    aiTypePlaceholderPersonal: 'Type a message, or ask Modrik about your assets...',
  },
  ar: {
    // Mode select
    modeSelectTag: 'أهلاً بك في مدارك',
    modeSelectTitle: 'اختر مسارك',
    modeSelectSub: 'حدد التجربة التي تناسب أهدافك المالية. يمكنك التبديل في أي وقت من ملفك الشخصي.',
    businessTitle: 'مدارك للأعمال',
    businessDesc: 'إدارة التدفق النقدي للشركة، الخدمات المصرفية التجارية، الإيرادات والمصروفات بالذكاء الاصطناعي.',
    businessF1: 'تحليلات التدفق النقدي',
    businessF2: 'الخدمات المصرفية',
    businessF3: 'مستشار مالي ذكي',
    personalTitle: 'مدارك الشخصي',
    personalDesc: 'الاستثمار الذكي، التقييم السلوكي بالذكاء الاصطناعي، اكتشاف المشاعر وإدارة البطاقات الشخصية.',
    personalF1: 'التقييم السلوكي',
    personalF2: 'تتبع المحفظة',
    personalF3: 'رؤى ذكية',
    modeFooter: 'موثوق به من قبل أكثر من 2,400 شركة ومستثمر في المملكة العربية السعودية',
    // Login
    loginTitle: 'تسجيل الدخول',
    loginUserPlaceholder: 'اسم المستخدم أو الهوية',
    loginPassPlaceholder: 'كلمة المرور',
    loginRemember: 'تذكرني',
    loginBtn: 'دخول',
    loginForgot: 'نسيت بيانات الدخول؟',
    loginNoAccount: 'ليس لديك حساب؟',
    loginSignUp: ' سجّل الآن',
    loginContact: 'تواصل معنا',
    loginCopyright: 'مدارك 2026. جميع الحقوق محفوظة',
    // Signup
    signupTitle: 'إنشاء حساب',
    signupNationalId: 'رقم الهوية الوطنية / الإقامة',
    signupNationalIdPh: 'أدخل رقم هويتك',
    signupMobile: 'رقم الجوال',
    signupEmail: 'البريد الإلكتروني',
    signupEmailPh: 'أدخل بريدك الإلكتروني',
    signupFirstName: 'الاسم الأول',
    signupLastName: 'اسم العائلة',
    signupUsername: 'اسم المستخدم',
    signupUsernamePh: 'أدخل اسم المستخدم',
    signupPassword: 'كلمة المرور',
    signupPasswordPh: 'أدخل كلمة المرور',
    signupAgree: 'أوافق على الشروط والأحكام وأؤكد أنني قرأت وفهمت إشعار الخصوصية',
    signupBtn: 'تسجيل',
    signupHaveAccount: 'لديك حساب بالفعل؟',
    signupLogin: ' سجّل دخولك',
    // Modes
    businessMode: 'وضع الأعمال',
    personalMode: 'الوضع الشخصي',
    // Settings — shared
    settingsLanguage: 'اللغة',
    settingsLanguageValue: 'العربية',
    settingsNotifications: 'الإشعارات',
    settingsLogout: 'تسجيل الخروج',
    settingsSignOut: 'تسجيل الخروج',
    settingsSwitchBusiness: 'التحويل إلى وضع الأعمال',
    settingsSwitchPersonal: 'التحويل إلى الوضع الشخصي',
    settingsReferral: 'رمز الإحالة',
    settingsVersion: 'مدارك v1.0.0',
    settingsSupport: 'الدعم الفني',
    settingsHelp: 'المساعدة',
    // Settings — Personal
    settingsPersonalInfo: 'المعلومات الشخصية',
    settingsCards: 'إدارة البطاقات',
    settingsPrivacy: 'الخصوصية والأمان',
    settingsBehavioral: 'التقييم السلوكي',
    settingsProfileTitle: 'الملف الشخصي',
    // Settings — Business
    settingsAccount: 'الحساب',
    settingsCompanyDetails: 'تفاصيل الشركة',
    settingsPaymentMethods: 'طرق الدفع',
    settingsBilling: 'الفواتير',
    settingsPreferences: 'التفضيلات',
    settingsCurrency: 'العملة',
    settingsSecurity: 'الأمان',
    settingsChangePassword: 'تغيير كلمة المرور',
    settingsBiometric: 'تسجيل الدخول البيومتري',
    settingsTwoFactor: 'المصادقة الثنائية',
    // Home — Personal
    homeGoodMorning: 'صباح الخير',
    homeWelcomeBack: 'مرحباً بعودتك،',
    homeBalance: 'الرصيد الإجمالي',
    homePortfolio: 'المحفظة',
    homeRecentTx: 'المعاملات الأخيرة',
    homeViewAll: 'عرض الكل',
    homeInvest: 'الاستثمارات',
    homeScore: 'التقييم السلوكي',
    homeSavings: 'المدخرات',
    homeCards: 'بطاقاتي',
    // Home — Business
    homeRevenue: 'الإيرادات',
    homeExpenses: 'المصروفات',
    homeCashflow: 'التدفق النقدي',
    homePayments: 'المدفوعات القادمة',
    homeActivity: 'النشاط الأخير',
    homeTotalBal: 'إجمالي رصيد الأعمال',
    homeHealthScore: 'نقاط الصحة',
    homeAccounts: 'الحسابات',
    homeAlerts: 'التنبيهات',
    // AI
    aiOnline: 'محلل ذكي · متصل',
    aiTypePlaceholder: 'اسأل مدرك أي شيء...',
    aiTypePlaceholderPersonal: 'اكتب رسالة، أو اسأل مدرك عن أصولك...',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load persisted language on mount
  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY)
      .then(val => { if (val === 'en' || val === 'ar') setLanguage(val); })
      .catch(() => {});
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(l => {
      const next = l === 'en' ? 'ar' : 'en';
      AsyncStorage.setItem(LANG_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[language][key] as string,
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
