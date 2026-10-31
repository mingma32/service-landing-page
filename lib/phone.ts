/** Normalize common pasted/international formats without guessing a country. */
export function normalizeWhatsAppNumber(value: string): string | null {
  const cleaned = value.normalize("NFKC")
    .replace(/[\u0966-\u096f]/g, digit => String(digit.charCodeAt(0) - 0x0966))
    .replace(/[\u0660-\u0669]/g, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060\u2066-\u2069\ufeff\u061c]/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .trim();
  if (!/^\+?[0-9\s().-]+$/.test(cleaned)) return null;
  let digits = cleaned.replace(/\D/g, "");
  let international = cleaned.startsWith("+");
  if (!international && digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }
  if (digits.length < 7 || digits.length > 15) return null;
  if (international && digits.startsWith("0")) return null;
  return (international ? "+" : "") + digits;
}
