// Supported display currencies. No live exchange-rate conversion here — this
// only changes how amounts are *displayed* (symbol, grouping), since we
// don't have a real FX rate source. All stored costs stay the same number.
export const CURRENCIES = [
  { code: 'INR', label: 'INR (₹)', locale: 'en-IN' },
  { code: 'USD', label: 'USD ($)', locale: 'en-US' },
  { code: 'EUR', label: 'EUR (€)', locale: 'en-IE' },
  { code: 'GBP', label: 'GBP (£)', locale: 'en-GB' },
]

export function formatCurrency(value, currencyCode = 'INR') {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0]
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function currencySymbol(currencyCode = 'INR') {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0]
  return (0)
    .toLocaleString(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    })
    .replace(/[0-9.,\s]/g, '')
}
