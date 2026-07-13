import { formatInvoiceAmount, getCurrencySymbol } from './format-invoice-amount';

describe('getCurrencySymbol', () => {
  it('returns the dollar sign for en', () => {
    expect(getCurrencySymbol('en')).toBe('$');
  });

  it('returns the euro sign for fr', () => {
    expect(getCurrencySymbol('fr')).toBe('€');
  });
});

describe('formatInvoiceAmount', () => {
  it('formats with two decimal places and thousands separators', () => {
    expect(formatInvoiceAmount(1234.5, 'en')).toBe('1,234.50');
  });

  it('defaults to the en locale', () => {
    expect(formatInvoiceAmount(1000)).toBe('1,000.00');
  });

  it('formats using the fr locale grouping', () => {
    // fr locale groups with a non-breaking space and uses a comma decimal separator
    expect(formatInvoiceAmount(1234.5, 'fr')).toBe(
      (1234.5).toLocaleString('fr', { minimumFractionDigits: 2 })
    );
  });
});
