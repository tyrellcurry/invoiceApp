import { fromDateInputValue, toDateInputValue } from '@/features/invoices/utils/invoice-date';

describe('toDateInputValue', () => {
  it('converts a display date to an input value', () => {
    expect(toDateInputValue('18 Jul 2021')).toBe('2021-07-18');
  });

  it('zero-pads single digit days', () => {
    expect(toDateInputValue('1 Oct 2021')).toBe('2021-10-01');
  });

  it('returns an empty string for an unparseable value', () => {
    expect(toDateInputValue('not a date')).toBe('');
  });
});

describe('fromDateInputValue', () => {
  it('converts an input value to a display date', () => {
    expect(fromDateInputValue('2021-07-18')).toBe('18 Jul 2021');
  });

  it('returns an empty string for an unparseable value', () => {
    expect(fromDateInputValue('2021/07/18')).toBe('');
  });

  it('round-trips with toDateInputValue', () => {
    expect(fromDateInputValue(toDateInputValue('20 Sep 2021'))).toBe('20 Sep 2021');
  });
});
