export function formatMoney(amount, locale = "en-US", currency = "USD") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}
