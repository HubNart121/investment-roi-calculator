export const DEFAULT_PROJECT = {
  name: '',
  data: {
    initialInvestment: '',
    years: 5,
    discountRate: 10,
    growthRate: 0,
    baseCashFlow: '',
    cashFlows: [],
    notes: '',
  },
}

export const STORAGE_KEY = 'inv-calculator-projects'

export const LABELS = {
  npv: 'NPV',
  irr: 'IRR',
  roi: 'ROI',
  paybackPeriod: 'Payback Period',
  initialInvestment: 'เงินลงทุนเริ่มต้น',
  years: 'จำนวนปี',
  discountRate: 'อัตราคิดลด (%)',
  growthRate: 'อัตราเติบโต (%)',
  baseCashFlow: 'กระแสเงินสดปีแรก',
  cashFlow: 'กระแสเงินสด',
  notes: 'หมายเหตุ',
}

export const CURRENCY_OPTIONS = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}

export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return new Intl.NumberFormat('th-TH', CURRENCY_OPTIONS).format(value)
}

export const formatPercent = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return `${value.toFixed(2)}%`
}
