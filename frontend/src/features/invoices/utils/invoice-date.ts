const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Converts a display date ("18 Jul 2021") to an `input[type=date]` value
 * ("2021-07-18"). Returns an empty string when the input can't be parsed.
 */
export const toDateInputValue = (displayDate: string): string => {
  const match = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(displayDate.trim());
  if (!match) {
    return '';
  }
  const [, day, monthName, year] = match;
  const monthIndex = MONTHS.findIndex((month) => month === monthName);
  if (monthIndex === -1) {
    return '';
  }
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Converts an `input[type=date]` value ("2021-07-18") to a display date
 * ("18 Jul 2021"). Returns an empty string for invalid input.
 */
export const fromDateInputValue = (inputValue: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(inputValue.trim());
  if (!match) {
    return '';
  }
  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) {
    return '';
  }
  return `${Number(day)} ${monthName} ${year}`;
};
