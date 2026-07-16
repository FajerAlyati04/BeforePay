export const services = [
  {
    id: 1,
    name: { ar: 'نتفليكس بريميوم', en: 'Netflix Premium' },
    category: { ar: 'ترفيه', en: 'Entertainment' },
    amount: 56,
    currency: 'SAR',
    nextDate: getRelativeDate(3),
    status: 'active',
    riskLevel: 'low',
    priceChanged: false,
    unusedDays: 0,
    logo: 'N',
    color: '#E50914',
    decision: null,
  },
  {
    id: 2,
    name: { ar: 'سبوتيفاي العائلية', en: 'Spotify Family' },
    category: { ar: 'موسيقى', en: 'Music' },
    amount: 32,
    currency: 'SAR',
    nextDate: getRelativeDate(7),
    status: 'active',
    riskLevel: 'low',
    priceChanged: false,
    unusedDays: 0,
    logo: 'S',
    color: '#1DB954',
    decision: null,
  },
  {
    id: 3,
    name: { ar: 'شات جي بي تي بلاس', en: 'ChatGPT Plus' },
    category: { ar: 'إنتاجية', en: 'Productivity' },
    amount: 129,
    oldAmount: 75,
    currency: 'SAR',
    nextDate: getRelativeDate(1),
    status: 'needs_decision',
    riskLevel: 'high',
    priceChanged: true,
    unusedDays: 0,
    logo: 'G',
    color: '#10A37F',
    decision: null,
    reasons: {
      ar: [
        'ارتفع السعر بنسبة 72% مقارنة بالشهر الماضي',
        'تجاوز نسبة 32% من حدك الشهري',
        'يتجاوز متوسط إنفاقك على هذه الفئة بمقدار ضعفين',
      ],
      en: [
        'Price increased by 72% compared to last month',
        'Exceeds 32% of your monthly limit',
        'Double your average spending in this category',
      ],
    },
  },
  {
    id: 4,
    name: { ar: 'أدوبي كلاود الإبداعية', en: 'Adobe Creative Cloud' },
    category: { ar: 'تصميم', en: 'Design' },
    amount: 249,
    currency: 'SAR',
    nextDate: getRelativeDate(14),
    status: 'trial_ending',
    riskLevel: 'medium',
    priceChanged: false,
    unusedDays: 0,
    logo: 'A',
    color: '#FF0000',
    decision: null,
    trialEnding: true,
  },
  {
    id: 5,
    name: { ar: 'كانفا برو', en: 'Canva Pro' },
    category: { ar: 'تصميم', en: 'Design' },
    amount: 42,
    currency: 'SAR',
    nextDate: getRelativeDate(21),
    status: 'unused',
    riskLevel: 'medium',
    priceChanged: false,
    unusedDays: 45,
    logo: 'C',
    color: '#00C4CC',
    decision: null,
  },
]

export const cardInfo = {
  holderName: { ar: 'فجر الياتي', en: 'Fager Alyati' },
  lastFour: '4821',
  monthlyLimit: 400,
  usedAmount: 268,
  frozen: false,
}

export const bankMetrics = {
  totalSavingsPotential: 171,
  priceChangedCount: 2,
  unusedServicesCount: 1,
  riskScore: 68,
  merchants: [
    { name: { ar: 'أوبن إيه آي', en: 'OpenAI' }, changes: 3, changePercent: 72 },
    { name: { ar: 'أدوبي', en: 'Adobe' }, changes: 2, changePercent: 15 },
    { name: { ar: 'ميكروسوفت', en: 'Microsoft' }, changes: 1, changePercent: 8 },
    { name: { ar: 'سبوتيفاي', en: 'Spotify' }, changes: 1, changePercent: 5 },
  ],
  riskDistribution: [
    { label: { ar: 'منخفض', en: 'Low' }, value: 40, color: '#22c55e' },
    { label: { ar: 'متوسط', en: 'Medium' }, value: 35, color: '#f59e0b' },
    { label: { ar: 'مرتفع', en: 'High' }, value: 25, color: '#ef4444' },
  ],
}

function getRelativeDate(daysFromNow) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}
