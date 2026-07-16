const t = {
  appName: { ar: 'بيفور باي', en: 'BeforePay' },
  bankName: { ar: 'بنك الإنماء', en: 'Inma Bank' },

  // Nav
  navHome: { ar: 'الرئيسية', en: 'Home' },
  navPayments: { ar: 'المدفوعات', en: 'Payments' },
  navCard: { ar: 'البطاقة', en: 'Card' },
  navBank: { ar: 'لوحة البنك', en: 'Bank Panel' },

  // Home
  recurringCard: { ar: 'بطاقة المدفوعات المتكررة', en: 'Recurring Payments Card' },
  monthlyLimit: { ar: 'الحد الشهري', en: 'Monthly Limit' },
  usedOf: { ar: 'مستخدم من', en: 'used of' },
  needsDecisionToday: { ar: 'يحتاج قرارك اليوم', en: "Needs Your Decision Today" },
  upcomingDeduction: { ar: 'خصم قادم', en: 'Upcoming Deduction' },
  tomorrow: { ar: 'غداً', en: 'Tomorrow' },
  daysLeft: { ar: 'أيام متبقية', en: 'days left' },
  btnContinue: { ar: 'استمرار', en: 'Continue' },
  btnPostpone: { ar: 'تأجيل', en: 'Postpone' },
  btnFreeze: { ar: 'تجميد', en: 'Freeze' },
  upcomingPayments: { ar: 'أقرب المدفوعات', en: 'Upcoming Payments' },
  viewAll: { ar: 'عرض الكل', en: 'View All' },
  sar: { ar: 'ر.س', en: 'SAR' },
  decisionContinued: { ar: 'تم الاستمرار', en: 'Continued' },
  decisionPostponed: { ar: 'تم التأجيل', en: 'Postponed' },
  decisionFrozen: { ar: 'تم التجميد', en: 'Frozen' },
  btnUndo: { ar: 'تراجع', en: 'Undo' },
  priceIncreased: { ar: 'السعر ارتفع', en: 'Price Increased' },
  trialEnding: { ar: 'الفترة التجريبية تنتهي', en: 'Trial Ending' },
  unused: { ar: 'غير مستخدم', en: 'Unused' },

  // Payments
  paymentsTitle: { ar: 'جميع المدفوعات', en: 'All Payments' },
  filter7days: { ar: '7 أيام', en: '7 Days' },
  filter30days: { ar: '30 يومًا', en: '30 Days' },
  nextDeduction: { ar: 'موعد الخصم', en: 'Next Deduction' },
  status: { ar: 'الحالة', en: 'Status' },
  statusActive: { ar: 'نشط', en: 'Active' },
  statusNeedsDecision: { ar: 'يحتاج قرار', en: 'Needs Decision' },
  statusTrialEnding: { ar: 'تجريبي ينتهي', en: 'Trial Ending' },
  statusUnused: { ar: 'غير مستخدم', en: 'Unused' },
  noPaymentsInRange: { ar: 'لا توجد مدفوعات في هذه الفترة', en: 'No payments in this period' },

  // Card
  cardTitle: { ar: 'بطاقتي', en: 'My Card' },
  virtualCard: { ar: 'بطاقة افتراضية', en: 'Virtual Card' },
  recurringPayments: { ar: 'مدفوعات متكررة', en: 'Recurring Payments' },
  cardholderName: { ar: 'اسم حامل البطاقة', en: 'Cardholder Name' },
  cardNumber: { ar: 'رقم البطاقة', en: 'Card Number' },
  expiryDate: { ar: 'تاريخ الانتهاء', en: 'Expires' },
  monthlyLimitSetting: { ar: 'الحد الشهري', en: 'Monthly Limit' },
  adjustLimit: { ar: 'تعديل الحد', en: 'Adjust Limit' },
  freezeCard: { ar: 'تجميد البطاقة', en: 'Freeze Card' },
  freezeCardDesc: { ar: 'إيقاف جميع المدفوعات المتكررة مؤقتًا', en: 'Temporarily stop all recurring payments' },
  cardFrozen: { ar: 'البطاقة مجمدة', en: 'Card Frozen' },
  cardActive: { ar: 'البطاقة نشطة', en: 'Card Active' },

  // Bank Dashboard
  bankTitle: { ar: 'لوحة تحكم البنك', en: 'Bank Dashboard' },
  savingsPotential: { ar: 'إمكانية التوفير', en: 'Savings Potential' },
  priceChangedServices: { ar: 'خدمات تغير سعرها', en: 'Price-Changed Services' },
  unusedServices: { ar: 'خدمات غير مستخدمة', en: 'Unused Services' },
  riskScore: { ar: 'درجة الخطورة', en: 'Risk Score' },
  mostChangedMerchants: { ar: 'أكثر التجار تغييرًا للأسعار', en: 'Most Price-Changing Merchants' },
  riskDistribution: { ar: 'توزيع درجة الخطورة', en: 'Risk Distribution' },
  priceChanges: { ar: 'تغييرات السعر', en: 'price changes' },
  percentage: { ar: 'نسبة التغيير', en: 'Change %' },

  // General
  dark: { ar: 'داكن', en: 'Dark' },
  light: { ar: 'فاتح', en: 'Light' },
  days: { ar: 'يوم', en: 'days' },
}

export default t

export function useTranslation(lang) {
  return (key) => {
    if (!t[key]) return key
    return t[key][lang] || t[key]['ar']
  }
}
