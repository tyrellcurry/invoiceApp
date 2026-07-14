import { getLineItemTotal } from '@/features/invoices/utils/get-line-item-total';

describe('getLineItemTotal', () => {
  it('multiplies quantity by unit price', () => {
    expect(getLineItemTotal(2, 200)).toBe(400);
  });

  it('returns the unit price for a quantity of one', () => {
    expect(getLineItemTotal(1, 156)).toBe(156);
  });

  it('returns zero when the quantity is zero', () => {
    expect(getLineItemTotal(0, 156)).toBe(0);
  });

  it('preserves fractional amounts', () => {
    expect(getLineItemTotal(3, 12.5)).toBe(37.5);
  });
});
