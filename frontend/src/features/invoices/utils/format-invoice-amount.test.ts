import {
  formatCurrencyAmount,
  formatInvoiceAmount,
  getCurrencySymbol,
} from './format-invoice-amount';

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

describe('formatCurrencyAmount', () => {
  it('joins the symbol and amount with a non-breaking space, not a plain one', () => {
    const result = formatCurrencyAmount(1234.5, 'en');

    // Written as explicit escapes, not literal characters, so the
    // assertion stays legible and can't be silently normalized back to a
    // plain space by an editor.
    expect(result).toBe('$\u00A01,234.50');
    expect(result).not.toBe('$\u0020' + '1,234.50');
  });
});
